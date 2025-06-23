
export interface KanalMarla {
  kanal: number;
  marla: number;
}

export interface Fraction {
  numerator: number;
  denominator: number;
}

export interface FractionalShareEntry {
  id: string;
  fractionStr: string;
  shareValue?: number; // In Farrad
  error?: string;
}

export interface FractionOperationEntry {
  id: string;
  fraction1Str: string;
  fraction2Str: string;
  operator: '+' | '-';
  result?: {
    fraction: string; // e.g., "1/15"
    decimal: number; // e.g., 0.0667
    percentage: string; // e.g., "6.67%"
  };
  error?: string;
}
    