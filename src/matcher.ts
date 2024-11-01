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

type CasesArgument<Target, Origin extends unknown[]> = Origin extends [
  readonly [Pattern<Target, infer U>, (arg?: any) => unknown],
]
  ? U extends Target
    ? Origin extends [readonly [Pattern<Target, U>, (arg: U) => unknown]]
      ? Origin
      : never
    : never
  : Origin extends [readonly [Pattern<Target, infer U>, (arg?: any) => unknown], ...infer Rest]
    ? U extends Target
      ? Origin extends [readonly [Pattern<Target, U>, (arg: U) => unknown], ...Rest]
        ? [Origin[0], ...CasesArgument<Target, Rest>]
        : never
      : never
    : never;

export class Matcher<const T, R = never> {
  state: MatcherState<R>;
  constructor(
    private target: T,
    state?: MatcherState<R>
  ) {
    this.state = state || { matched: false, handled: undefined };
  }

  public cases<const Origin extends Array<unknown>>(...fnList: CasesArgument<T, Origin>) {
    for (let i = 0; i < fnList['length']; i++) {
      const pattern = fnList[i][0] as Pattern<T, T>;
      if (typeof pattern === 'function' && !pattern(this.target)) {
        continue;
      } else if (pattern !== this.target) {
        continue;
      }

      this.state = {
        matched: true,
        handled: (fnList[i][1] as (arg: T) => R)(this.target),
      };
      break;
    }
    return this;
  }
  public case<U extends T, V>(pattern: Pattern<T, U>, handler: (result: U) => V): Matcher<Exclude<T, U>, R | V> {
    if (this.state.matched) {
      return this as Matcher<Exclude<T, U>, R | V>;
    }

    if (typeof pattern === 'function') {
      if (!pattern(this.target)) {
        return this as Matcher<Exclude<T, U>, R | V>;
      }
    } else if (pattern !== this.target) {
      return this as Matcher<Exclude<T, U>, R | V>;
    }

    (this.state as MatcherState<R | V>) = {
      matched: true,
      handled: handler(this.target as U),
    };

    return this as Matcher<Exclude<T, U>, R | V>;

    // return this.applyPattern(pattern, handler) as Matcher<Exclude<T, U>, R | V>;
  }

  // private applyPattern<U extends T, const V>(pattern: Pattern<T, U>, handler: (result: U) => V) {

  // }

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

const a: [1, 2] = [1, 2];
a.find;
