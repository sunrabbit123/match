/**
 * from ts-toolbelt repository
 * https://github.com/millsp/ts-toolbelt/blob/master/sources/Any/Equals.ts
 */

/**
 * Check whether `A1` is equal to `A2` or not.
 * @param A1
 * @param A2
 * @returns [[Boolean]]
 * @example
 * ```ts
 * import {A} from 'ts-toolbelt'
 *
 * type test0 = A.Equals<42 | 0, 42 | 0>                    // true
 * type test1 = A.Equals<{a: string}, {b: string}>          // false
 * type test3 = A.Equals<{a: string}, {readonly a: string}> // false
 * ```
 */
export type Equals<A1, A2> = (<A>() => A extends A2 ? 1 : 0) extends <A>() => A extends A1 ? 1 : 0 ? 1 : 0;

/**
 * from ts-toolbelt repository
 * https://github.com/millsp/ts-toolbelt/blob/master/sources/Test.ts
 */

/**
 * Test should pass
 */
export type Pass = 1;

/**
 * Test should fail
 */
export type Fail = 0;

/**
 * Check or test the validity of a type
 */
export declare function check<Type, Expect, Outcome extends Pass | Fail>(): Equals<Equals<Type, Expect>, Outcome>;

/**
 * Validates a batch of [[check]]
 * @param checks a batch of [[check]]
 */
export declare function checks(checks: Pass[]): void;
