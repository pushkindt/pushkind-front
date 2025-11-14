import React from "react";
import { useNavigate } from "react-router-dom";
import type { User } from "../types";
import { ShoppingCartIcon, UserIcon } from "./Icons";

interface HeaderProps {
  user: User | null;
  cartItemCount: number;
  onLoginClick: () => void;
  onCartClick: () => void;
}

const Header: React.FC<HeaderProps> = ({
  user,
  cartItemCount,
  onLoginClick,
  onCartClick,
}) => {
  const navigate = useNavigate();
  return (
    <header className="bg-white shadow-md sticky top-0 z-40">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center">
            <button
              onClick={() => navigate("/")}
              className="text-2xl font-bold text-gray-800 hover:text-indigo-600 transition-colors"
            >
              Витрина
            </button>
          </div>
          <div className="flex items-center space-x-4">
            <button
              onClick={onLoginClick}
              className="flex items-center text-sm font-medium text-gray-600 hover:text-indigo-600 transition-colors"
            >
              <UserIcon className="w-6 h-6 mr-1" />
              {user ? `Привет, ${user.name}` : "Войти"}
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
      </div>
    </header>
  );
};

export default Header;
