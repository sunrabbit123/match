import { bench, describe, expect } from 'vitest';
import { match as tsPatternMatch } from 'ts-pattern';
import { match } from '../src';

type Digit = 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9;

describe('@sunrabbit123/match.benchmark/always-last-digit', () => {
  bench('@sunrabbit123/match.cases.run()', () => {
    const result = match(9 as Digit)
      .cases(
        [0, () => 'zero'],
        [1, () => 'one'],
        [2, () => 'two'],
        [3, () => 'three'],
        [4, () => 'four'],
        [5, () => 'five'],
        [6, () => 'six'],
        [7, () => 'seven'],
        [8, () => 'eight'],
        [9, () => 'nine']
      )
      .run();
    expect(result.handled).toBe('nine');
  });

  bench('@sunrabbit123/match.case.run()', () => {
    const result = match(9 as Digit)
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
    expect(result.handled).toBe('nine');
  });

  bench('ts-pattern.exhaustive()', () => {
    const result = tsPatternMatch(9 as Digit)
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
    expect(result).toBe('nine');
  });

  bench('ts-pattern.otherwise()', () => {
    const result = tsPatternMatch(9 as Digit)
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
    expect(result).toBe('nine');
  });

  bench('if/else', () => {
    const digit = 9 as Digit;
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
    expect(result).toBe('nine');
  });

  bench('switch', () => {
    const digit = 9 as Digit;
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
    expect(result).toBe('nine');
  });

  bench('ternary', () => {
    const digit = 9 as Digit;
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
    expect(result).toBe('nine');
  });
});
