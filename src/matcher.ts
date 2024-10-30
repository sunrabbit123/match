type MatcherState<T> =
  | {
      matched: true;
      handled: T;
    }
  | {
      matched: false;
      handled: undefined;
    };

export class Matcher<const T, R = never> {
  state: MatcherState<R>;
  constructor(
    private target: T,
    state?: MatcherState<R>
  ) {
    this.state = state ? state : { matched: false, handled: undefined };
  }

  public case<U extends T, V>(guard: (target: T) => target is U, handler: (guarded: U) => V) {
    if (this.state.matched) {
      return this;
    }

    if (!guard(this.target)) {
      return this;
    }

    (this.state as MatcherState<R | V>) = {
      matched: true,
      handled: handler(this.target),
    };

    return this as Matcher<Exclude<T, U>, R | V>;
  }

  public run(): MatcherState<R> & { origin: T } {
    return {
      ...this.state,
      origin: this.target,
    };
  }
}
