export type Manifest = {
  kit_name: string;
  version: string;
  components: Record<string, number>;
};

export type DetectionResult = Record<string, number>;

export type VerificationReport = {
  passed: boolean;
  correct: DetectionResult;
  missing: DetectionResult;
  unexpected: DetectionResult;
  wrong_quantity: DetectionResult;
  needs_review: string[];
};
