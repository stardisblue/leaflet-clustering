import { describe, expect, it } from 'vitest';

import flat from './flat.json';
import { fsac } from '../lib/fsac';

describe('fsac', () => {
  it('should have the same results', () => {
    expect(fsac(flat)).toMatchSnapshot();
  });
});
