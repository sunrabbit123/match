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
    this.state = state ? state : { matched: false, handled: undefined };
  }

  public case<U extends T, V>(
    ...[guard, handler]: readonly [guard: Pattern<T, U>, handler: (guarded: U) => V]
  ): Matcher<Exclude<T, U>, R | V> {
    if (this.state.matched) {
      return this as Matcher<Exclude<T, U>, R | V>;
    }

    if (typeof guard === 'function') {
      return this.applyGuardFunction(guard, handler) as Matcher<Exclude<T, U>, R | V>;
    }

    return this.applyGuardPrimitives(guard, handler) as Matcher<Exclude<T, U>, R | V>;
  }

  private applyGuardFunction<U extends T, const V>(guard: (target: T) => target is U, handler: (guarded: U) => V) {
    if (!guard(this.target)) {
      return this;
    }

    (this.state as MatcherState<R | V>) = {
      matched: true,
      handled: handler(this.target),
    };

    return this;
  }

  private applyGuardPrimitives<U extends T, const V>(guard: U, handler: (guarded: U) => V) {
    if (guard !== this.target) {
      return this;
    }

    (this.state as MatcherState<R | V>) = {
      matched: true,
      handled: handler(guard),
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
