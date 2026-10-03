// Same thresholds as OfferForge-AI/backend/src/services/ai.service.js.

export function answerScore(criteria: readonly number[]) {
  const total = criteria.reduce((sum, value) => sum + value, 0);
  return Math.round((total / criteria.length) * 10);
}

export function verdictFor(score: number) {
  if (score >= 85) return 'Strong';
  if (score >= 70) return 'Solid';
  if (score >= 50) return 'Partial';
  return 'Weak';
}

export function hireRecommendation(score: number | null) {
  if (score === null) return 'Not graded';
  if (score >= 85) return 'Strong hire';
  if (score >= 70) return 'Hire';
  if (score >= 55) return 'Lean no hire';
  return 'No hire';
}

/** The calibration bands the grader prompt gives the model for each 0–10 criterion. */
export function calibrationFor(value: number) {
  if (value >= 9) return 'Best-in-level: correct, complete, precise';
  if (value >= 7) return 'Correct and reasonably complete';
  if (value >= 5) return 'Partially correct, or shallow';
  if (value >= 3) return 'Major gaps or errors';
  return 'Wrong, off-topic or empty';
}

export const UNGRADED_MESSAGE =
  'The AI grader could not be reached, so this answer was saved without a score.';
