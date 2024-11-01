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
