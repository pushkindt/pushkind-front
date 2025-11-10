import { describe, expect, it, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import Header from "./Header";

describe("Header", () => {
    it("renders login button when user is null", () => {
        render(
            <Header
                user={null}
                cartItemCount={0}
                onLoginClick={vi.fn()}
                onCartClick={vi.fn()}
                onHomeClick={vi.fn()}
            />,
        );
        expect(screen.getByText("Войти")).toBeTruthy();
    });

    it("displays user name when logged in", () => {
        render(
            <Header
                user={{ id: 1, hub_id: 1, name: "Test", email: null, phone: "123" }}
                cartItemCount={0}
                onLoginClick={vi.fn()}
                onCartClick={vi.fn()}
                onHomeClick={vi.fn()}
            />,
        );
        expect(screen.getByText(/Привет, Test/)).toBeTruthy();
    });

    it("shows cart item count badge", () => {
        render(
            <Header
                user={null}
                cartItemCount={5}
                onLoginClick={vi.fn()}
                onCartClick={vi.fn()}
                onHomeClick={vi.fn()}
            />,
        );
        expect(screen.getByText("5")).toBeTruthy();
    });
});
