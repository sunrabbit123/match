/**
 * from ts-pattern repository
 * https://github.com/gvergnaud/ts-pattern/blob/main/benchmarks/always-last-digit.ts
 */

import { add, complete, cycle, suite } from 'benny';

import { match as tsPatternMatch } from 'ts-pattern';
import { match } from '../src';

type Digit = 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9;

const testMatch = (digit: Digit) => {
  return match(digit)
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
    .run().handled;
};
const testTsPatternExhaustive = (digit: Digit) => {
  return tsPatternMatch(digit)
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
};

const testTsPatternOtherwise = (digit: Digit) => {
  return tsPatternMatch(digit)
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
};

const testIfElse = (digit: Digit) => {
  if (digit === 0) {
    return 'zero';
  } else if (digit === 1) {
    return 'one';
  } else if (digit === 2) {
    return 'two';
  } else if (digit === 3) {
    return 'three';
  } else if (digit === 4) {
    return 'four';
  } else if (digit === 5) {
    return 'five';
  } else if (digit === 6) {
    return 'six';
  } else if (digit === 7) {
    return 'seven';
  } else if (digit === 8) {
    return 'eight';
  } else if (digit === 9) {
    return 'nine';
  } else {
    return '';
  }
};

const testSwitch = (digit: Digit) => {
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
    default:
      return '';
  }
};

const testTernary = (digit: Digit) => {
  return digit === 0
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
};

suite(
  '@sunrabbit123/match.benchmark',
  add('@sunrabbit123/match.run()', () => testMatch(9)),
  add('ts-pattern.exhaustive()', () => testTsPatternExhaustive(9)),
  add('ts-pattern.otherwise()', () => testTsPatternOtherwise(9)),
  add('if/else', () => testIfElse(9)),
  add('switch', () => testSwitch(9)),
  add('ternary', () => testTernary(9)),
  cycle(),
  complete()
);
