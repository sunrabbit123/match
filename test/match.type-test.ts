import { match } from '../src';
import { check, checks, Pass } from './util/test';

const res1 = match(123 as string | number)
  .case(
    (v): v is string => typeof v === 'string',
    (v) => v
  )
  .case(
    (v): v is number => typeof v === 'number',
    (v) => v.toString()
  )
  .run();

checks([check<typeof res1.handled, string | undefined, Pass>()]);

// Primitives type tests
const numberPrimitive = match(42)
  .case(42, (v) => v * 2)
  .run();

const booleanPrimitive = match(true)
  .case(true, (v) => !v)
  .run();

const stringPrimitive = match('hello')
  .case('hello', (v) => v.toUpperCase())
  .run();

const undefinedPrimitive = match(undefined)
  .case(undefined, (): 'undefined' => 'undefined')
  .run();

const nullPrimitive = match(null)
  .case(null, () => 'null' as const)
  .run();

const symbolPrimitive = match(Symbol('test'))
  .case(Symbol('test'), (v) => v.toString())
  .run();

const bigintPrimitive = match(BigInt(42))
  .case(BigInt(42), (v) => v + BigInt(1))
  .run();

checks([
  check<typeof numberPrimitive.handled, number | undefined, Pass>(),
  check<typeof booleanPrimitive.handled, boolean | undefined, Pass>(),
  check<typeof stringPrimitive.handled, string | undefined, Pass>(),
  check<typeof undefinedPrimitive.handled, 'undefined' | undefined, Pass>(),
  check<typeof nullPrimitive.handled, 'null' | undefined, Pass>(),
  check<typeof symbolPrimitive.handled, string | undefined, Pass>(),
  check<typeof bigintPrimitive.handled, bigint | undefined, Pass>(),
]);
