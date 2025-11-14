/**
 * @file Icons.test.tsx ensures exported SVG icons render without crashing.
 */
import React from "react";
import { describe, expect, it } from "vitest";
import { render } from "@testing-library/react";
import { ShoppingCartIcon, UserIcon, XIcon } from "./Icons";

describe("Icons", () => {
  it("renders ShoppingCartIcon", () => {
    const { container } = render(<ShoppingCartIcon />);
    expect(container.querySelector("svg")).toBeTruthy();
  });

  it("renders UserIcon", () => {
    const { container } = render(<UserIcon />);
    expect(container.querySelector("svg")).toBeTruthy();
  });

  it("renders XIcon", () => {
    const { container } = render(<XIcon />);
    expect(container.querySelector("svg")).toBeTruthy();
  });
});
