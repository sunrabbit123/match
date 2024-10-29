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
  .get();

checks([check<typeof res1, string | undefined, Pass>()]);
