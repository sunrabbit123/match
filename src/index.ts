/* eslint-disable @typescript-eslint/ban-types */
type MatcherArgument<T, U extends T, V> = [(target: T) => target is U, map: (guarded: U) => V];

export type Matcher<T, U extends [Function, Function], R> = {
  case: <V extends T, W>(...args: MatcherArgument<T, V, W>) => Matcher<T, U | MatcherArgument<T, V, W>, R | W>;
  get: () => R | undefined;
};

export const match = <T>(target: T) => {
  const getMatcher = <U extends [Function, Function], R>(storage: Array<U>): Matcher<T, U, R> => ({
    case: <V extends T, W>(...args: MatcherArgument<T, V, W>) => {
      const redeclareStorage: Array<(typeof storage)[0] | MatcherArgument<T, V, W>> = storage;
      redeclareStorage.push(args);
      return getMatcher<U | MatcherArgument<T, V, W>, R | W>(redeclareStorage);
    },
    get: (): R | undefined => {
      const stored = storage.find((v) => v[0](target));
      if (stored === undefined) {
        return undefined;
      }
      return stored[1](target) as R;
    },
  });

  return getMatcher<never, never>([]);
};
