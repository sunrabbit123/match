/* eslint-disable @typescript-eslint/ban-types */
export const match = <T>(target: T) => {
  type MatcherArgument<U extends T, V> = { typeGuard: (target: T) => target is U; map: (guarded: U) => V };

  const getMatcher = <U extends { typeGuard: Function; map: Function }, R>(storage: Array<U>) => ({
    case: <V extends T, W>(fn: MatcherArgument<V, W>) => {
      const redeclareStorage: Array<(typeof storage)[0] | MatcherArgument<V, W>> = storage;
      redeclareStorage.push(fn);
      return getMatcher<U | MatcherArgument<V, W>, R | W>(redeclareStorage);
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
