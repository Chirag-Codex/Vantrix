/**
 * Pure functions for candidate ranking, evaluation, and rule-based brief parsing.
 */

/**
 * Extracts numeric years from criteria strings like "3+ years", "5 years", "2"
 * @param {string} val
 * @returns {number}
 */
export function extractYears(val) {
  const match = String(val).match(/(\d+)/);
  return match ? parseInt(match[1], 10) : 0;
}

/**
 * Checks if a candidate matches a specific criterion.
 * @param {import('../config/criteriaSample').Criterion} criterion
 * @param {import('../config/criteriaSample').Candidate} candidate
 * @returns {{
 *   status: 'met' | 'partial' | 'missed',
 *   matchedCount: number,
 *   totalCount: number,
 *   detail: string
 * }}
 */
export function evaluateCriterion(criterion, candidate) {
  const { category, values = [] } = criterion;
  if (!values.length) {
    return { status: 'met', matchedCount: 1, totalCount: 1, detail: 'No specific values specified' };
  }

  if (category === 'experience') {
    const required = Math.max(...values.map(extractYears), 0);
    const candidateYears = candidate.yearsExperience || 0;
    if (candidateYears >= required) {
      return {
        status: 'met',
        matchedCount: 1,
        totalCount: 1,
        detail: `${candidateYears} years meets ${required}+ required`,
      };
    }
    return {
      status: 'missed',
      matchedCount: 0,
      totalCount: 1,
      detail: `Has ${candidateYears} years, requires ${required}+`,
    };
  }

  // Set of candidate text attributes in lowercase
  const candidatePool = [
    ...(candidate.jobTitles || []),
    ...(candidate.otherAttributes || []),
  ].map((s) => s.toLowerCase().trim());

  let matched = 0;
  values.forEach((v) => {
    const target = v.toLowerCase().trim();
    const hasMatch = candidatePool.some(
      (attr) => attr.includes(target) || target.includes(attr)
    );
    if (hasMatch) matched += 1;
  });

  const total = values.length;
  if (matched === total && total > 0) {
    return { status: 'met', matchedCount: matched, totalCount: total, detail: `All ${total} met` };
  }
  if (matched > 0) {
    return { status: 'partial', matchedCount: matched, totalCount: total, detail: `${matched}/${total} met` };
  }
  return { status: 'missed', matchedCount: 0, totalCount: total, detail: `0/${total} met` };
}

/**
 * Ranks candidates based on criteria configuration.
 * - Any unmet must-have criterion marks candidate as excluded with reason.
 * - Nice-to-have weights follow position order: weight = (n - index) / sum.
 * - Results are sorted by score descending, ties broken by id ascending.
 *
 * @param {import('../config/criteriaSample').CriteriaConfig} config
 * @param {import('../config/criteriaSample').Candidate[]} candidates
 * @returns {{
 *   ranked: Array<import('../config/criteriaSample').Candidate & {
 *     score: number,
 *     filteredOut: boolean,
 *     exclusionReason?: string,
 *     evaluations: Record<string, 'met'|'partial'|'missed'>
 *   }>,
 *   totalFiltered: number,
 *   totalCandidates: number
 * }}
 */
