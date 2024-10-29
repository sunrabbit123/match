type MatcherArgument<T, U extends T, V> = [(target: T) => target is U, map: (guarded: U) => V];

export class Matcher<const T, U extends [Function, Function], R = never> {
  constructor(
    private target: T,
    private storage: U[]
  ) {}
  public case<V extends T, W>(...args: MatcherArgument<T, V, W>) {
    const redeclareStorage: Array<(typeof this.storage)[0] | MatcherArgument<T, V, W>> = this.storage;
    redeclareStorage.push(args);
    return new Matcher<T, U | MatcherArgument<T, V, W>, R | W>(this.target, redeclareStorage);
  }

  public run(): R | undefined {
    const stored = this.storage.find((v) => v[0](this.target));
    if (stored === undefined) {
      return undefined;
    }
    return stored[1](this.target) as R;
  }
}
