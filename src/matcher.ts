type MatcherState<T> = {
  matched: boolean;
  handled: T | undefined;
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

    return this as Matcher<T, R | V>;
  }

  public run(): R | undefined {
    return this.state.handled;
  }
}
