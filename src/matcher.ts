/* eslint-disable @typescript-eslint/ban-types */
type MatcherState<T> =
  | {
      matched: true;
      handled: T;
    }
  | {
      matched: false;
      handled: undefined;
    };

export type Primitives = number | boolean | string | undefined | null | symbol | bigint;

type Pattern<T, U extends T> = ((target: T) => target is U) | (U extends Primitives ? U : never);

export class Matcher<const T, R = never> {
  state: MatcherState<R>;
  constructor(
    private target: T,
    state?: MatcherState<R>
  ) {
    this.state = state || { matched: false, handled: undefined };
  }

  public cases<const Origin extends Array<unknown>>(...args: CasesArgument<T, Origin>) {
    args;
    // ^?
    return this;
  }
  public case<U extends T, V>(pattern: Pattern<T, U>, handler: (result: U) => V): Matcher<Exclude<T, U>, R | V> {
    if (this.state.matched) {
      return this as Matcher<Exclude<T, U>, R | V>;
    }

    return this.applyPattern(pattern, handler) as Matcher<Exclude<T, U>, R | V>;
  }

  private applyPattern<U extends T, const V>(pattern: Pattern<T, U>, handler: (result: U) => V) {
    if (typeof pattern === 'function' && !pattern(this.target)) {
      return this;
    } else if (pattern !== this.target) {
      return this;
    }

    (this.state as MatcherState<R | V>) = {
      matched: true,
      handled: handler(this.target as U),
    };

    return this;
  }

  public run(): MatcherState<R> & { origin: T } {
    return {
      ...this.state,
      origin: this.target,
    };
  }
}

export const match = <const T>(target: T) => {
  return new Matcher(target);
};

type CasesArgument<Target, Origin> = Origin extends [...(readonly [unknown, unknown])[]]
  ? Origin extends [readonly [Pattern<Target, infer U>, (result: infer U) => infer V]]
    ? U extends Target
      ? [readonly [Pattern<Target, U>, (result: U) => V]]
      : Origin
    : Origin extends [readonly [Pattern<Target, infer U>, (result: infer U) => infer V], ...infer Rest]
      ? [readonly [Pattern<Target, U>, (result: U) => V], ...CasesArgument<Target, Rest>]
      : Origin
  : never;

// public cases<const Origin extends Array<unknown>>(...args: CasesArgument<T, Origin>) {
//   args;
//   // ^?
//   return this;
// }

const a = new Matcher(1 as 1 | 2 | 3 | 4 | 5);
a.cases([2, (v) => 'two']);
// (method) Matcher<1 | 2 | 3 | 4 | 5, never>.cases<[readonly [2, () => "two"]]>(args_0: readonly [2, () => "two"]): Matcher<1 | 2 | 3 | 4 | 5, never>
// (method) Matcher<2 | 1 | 3 | 4 | 5, never>.cases<[(number | (() => "two"))[]]>(args_0: (number | (() => "two"))[]): Matcher<2 | 1 | 3 | 4 | 5, never>
a.cases([2, (v) => 'two'], [3, (v) => 'three']);
// (method) Matcher<1 | 2 | 3 | 4 | 5, never>.cases<[readonly [2, () => "two"], readonly [3, () => "three"]]>(args_0: readonly [2, () => "two"], args_1: readonly [3, () => "three"]): Matcher<1 | 2 | 3 | 4 | 5, never>
// (method) Matcher<2 | 1 | 3 | 4 | 5, never>.cases<[(number | (() => "two"))[], (number | (() => "three"))[]]>(args_0: (number | (() => "two"))[], args_1: (number | (() => "three"))[]): Matcher<2 | 1 | 3 | 4 | 5, never>
