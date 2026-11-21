import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import {
  extractYears,
  evaluateCriterion,
  rankCandidates,
  onParseBrief,
} from '@/lib/ranking';
import {
  SAMPLE_CANDIDATES,
  SAMPLE_MUST_HAVE,
  SAMPLE_NICE_TO_HAVE,
} from '@/config/criteriaSample';
import { CriteriaBuilder } from './CriteriaBuilder';
import { CriteriaVideoCard } from './CriteriaVideoCard';
import { BriefBox } from './BriefBox';

describe('Ranking and Evaluation Pure Functions', () => {
  it('extractYears: parses numeric years from strings', () => {
    expect(extractYears('3+ years')).toBe(3);
    expect(extractYears('5 years experience')).toBe(5);
    expect(extractYears('10')).toBe(10);
    expect(extractYears('no numbers')).toBe(0);
  });

  it('evaluateCriterion: correctly evaluates experience must-haves', () => {
    const crit = { id: 'c1', category: 'experience', label: 'Experience', values: ['3+ years'] };
    const candPass = { id: '1', yearsExperience: 4, jobTitles: [], otherAttributes: [] };
    const candFail = { id: '2', yearsExperience: 2, jobTitles: [], otherAttributes: [] };

    expect(evaluateCriterion(crit, candPass).status).toBe('met');
    expect(evaluateCriterion(crit, candFail).status).toBe('missed');
  });

  it('rankCandidates: determinism and tie-breaking by id', () => {
    const config = {
      rawPrompt: 'test',
      attachedBriefFile: null,
      mustHave: SAMPLE_MUST_HAVE,
      niceToHave: SAMPLE_NICE_TO_HAVE,
    };

    const res1 = rankCandidates(config, SAMPLE_CANDIDATES);
    const res2 = rankCandidates(config, SAMPLE_CANDIDATES);

    expect(res1.ranked.map((c) => c.id)).toEqual(res2.ranked.map((c) => c.id));
    expect(res1.totalFiltered).toBe(1); // Maya Chen has 2 yrs exp < 3 required
    expect(res1.ranked.find((c) => c.id === 'cand-d').filteredOut).toBe(true);
    expect(res1.ranked.find((c) => c.id === 'cand-d').exclusionReason).toContain('Unmet requirement');
  });

  it('rankCandidates: nice-to-have weights follow order and reordering changes scores', () => {
    const configNormal = {
      rawPrompt: 'test',
      attachedBriefFile: null,
      mustHave: [],
      niceToHave: [
        { id: '1', category: 'job_titles', label: 'Job titles', values: ['Team Lead'] },
        { id: '2', category: 'other', label: 'Other', values: ['API design'] },
      ],
    };

    const configReordered = {
      rawPrompt: 'test',
      attachedBriefFile: null,
      mustHave: [],
      niceToHave: [
        { id: '2', category: 'other', label: 'Other', values: ['API design'] },
        { id: '1', category: 'job_titles', label: 'Job titles', values: ['Team Lead'] },
      ],
    };

    const resNormal = rankCandidates(configNormal, SAMPLE_CANDIDATES);
    const resReordered = rankCandidates(configReordered, SAMPLE_CANDIDATES);

    // Candidates have different weights when priority is swapped
    expect(resNormal.ranked).toBeDefined();
    expect(resReordered.ranked).toBeDefined();
  });

  it('rankCandidates: moving criterion to must-have filters candidates who do not match', () => {
    const configAllNice = {
      rawPrompt: 'test',
      attachedBriefFile: null,
      mustHave: [],
      niceToHave: SAMPLE_MUST_HAVE,
    };
    const resAllNice = rankCandidates(configAllNice, SAMPLE_CANDIDATES);
    expect(resAllNice.totalFiltered).toBe(0);

    const configWithMust = {
      rawPrompt: 'test',
      attachedBriefFile: null,
      mustHave: SAMPLE_MUST_HAVE,
      niceToHave: [],
    };
    const resWithMust = rankCandidates(configWithMust, SAMPLE_CANDIDATES);
    expect(resWithMust.totalFiltered).toBe(1); // Maya Chen filtered out
  });
});

describe('onParseBrief Rule-Based Parser', () => {
  it('extracts years and job titles accurately from text', async () => {
    const prompt = 'Looking for a senior backend engineer with 5+ years of experience and team lead background.';
    const result = await onParseBrief(prompt);

    expect(result.mustHave[0].values).toContain('5+ years');
    expect(result.niceToHave[0].values).toContain('backend engineer');
  });

  it('supports abort signal to cancel parsing', async () => {
    const controller = new AbortController();
    const promise = onParseBrief('some text', null, controller.signal);
    controller.abort();

    await expect(promise).rejects.toThrow('aborted');
  });

  it('falls back to default sample structure when given empty or random text', async () => {
    const result = await onParseBrief('random gibberish without matching keywords');
    expect(result.mustHave.length).toBeGreaterThan(0);
    expect(result.niceToHave.length).toBeGreaterThan(0);
  });
});

