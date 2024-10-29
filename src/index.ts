type Matcher<T, R> = {
  case: <U extends T, V>(
    typeguard: <U extends T>(target: T) => target is U,
    map: (guarded: U) => V
  ) => Matcher<T, R | V>;
  get: () => R;
};

type CaseStorage<T, U extends T> = {
  typeGuard: (target: T) => target is U;
  map: (guarded: U) => unknown;
}[];

const getMatcher = <T>(target: T, storage: CaseStorage<T>): Matcher<T, undefined> => ({
  case: <U extends T, V>(typeGuard: (target: T) => target is U, map: (guarded: U) => V) => {
    storage.push({ typeGuard, map });
    return getMatcher(target, storage);
  },
  get: () => {
    const stored = storage.find((v) => v.typeGuard(target));
    if (stored === undefined) {
      return undefined;
    }
    return stored.map(target);
  },
});
export const match = <T>(target: T) => {
  return getMatcher(target, []);
};
