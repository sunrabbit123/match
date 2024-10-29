import { describe, it, expect } from 'vitest';
import { match } from '../src';
import { isBoolean, isString } from 'es-toolkit/predicate';
import { isNumber } from 'es-toolkit/compat';
import exp from 'constants';

describe('match', () => {
  it('문자열 매칭', () => {
    const result = match('hello')
      .case({
        typeGuard: (v): v is string => typeof v === 'string',
        map: (v) => v.toUpperCase(),
      })
      .get();

    expect(result).toBe('HELLO');
  });

  it('숫자 매칭', () => {
    const result = match(42)
      .case({
        typeGuard: (v): v is number => typeof v === 'number',
        map: (v) => v * 2,
      })
      .get();

    expect(result).toBe(84);
  });

  it('여러 케이스 매칭', () => {
    const value = 'test' as string | number;

    const result = match(value)
      .case({
        typeGuard: (v): v is number => typeof v === 'number',
        map: (v) => v * 2,
      })
      .case({
        typeGuard: (v): v is string => typeof v === 'string',
        map: (v) => v.length,
      })
      .get();

    expect(result).toBe(4);
    //      ^?
  });

  it('매칭 실패시 undefined 반환', () => {
    const value = 123 as string | number;
    const result = match(value)
      .case({
        typeGuard: (v): v is string => typeof v === 'string',
        map: (v) => v.toUpperCase(),
      })
      .get();

    expect(result).toBeUndefined();
  });

  it('es-toolkit', () => {
    const value = 123 as string | number | boolean;
    const result = match(value)
      .case({ typeGuard: isNumber, map: (v) => v - 122 })
      .case({ typeGuard: isBoolean, map: (v) => Number(v) })
      .case({ typeGuard: isString, map: (v) => v.valueOf() })
      .get();

    expect(result).toBe(1);
  });
});
