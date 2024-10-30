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

    expect(result.handled).toBe('HELLO');
  });

  it('숫자 매칭', () => {
    const result = match(42)
      .case(
        (v): v is 42 => v === 42,
        (v) => v * 2
      )
      .run();

    expect(result.handled).toBe(84);
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

    expect(result.handled).toBe(4);
  });

  it('매칭 실패시 undefined 반환', () => {
    const value = 123 as string | number;
    const result = match(value)
      .case(
        (v): v is string => typeof v === 'string',
        (v) => v.toUpperCase()
      )
      .run();

    expect(result.handled).toBeUndefined();
  });

  it('es-toolkit과의 결합', () => {
    const value = 123 as string | number | boolean;
    const result = match(value)
      .case(isNumber, (v) => v - 122)
      .case(isBoolean, (v) => Number(v))
      .case(isString, (v) => v.valueOf())
      .run();

    expect(result.handled).toBe(1);
  });

  describe('Primitives 매칭', () => {
    it('number primitive 매칭', () => {
      const result = match(42)
        .case(42, (v) => v * 2)
        .run();

      expect(result.handled).toBe(84);
    });

    it('boolean primitive 매칭', () => {
      const result = match(true)
        .case(true, (v) => !v)
        .run();

      expect(result.handled).toBe(false);
    });

    it('string primitive 매칭', () => {
      const result = match('hello')
        .case('hello', (v) => v.toUpperCase())
        .run();

      expect(result.handled).toBe('HELLO');
    });

    it('undefined primitive 매칭', () => {
      const result = match(undefined)
        .case(undefined, () => 'was undefined')
        .run();

      expect(result.handled).toBe('was undefined');
    });

    it('null primitive 매칭', () => {
      const result = match(null)
        .case(null, () => 'was null')
        .run();

      expect(result.handled).toBe('was null');
    });

    it('symbol primitive 매칭', () => {
      const sym = Symbol('test');
      const result = match(sym)
        .case(sym, (v) => v.toString())
        .run();

      expect(result.handled).toBe('Symbol(test)');
    });

    it('bigint primitive 매칭', () => {
      const result = match(BigInt(42))
        .case(BigInt(42), (v) => v + BigInt(1))
        .run();

      expect(result.handled).toBe(BigInt(43));
    });

    it('number primitive 매칭 실패', () => {
      const value = 42;
      const pattern = 43;
      const result = match(value as typeof pattern)
        .case(pattern, (v) => v * 2)
        .run();

      expect(result.handled).toBeUndefined();
    });

    it('boolean primitive 매칭 실패', () => {
      const value = true;
      const pattern = false;
      const result = match(value as typeof pattern)
        .case(pattern, (v) => !v)
        .run();

      expect(result.handled).toBeUndefined();
    });

    it('string primitive 매칭 실패', () => {
      const value = 'hello';
      const pattern = 'world';
      const result = match(value as typeof pattern)
        .case(pattern, (v) => v.toUpperCase())
        .run();

      expect(result.handled).toBeUndefined();
    });

    it('symbol primitive 매칭 실패', () => {
      const sym1 = Symbol('test1');
      const sym2 = Symbol('test2');
      const result = match(sym1 as unknown as typeof sym2)
        .case(sym2, (v) => v.toString())
        .run();

      expect(result.handled).toBeUndefined();
    });

    it('bigint primitive 매칭 실패', () => {
      const value = BigInt(42);
      const pattern = BigInt(43);
      const result = match(value as typeof pattern)
        .case(pattern, (v) => v + BigInt(1))
        .run();

      expect(result.handled).toBeUndefined();
    });
  });
});
