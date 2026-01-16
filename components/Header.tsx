/**
 * @file Header.tsx renders the sticky global navigation bar.
 */
import React, { useEffect, useState } from "react";
import type { User } from "../types";
import SearchBar from "./SearchBar";
import { OrdersIcon, ShoppingCartIcon, UserIcon } from "./Icons";

/**
 * Props consumed by the `Header` component.
 */
interface HeaderProps {
  user: User | null;
  cartItemCount: number;
  isSearchVisible: boolean;
  searchValue: string;
  searchPlaceholder?: string;
  onSearchChange: (nextValue: string) => void;
  onLoginClick: () => void;
  onLogoutClick: () => void;
  onCartClick: () => void;
  onHomeClick: () => void;
  onOrdersClick?: () => void;
}

/**
 * Sticky header that exposes navigation, login entry points, and cart access.
 */
const Header: React.FC<HeaderProps> = ({
  user,
  cartItemCount,
  isSearchVisible,
  searchValue,
  searchPlaceholder,
  onSearchChange,
  onLoginClick,
  onLogoutClick,
  onCartClick,
  onHomeClick,
  onOrdersClick,
}) => {
  const [isMobileSearchOpen, setIsMobileSearchOpen] = useState(false);

  useEffect(() => {
    if (!isSearchVisible) {
      setIsMobileSearchOpen(false);
    }
  }, [isSearchVisible]);

  const handleAuthClick = () => {
    if (user) {
      onLogoutClick();
      return;
    }

    onLoginClick();
  };

  return (
    <header className="bg-white shadow-md sticky top-0 z-40">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center gap-4 h-16">
          <div className="flex items-center">
            <button
              onClick={onHomeClick}
              className="text-2xl font-bold text-gray-800 hover:text-indigo-600 transition-colors"
            >
              Витрина
            </button>
          </div>
          {isSearchVisible ? (
            <>
              <div className="flex-1 hidden md:block">
                <SearchBar
                  id="product-search-desktop"
                  value={searchValue}
                  onChange={onSearchChange}
                  placeholder={searchPlaceholder}
                />
              </div>
              <div className="flex-1 md:hidden" />
            </>
          ) : (
            <div className="flex-1" />
          )}
          <div className="flex items-center space-x-4">
            {isSearchVisible && (
              <button
                type="button"
                className="md:hidden flex items-center text-sm font-medium text-gray-600 hover:text-indigo-600 transition-colors"
                aria-label="Открыть поиск"
                aria-expanded={isMobileSearchOpen}
                aria-controls="mobile-search"
                onClick={() => setIsMobileSearchOpen((prev) => !prev)}
              >
                <svg
                  className="w-6 h-6"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  aria-hidden="true"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M21 21l-4.35-4.35m0 0A7.5 7.5 0 104.5 4.5a7.5 7.5 0 0012.15 12.15z"
                  />
                </svg>
              </button>
            )}
            {user && onOrdersClick && (
              <button
                onClick={onOrdersClick}
                className="flex items-center text-sm font-medium text-gray-600 hover:text-indigo-600 transition-colors"
                aria-label="Мои заказы"
              >
                <OrdersIcon className="w-6 h-6 sm:hidden" />
                <span className="sr-only sm:not-sr-only">Мои заказы</span>
              </button>
            )}
            <button
              onClick={handleAuthClick}
              className="flex items-center text-sm font-medium text-gray-600 hover:text-indigo-600 transition-colors"
            >
              <UserIcon className="w-6 h-6 sm:mr-1" />
              <span className="sr-only sm:not-sr-only">
                {user ? `Привет, ${user.name}` : "Войти"}
              </span>
            </button>
            <div className="h-6 w-px bg-gray-200"></div>
            <button
              onClick={onCartClick}
              className="relative flex items-center text-sm font-medium text-gray-600 hover:text-indigo-600 transition-colors"
            >
              <ShoppingCartIcon className="w-6 h-6" />
              {cartItemCount > 0 && (
                <span className="absolute -top-2 -right-2 flex items-center justify-center w-5 h-5 bg-indigo-600 text-white text-xs font-bold rounded-full">
                  {cartItemCount}
                </span>
              )}
            </button>
          </div>
        </div>
        {isSearchVisible && isMobileSearchOpen && (
          <div id="mobile-search" className="pb-4 md:hidden">
            <SearchBar
              id="product-search-mobile"
              value={searchValue}
              onChange={onSearchChange}
              placeholder={searchPlaceholder}
            />
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;
