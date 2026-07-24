import React from "react";
import { cleanup } from "@testing-library/react";
import "@testing-library/jest-dom/vitest";
import { afterEach, beforeEach, vi } from "vitest";
import {
  redirectMock,
  resetNextMocks,
  routerMock,
} from "./tests/test-helpers/next";

vi.mock("next/link", () => ({
  default: ({
    children,
    href,
    ...props
  }: Omit<React.AnchorHTMLAttributes<HTMLAnchorElement>, "href"> & {
    children: React.ReactNode;
    href: string | { pathname?: string };
  }) => {
    const resolvedHref = typeof href === "string" ? href : href.pathname ?? "";

    return React.createElement(
      "a",
      {
        href: resolvedHref,
        ...props,
      },
      children
    );
  },
}));

vi.mock("next/navigation", async () => {
  const actual =
    await vi.importActual<typeof import("next/navigation")>("next/navigation");

  return {
    ...actual,
    redirect: redirectMock,
    useRouter: () => routerMock,
  };
});

beforeEach(() => {
  resetNextMocks();

  if (typeof window !== "undefined") {
    window.scrollTo = vi.fn();
    window.matchMedia =
      window.matchMedia ??
      ((query: string) =>
        ({
          addEventListener: vi.fn(),
          addListener: vi.fn(),
          dispatchEvent: vi.fn(),
          matches: false,
          media: query,
          onchange: null,
          removeEventListener: vi.fn(),
          removeListener: vi.fn(),
        }) as MediaQueryList);

    globalThis.ResizeObserver =
      globalThis.ResizeObserver ??
      class ResizeObserver {
        disconnect() {}
        observe() {}
        unobserve() {}
      };

    globalThis.IntersectionObserver =
      globalThis.IntersectionObserver ??
      class IntersectionObserver {
        disconnect() {}
        observe() {}
        takeRecords() {
          return [];
        }
        unobserve() {}
      };
  }
});

afterEach(() => {
  if (typeof document !== "undefined") {
    cleanup();
  }
});
