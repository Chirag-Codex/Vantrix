/**
 * @typedef {'experience'|'job_titles'|'other'|'assessment_skill'} CriterionCategory
 * @typedef {{id: string, category: CriterionCategory, label: string, values: string[]}} Criterion
 * @typedef {{
 *   rawPrompt: string,
 *   attachedBriefFile: {name: string, size: number, type: string} | null,
 *   mustHave: Criterion[],
 *   niceToHave: Criterion[]
 * }} CriteriaConfig
 * @typedef {{
 *   id: string,
 *   name: string,
 *   yearsExperience: number,
 *   jobTitles: string[],
 *   otherAttributes: string[],
 *   tier: 'P1'|'P2'|'P3',
 *   headline: string
 * }} Candidate
 */

export const SAMPLE_PROMPT =
  'An English-speaking full-stack developer with 3+ years of experience and previous team lead experience.';

export const SAMPLE_MUST_HAVE = [
  {
    id: 'crit-exp',
    category: 'experience',
    label: 'Years of experience',
    values: ['3+ years'],
  },
];

export const SAMPLE_NICE_TO_HAVE = [
  {
    id: 'crit-titles',
    category: 'job_titles',
    label: 'Job titles',
    values: ['full-stack developer', 'team lead'],
  },
  {
    id: 'crit-other',
    category: 'other',
    label: 'Other requirements',
    values: ['Team lead experience', 'English-speaking', 'Problem solving', 'API design'],
  },
];

/** @type {Candidate[]} */
export const SAMPLE_CANDIDATES = [
  {
    id: 'cand-a',
    name: 'Aarav Sharma',
    yearsExperience: 5,
    jobTitles: ['Full-stack Developer', 'Senior Backend Engineer', 'Team Lead'],
    otherAttributes: ['Team lead experience', 'English-speaking', 'Problem solving', 'API design'],
    tier: 'P1',
    headline: 'Senior Full-Stack & Lead Engineer',
  },
  {
    id: 'cand-b',
    name: 'Priya Raman',
    yearsExperience: 4,
    jobTitles: ['Full-stack Developer', 'Frontend Specialist'],
    otherAttributes: ['English-speaking', 'API design', 'Problem solving'],
    tier: 'P1',
    headline: 'Full-Stack Developer',
  },
  {
    id: 'cand-c',
    name: 'Karan Mehta',
    yearsExperience: 3,
    jobTitles: ['Backend Engineer', 'Systems Programmer'],
    otherAttributes: ['Problem solving', 'API design'],
    tier: 'P2',
    headline: 'Systems & Backend Engineer',
  },
  {
    id: 'cand-d',
    name: 'Maya Chen',
    yearsExperience: 2, // Excluded by 3+ years
    jobTitles: ['Full-stack Developer', 'Team Lead'],
    otherAttributes: ['Team lead experience', 'English-speaking', 'Problem solving'],
    tier: 'P2',
    headline: 'Associate Full-Stack Developer',
  },
  {
    id: 'cand-e',
    name: 'Elena Rostova',
    yearsExperience: 6,
    jobTitles: ['DevOps Engineer', 'Infrastructure Architect'],
    otherAttributes: ['System design', 'Problem solving'],
    tier: 'P3',
    headline: 'Cloud Infrastructure Lead',
  },
];
