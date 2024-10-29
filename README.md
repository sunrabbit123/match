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

```ts
import { isBoolean, isString } from 'es-toolkit/predicate';
import { isNumber } from 'es-toolkit/compat';

const value = 123 as string | number | boolean;
const result = match(value)
  .case({ typeGuard: isNumber, map: (v) => v - 122 })
  .case({ typeGuard: isBoolean, map: (v) => Number(v) })
  .case({ typeGuard: isString, map: (v) => v.valueOf() })
  .get();

expect(result).toBe(1);
```