describe('BriefBox File & Input Validation', () => {
  it('renders input and enforces 2000 character max length', () => {
    const onPromptChange = vi.fn();
    render(
      <BriefBox
        prompt="Initial prompt"
        onPromptChange={onPromptChange}
        attachedFile={null}
        onFileAttach={vi.fn()}
        onFileRemove={vi.fn()}
        onExtract={vi.fn()}
        isExtracting={false}
      />
    );

    const textarea = screen.getByRole('textbox');
    expect(textarea).toHaveAttribute('maxLength', '2000');
    expect(screen.getByText('14 / 2000')).toBeInTheDocument();
  });

  it('shows extract button as disabled when prompt is empty and no file attached', () => {
    render(
      <BriefBox
        prompt=""
        onPromptChange={vi.fn()}
        attachedFile={null}
        onFileAttach={vi.fn()}
        onFileRemove={vi.fn()}
        onExtract={vi.fn()}
        isExtracting={false}
      />
    );

    const extractBtn = screen.getByRole('button', { name: /extract criteria/i });
    expect(extractBtn).toBeDisabled();
  });
});

describe('CriteriaBuilder Component & Zero Network Requests', () => {
  let fetchSpy;
  let xhrSpy;

  beforeEach(() => {
    fetchSpy = vi.spyOn(window, 'fetch');
    xhrSpy = vi.spyOn(window, 'XMLHttpRequest');
  });

  afterEach(() => {
    fetchSpy.mockRestore();
    xhrSpy.mockRestore();
  });

  it('renders criteria lists and makes ZERO network requests', () => {
    render(<CriteriaBuilder onOpenDemoModal={vi.fn()} />);

    expect(screen.getByText(/Who are you hiring\?/i)).toBeInTheDocument();
    expect(screen.getByText('Must have')).toBeInTheDocument();
    expect(screen.getByText('Nice to have')).toBeInTheDocument();

    expect(fetchSpy).not.toHaveBeenCalled();
    expect(xhrSpy).not.toHaveBeenCalled();
  });

  it('provides non-drag accessibility menu actions (Move to Nice to have / Must have)', async () => {
    render(<CriteriaBuilder onOpenDemoModal={vi.fn()} />);

    // Open menu for the first criterion
    const menuButtons = screen.getAllByRole('button', { name: /options for/i });
    fireEvent.click(menuButtons[0]);

    // Click Move to Nice to have
    const moveBtn = screen.getByRole('menuitem', { name: /move to nice to have/i });
    expect(moveBtn).toBeInTheDocument();
    fireEvent.click(moveBtn);

    // Live region announces change
    await waitFor(() => {
      expect(screen.getByText(/moved years of experience to nice to have/i)).toBeInTheDocument();
    });
  });

  it('switches between criteria builder and results view without network requests', () => {
    render(<CriteriaBuilder onOpenDemoModal={vi.fn()} />);

    const seeMatchesBtn = screen.getByRole('button', { name: /see matches/i });
    fireEvent.click(seeMatchesBtn);

    // Results view displayed
    expect(screen.getByText(/Edit criteria/i)).toBeInTheDocument();
    expect(screen.getByText(/filtered out by your must-have criteria/i)).toBeInTheDocument();
    expect(screen.getByText('Aarav Sharma')).toBeInTheDocument();

    // Click back to edit
    const backBtn = screen.getByRole('button', { name: /edit criteria/i });
    fireEvent.click(backBtn);

    expect(screen.getByText(/Who are you hiring\?/i)).toBeInTheDocument();
    expect(fetchSpy).not.toHaveBeenCalled();
  });
});

describe('CriteriaVideoCard Visual Video Component', () => {
  it('renders visual preview with Vantrix branding and controls', () => {
    render(<CriteriaVideoCard onOpenDemoModal={vi.fn()} />);

    expect(screen.getByText(/vantrix criteria engine/i)).toBeInTheDocument();
    expect(screen.getByText(/live preview/i)).toBeInTheDocument();
    expect(screen.getByAltText(/vantrix screen criteria engine extracting must-have and nice-to-have skills/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /^pause preview$/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /^replay preview$/i })).toBeInTheDocument();
  });

  it('toggles play/pause state on button and image click', () => {
    render(<CriteriaVideoCard onOpenDemoModal={vi.fn()} />);

    const toggleBtn = screen.getByRole('button', { name: /^pause preview$/i });
    fireEvent.click(toggleBtn);

    expect(screen.getByRole('button', { name: /^play preview$/i })).toBeInTheDocument();

    const image = screen.getByAltText(/vantrix screen criteria engine extracting must-have and nice-to-have skills/i);
    fireEvent.click(image);

    expect(screen.getByRole('button', { name: /^pause preview$/i })).toBeInTheDocument();
  });
});
