# @sunrabbit123/match

I want a better match.

The code piece is simple, so you can copy and paste it, or you can install it.

However, if you copy and paste, please press the star once.

refer https://github.com/millsp/ts-toolbelt for type testing

## Installation

```bash
npm install @sunrabbit123/match
# or
yarn add @sunrabbit123/match
```

## Usage

### Type Guard Functions

Type guard functions can be used to narrow down union types and perform type-safe operations. The library works seamlessly with type guard functions from libraries like `es-toolkit`.

```ts
import { isBoolean, isString } from 'es-toolkit/predicate';
import { isNumber } from 'es-toolkit/compat';

const value = 123 as string | number | boolean;
const result = match(value)
  .case(isNumber, (v) => v - 122) // v is typed as number
  .case(isBoolean, (v) => Number(v)) // v is typed as boolean
  .case(isString, (v) => v.valueOf()) // v is typed as string
  .run();

expect(result.handled).toBe(1);
```

You can also create your own type guard functions:

```ts
interface User {
  type: 'user';
  name: string;
}

interface Admin {
  type: 'admin';
  name: string;
  permissions: string[];
}

const isAdmin = (value: User | Admin): value is Admin => value.type === 'admin';

const entity = { type: 'admin', name: 'John', permissions: ['read', 'write'] } as User | Admin;

const result = match(entity)
  .case(isAdmin, (admin) => admin.permissions.join(',')) // admin is typed as Admin
  .case(
    (user): user is User => user.type === 'user',
    (user) => user.name
  ) // user is typed as User
  .run();
```

### Primitive Matching

The library supports direct matching against primitive values. This provides a clean and type-safe way to match against specific primitive values.

```ts
// Number matching
const numResult = match(42)
  .case(42, (v) => v * 2) // Matches exact number
  .run();
expect(numResult.handled).toBe(84);

// String matching
const strResult = match('hello')
  .case('hello', (v) => v.toUpperCase()) // Matches exact string
  .run();
expect(strResult.handled).toBe('HELLO');

// Boolean matching
const boolResult = match(true)
  .case(true, (v) => !v) // Matches exact boolean
  .run();
expect(boolResult.handled).toBe(false);

// Symbol matching
const sym = Symbol('test');
const symResult = match(sym)
  .case(sym, (v) => v.toString()) // Matches exact symbol
  .run();
expect(symResult.handled).toBe('Symbol(test)');

// BigInt matching
const bigResult = match(BigInt(42))
  .case(BigInt(42), (v) => v + BigInt(1)) // Matches exact bigint
  .run();
expect(bigResult.handled).toBe(BigInt(43));

// Null and Undefined matching
const nullResult = match(null)
  .case(null, () => 'was null') // Matches null
  .run();
expect(nullResult.handled).toBe('was null');

const undefinedResult = match(undefined)
  .case(undefined, () => 'was undefined') // Matches undefined
  .run();
expect(undefinedResult.handled).toBe('was undefined');
```

### Handling Unmatched Cases

When no cases match, the result will be `undefined`:

```ts
const result = match(42)
  .case(43, (v) => v * 2) // Won't match
  .run();

expect(result.handled).toBeUndefined();
```

### Type Safety

The library provides full type safety:

- Type guard functions narrow down union types correctly
- Primitive patterns ensure type compatibility at compile time
- The handler function receives the correctly narrowed type
- The result type includes all possible return types from handlers

```ts
const value = 'hello' as string | number;

const result = match(value)
  .case(
    (v): v is number => typeof v === 'number',
    (v) => v * 2
  ) // v is number
  .case(
    (v): v is string => typeof v === 'string',
    (v) => v.length
  ) // v is string
  .run();

// result.handled is typed as number | undefined
```

### Accessing Original Value

The `run()` method returns an object that includes both the handled result and the original value:

```ts
const value = 42;
const result = match(value)
  .case(42, (v) => v * 2)
  .run();

console.log(result.handled); // 84
console.log(result.origin); // 42
```
