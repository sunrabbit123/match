import { describe, it, expect } from 'vitest';
import { match } from '../src';
import { isBoolean, isString } from 'es-toolkit/predicate';
import { isNumber } from 'es-toolkit/compat';

describe('match', () => {
  it('문자열 매칭', () => {
    const result = match('hello')
      .case(
        (v): v is 'hello' => v === 'hello',
        (v) => v.toUpperCase()
      )
      .run();

    expect(result).toBe('HELLO');
  });

  it('숫자 매칭', () => {
    const result = match(42)
      .case(
        (v): v is 42 => v === 42,
        (v) => v * 2
      )
      .run();

    expect(result).toBe(84);
  });

  it('여러 케이스 매칭', () => {
    const value = 'test' as string | number;

    const result = match(value)
      .case(
        (v): v is number => typeof v === 'number',
        (v) => v * 2
      )
      .case(
        (v): v is string => typeof v === 'string',
        (v) => v.length
      )
      .run();

    expect(result).toBe(4);
    //      ^?
  });

  it('매칭 실패시 undefined 반환', () => {
    const value = 123 as string | number;
    const result = match(value)
      .case(
        (v): v is string => typeof v === 'string',
        (v) => v.toUpperCase()
      )
      .run();

    expect(result).toBeUndefined();
  });

  it('es-toolkit과의 결합', () => {
    const value = 123 as string | number | boolean;
    const result = match(value)
      .case(isNumber, (v) => v - 122)
      .case(isBoolean, (v) => Number(v))
      .case(isString, (v) => v.valueOf())
      .run();

    expect(result).toBe(1);
  });
});
