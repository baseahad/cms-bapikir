import { vi } from "vitest";

export const routerMock = {
  back: vi.fn(),
  forward: vi.fn(),
  prefetch: vi.fn(),
  push: vi.fn(),
  refresh: vi.fn(),
  replace: vi.fn(),
};

export const redirectMock = vi.fn((url: string) => {
  throw new Error(`NEXT_REDIRECT:${url}`);
});

export function resetNextMocks() {
  redirectMock.mockClear();
  Object.values(routerMock).forEach((mockFn) => mockFn.mockClear());
}