export function rankCandidates(config, candidates = []) {
  const { mustHave = [], niceToHave = [] } = config || {};

  // Compute weights for nice-to-have: (n - index) / sum
  const n = niceToHave.length;
  const weightSum = (n * (n + 1)) / 2 || 1;
  const weights = niceToHave.map((_, idx) => (n - idx) / weightSum);

  const evaluated = candidates.map((cand) => {
    const evaluations = {};
    let filteredOut = false;
    let exclusionReason = '';

    // 1. Evaluate Must-Have (Hard Filters)
    for (const crit of mustHave) {
      const res = evaluateCriterion(crit, cand);
      evaluations[crit.id] = res.status;
      if (res.status === 'missed') {
        filteredOut = true;
        exclusionReason = `Unmet requirement: ${crit.label} (${res.detail})`;
        break; // Stop at first failed must-have
      }
    }

    // 2. Evaluate Nice-to-Have (Weighted Scoring)
    let niceScoreRatio = 0;
    if (n > 0) {
      niceToHave.forEach((crit, idx) => {
        const res = evaluateCriterion(crit, cand);
        evaluations[crit.id] = res.status;
        const ratio = res.totalCount > 0 ? res.matchedCount / res.totalCount : 0;
        niceScoreRatio += ratio * weights[idx];
      });
    } else {
      niceScoreRatio = 1; // No nice-to-have specified
    }

    // Must-have pass provides base 45 points, nice-to-have adds up to 55 points
    let score = 0;
    if (!filteredOut) {
      score = Math.round(45 + niceScoreRatio * 55);
    } else {
      // Excluded candidates get a partial score between 10-35
      score = Math.round(15 + niceScoreRatio * 20);
    }

    return {
      ...cand,
      score: Math.min(100, Math.max(0, score)),
      filteredOut,
      exclusionReason: filteredOut ? exclusionReason : undefined,
      evaluations,
    };
  });

  // Sort: Included candidates first, score desc, ties broken by id asc
  evaluated.sort((a, b) => {
    if (a.filteredOut !== b.filteredOut) {
      return a.filteredOut ? 1 : -1;
    }
    if (b.score !== a.score) {
      return b.score - a.score;
    }
    return String(a.id).localeCompare(String(b.id));
  });

  const totalFiltered = evaluated.filter((c) => c.filteredOut).length;

  return {
    ranked: evaluated,
    totalFiltered,
    totalCandidates: candidates.length,
  };
}

/**
 * Async, abortable, deterministic rule-based mock brief parser.
 * Simulates AI criteria extraction in ~700ms without network requests.
 *
 * @param {string} promptText
 * @param {{name: string, size: number, type: string} | null} [file]
 * @param {AbortSignal} [signal]
 * @returns {Promise<{ mustHave: import('../config/criteriaSample').Criterion[], niceToHave: import('../config/criteriaSample').Criterion[] }>}
 */
export async function onParseBrief(promptText = '', file = null, signal = null) {
  return new Promise((resolve, reject) => {
    const timer = setTimeout(() => {
      if (signal?.aborted) {
        reject(new DOMException('Brief extraction aborted by user', 'AbortError'));
        return;
      }

      const combinedText = `${promptText} ${file ? file.name : ''}`.toLowerCase();

      // Rule 1: Years regex (\d+)\+?\s*years
      const yearMatch = combinedText.match(/(\d+)\+?\s*years?/);
      const parsedYears = yearMatch ? `${yearMatch[1]}+ years` : '3+ years';

      // Rule 2: Job titles dictionary
      const titleDict = [
        'full-stack developer',
        'full stack developer',
        'backend engineer',
        'frontend engineer',
        'team lead',
        'tech lead',
        'engineering manager',
        'devops engineer',
        'systems programmer',
      ];
      const matchedTitles = titleDict.filter((t) => combinedText.includes(t));
      if (!matchedTitles.includes('full-stack developer') && !matchedTitles.length) {
        matchedTitles.push('full-stack developer', 'team lead');
      }

      // Rule 3: Other requirements dictionary
      const otherDict = [
        'team lead experience',
        'english-speaking',
        'problem solving',
        'api design',
        'system design',
        'distributed systems',
        'mentorship',
        'cloud architecture',
      ];
      const matchedOther = otherDict.filter((o) => combinedText.includes(o));
      if (!matchedOther.length) {
        matchedOther.push('Team lead experience', 'English-speaking', 'Problem solving', 'API design');
      } else {
        // Capitalize for display
        matchedOther.forEach((item, i) => {
          matchedOther[i] = item.charAt(0).toUpperCase() + item.slice(1);
        });
      }

      const mustHave = [
        {
          id: `crit-exp-${Date.now()}`,
          category: 'experience',
          label: 'Years of experience',
          values: [parsedYears],
        },
      ];

      const niceToHave = [
        {
          id: `crit-titles-${Date.now()}`,
          category: 'job_titles',
          label: 'Job titles',
          values: Array.from(new Set(matchedTitles)).slice(0, 4),
        },
        {
          id: `crit-other-${Date.now()}`,
          category: 'other',
          label: 'Other requirements',
          values: Array.from(new Set(matchedOther)).slice(0, 6),
        },
      ];

      resolve({ mustHave, niceToHave });
    }, 700);

    if (signal) {
      signal.addEventListener('abort', () => {
        clearTimeout(timer);
        reject(new DOMException('Brief extraction aborted by user', 'AbortError'));
      });
    }
  });
}
