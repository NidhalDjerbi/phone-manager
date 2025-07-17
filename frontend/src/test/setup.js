import { expect, afterEach } from 'vitest';
import { cleanup } from '@testing-library/react';
import * as matchers from '@testing-library/jest-dom/matchers';

// étend les matchers de Vitest avec ceux de jest-dom
expect.extend(matchers);

// nettoie après chaque test
afterEach(() => {
  cleanup();
});
