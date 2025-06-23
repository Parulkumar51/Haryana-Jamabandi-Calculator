
import { Fraction } from '../types';

export const gcd = (a: number, b: number): number => {
  if (b === 0) {
    return a;
  }
  return gcd(b, a % b);
};

export const simplifyFraction = (numerator: number, denominator: number): Fraction => {
  if (denominator === 0) {
    throw new Error("Denominator cannot be zero.");
  }
  if (numerator === 0) {
    return { numerator: 0, denominator: 1 };
  }
  const commonDivisor = gcd(Math.abs(numerator), Math.abs(denominator));
  let num = numerator / commonDivisor;
  let den = denominator / commonDivisor;

  if (den < 0) { // Ensure denominator is positive
    num = -num;
    den = -den;
  }
  return { numerator: num, denominator: den };
};

export const parseFraction = (fractionStr: string): Fraction | null => {
  if (!fractionStr || typeof fractionStr !== 'string') return null;
  const parts = fractionStr.split('/');
  if (parts.length !== 2) return null;
  
  const num = parseInt(parts[0], 10);
  const den = parseInt(parts[1], 10);

  if (isNaN(num) || isNaN(den)) return null;
  if (den === 0) return null; // Denominator cannot be zero

  return { numerator: num, denominator: den };
};

export const addFractions = (f1: Fraction, f2: Fraction): Fraction => {
  const numerator = f1.numerator * f2.denominator + f2.numerator * f1.denominator;
  const denominator = f1.denominator * f2.denominator;
  return simplifyFraction(numerator, denominator);
};

export const subtractFractions = (f1: Fraction, f2: Fraction): Fraction => {
  const numerator = f1.numerator * f2.denominator - f2.numerator * f1.denominator;
  const denominator = f1.denominator * f2.denominator;
  return simplifyFraction(numerator, denominator);
};

export const roundToPrecision = (num: number, precision: number): number => {
  const factor = Math.pow(10, precision);
  return Math.round(num * factor) / factor;
};
    