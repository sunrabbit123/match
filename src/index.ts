/* eslint-disable @typescript-eslint/ban-types */
type MatcherArgument<T, U extends T, V> = { typeGuard: (target: T) => target is U; map: (guarded: U) => V };

export type Matcher<T, U extends { typeGuard: Function; map: Function }, R> = {
  case: <V extends T, W>(fn: MatcherArgument<T, V, W>) => Matcher<T, U | MatcherArgument<T, V, W>, R | W>;
  get: () => R | undefined;
};

export const match = <T>(target: T) => {
  const getMatcher = <U extends { typeGuard: Function; map: Function }, R>(storage: Array<U>): Matcher<T, U, R> => ({
    case: <V extends T, W>(fn: MatcherArgument<T, V, W>) => {
      const redeclareStorage: Array<(typeof storage)[0] | MatcherArgument<T, V, W>> = storage;
      redeclareStorage.push(fn);
      return getMatcher<U | MatcherArgument<T, V, W>, R | W>(redeclareStorage);
    },
    get: (): R | undefined => {
      const stored = storage.find((v) => v.typeGuard(target));
      if (stored === undefined) {
        return undefined;
      }
      return stored.map(target) as R;
    },
  });

  return getMatcher<never, never>([]);
};
