import { bench, describe, expect } from 'vitest';
import { match as tsPatternMatch } from 'ts-pattern';
import { match } from '../src';

type Digit = 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9;

describe('@sunrabbit123/match-benchmark/random-digit', () => {
  const rand = () => Math.floor(Math.random() * 10) as Digit;
  const digitToString = (digit: Digit) => {
    switch (digit) {
      case 0:
        return 'zero';
      case 1:
        return 'one';
      case 2:
        return 'two';
      case 3:
        return 'three';
      case 4:
        return 'four';
      case 5:
        return 'five';
      case 6:
        return 'six';
      case 7:
        return 'seven';
      case 8:
        return 'eight';
      case 9:
        return 'nine';
    }
  };

  bench('@sunrabbit123/match.run()', () => {
    const digit = rand();
    const result = match(digit)
      .case(0, () => 'zero')
      .case(1, () => 'one')
      .case(2, () => 'two')
      .case(3, () => 'three')
      .case(4, () => 'four')
      .case(5, () => 'five')
      .case(6, () => 'six')
      .case(7, () => 'seven')
      .case(8, () => 'eight')
      .case(9, () => 'nine')
      .run();
    expect(result.handled).toBe(digitToString(digit));
  });

  bench('ts-pattern.exhaustive()', () => {
    const digit = rand();
    const result = tsPatternMatch(digit)
      .with(0, () => 'zero')
      .with(1, () => 'one')
      .with(2, () => 'two')
      .with(3, () => 'three')
      .with(4, () => 'four')
      .with(5, () => 'five')
      .with(6, () => 'six')
      .with(7, () => 'seven')
      .with(8, () => 'eight')
      .with(9, () => 'nine')
      .exhaustive();
    expect(result).toBe(digitToString(digit));
  });

  bench('ts-pattern.otherwise()', () => {
    const digit = rand();
    const result = tsPatternMatch(digit)
      .with(0, () => 'zero')
      .with(1, () => 'one')
      .with(2, () => 'two')
      .with(3, () => 'three')
      .with(4, () => 'four')
      .with(5, () => 'five')
      .with(6, () => 'six')
      .with(7, () => 'seven')
      .with(8, () => 'eight')
      .with(9, () => 'nine')
      .otherwise(() => '');
    expect(result).toBe(digitToString(digit));
  });

  bench('if/else', () => {
    const digit = rand();
    let result = '';
    if (digit === 0) {
      result = 'zero';
    } else if (digit === 1) {
      result = 'one';
    } else if (digit === 2) {
      result = 'two';
    } else if (digit === 3) {
      result = 'three';
    } else if (digit === 4) {
      result = 'four';
    } else if (digit === 5) {
      result = 'five';
    } else if (digit === 6) {
      result = 'six';
    } else if (digit === 7) {
      result = 'seven';
    } else if (digit === 8) {
      result = 'eight';
    } else if (digit === 9) {
      result = 'nine';
    }
    expect(result).toBe(digitToString(digit));
  });

  bench('switch', () => {
    const digit = rand();
    let result = '';
    switch (digit) {
      case 0:
        result = 'zero';
        break;
      case 1:
        result = 'one';
        break;
      case 2:
        result = 'two';
        break;
      case 3:
        result = 'three';
        break;
      case 4:
        result = 'four';
        break;
      case 5:
        result = 'five';
        break;
      case 6:
        result = 'six';
        break;
      case 7:
        result = 'seven';
        break;
      case 8:
        result = 'eight';
        break;
      case 9:
        result = 'nine';
        break;
    }
    expect(result).toBe(digitToString(digit));
  });

  bench('ternary', () => {
    const digit = rand();
    const result =
      digit === 0
        ? 'zero'
        : digit === 1
          ? 'one'
          : digit === 2
            ? 'two'
            : digit === 3
              ? 'three'
              : digit === 4
                ? 'four'
                : digit === 5
                  ? 'five'
                  : digit === 6
                    ? 'six'
                    : digit === 7
                      ? 'seven'
                      : digit === 8
                        ? 'eight'
                        : digit === 9
                          ? 'nine'
                          : '';
    expect(result).toBe(digitToString(digit));
  });
});
