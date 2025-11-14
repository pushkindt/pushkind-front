/**
 * @file Header.test.tsx asserts the header renders key affordances.
 */
import React from "react";
import { describe, expect, it, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import Header from "./Header";

/** Utility that wraps the tested component with a router. */
const renderWithRouter = (ui: React.ReactNode) =>
    render(<MemoryRouter>{ui}</MemoryRouter>);

describe("Header", () => {
    it("renders login button when user is null", () => {
        renderWithRouter(
            <Header
                user={null}
                cartItemCount={0}
                onLoginClick={vi.fn()}
                onCartClick={vi.fn()}
            />,
        );
        expect(screen.getByText("Войти")).toBeTruthy();
    });

    it("displays user name when logged in", () => {
        renderWithRouter(
            <Header
                user={{ id: 1, hub_id: 1, name: "Test", email: null, phone: "123" }}
                cartItemCount={0}
                onLoginClick={vi.fn()}
                onCartClick={vi.fn()}
            />,
        );
        expect(screen.getByText(/Привет, Test/)).toBeTruthy();
    });

    it("shows cart item count badge", () => {
        renderWithRouter(
            <Header
                user={null}
                cartItemCount={5}
                onLoginClick={vi.fn()}
                onCartClick={vi.fn()}
            />,
        );
        expect(screen.getByText("5")).toBeTruthy();
    });
});
