import { Matcher } from './matcher';

export const match = <const T>(target: T) => {
  return new Matcher(target, []);
};
