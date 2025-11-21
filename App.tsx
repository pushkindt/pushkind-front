/**
 * @file App.tsx orchestrates the storefront shell, composing navigation-aware
 * views, shared overlays, and top-level layout elements.
 */
import React, { useEffect, useRef, useState } from "react";
import { useSearchParams } from "react-router-dom";
import type { User, Product, Tag, ProductLayout } from "./types";
import Header from "./components/Header";
import LoginModal from "./components/LoginModal";
import Cart from "./components/Cart";
import ToastContainer from "./components/ToastContainer";
import SearchBar from "./components/SearchBar";
import { SpinnerIcon, ArrowLeftIcon } from "./components/Icons";
import useViewNavigation from "./hooks/useViewNavigation";
import Layout from "./components/Layout";
import HomeView from "./views/HomeView";
import CategoryView from "./views/CategoryView";
import TagView from "./views/TagView";
import ProductView from "./views/ProductView";
import useCatalogData from "./hooks/useCatalogData";
import useProductDetail from "./hooks/useProductDetail";
import { useCart } from "./contexts/CartContext";
import useTransientFlag from "./hooks/useTransientFlag";
import { fetchCurrentUser } from "./services/api";
import { USER_STORAGE_KEY } from "./constants";

const loadPersistedUser = (): User | null => {
  if (typeof window === "undefined") {
    return null;
  }

  const storedValue = window.localStorage.getItem(USER_STORAGE_KEY);
  if (!storedValue) {
    return null;
  }

  try {
    return JSON.parse(storedValue) as User;
  } catch {
    window.localStorage.removeItem(USER_STORAGE_KEY);
    return null;
  }
};

const persistUser = (nextUser: User | null) => {
  if (typeof window === "undefined") {
    return;
  }

  if (nextUser) {
    window.localStorage.setItem(USER_STORAGE_KEY, JSON.stringify(nextUser));
  } else {
    window.localStorage.removeItem(USER_STORAGE_KEY);
  }
};

/**
 * Root storefront component that wires navigation, catalog data, cart actions,
 * and global overlays into a single cohesive experience.
 */
const App: React.FC = () => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [productLayout, setProductLayout] = useState<ProductLayout>("grid");
  const [searchParams, setSearchParams] = useSearchParams();
  const searchQuery = searchParams.get("search") ?? "";
  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const { addItem, itemCount } = useCart();
  const { isActive: isAddFeedbackActive, activate: triggerAddFeedback } =
    useTransientFlag();

  const { view, goHome, goToCategory, goToTag } = useViewNavigation();

  const catalogData = useCatalogData(view, user, searchQuery);
  const productDetailData = useProductDetail(
    view.type === "product" ? view.productId : null,
    user,
  );
  const isSearchActive = Boolean(searchQuery.trim());

  const isProductView = view.type === "product";
  const isLoading = isProductView
    ? productDetailData.isLoading
    : catalogData.isLoading;
  const categories = isProductView
    ? productDetailData.categories
    : catalogData.categories;
  const tags: Tag[] = catalogData.tags;
  const products: Product[] = catalogData.products;
  const selectedProduct = isProductView ? productDetailData.product : null;
  const sessionRequestIdRef = useRef<symbol | null>(null);

  useEffect(() => {
    // Reset the gallery position whenever a new product is loaded.
    setActiveImageIndex(0);
  }, [selectedProduct?.id]);

  useEffect(() => {
    let isMounted = true;

    const restoreUserFromSession = async () => {
      const requestId = Symbol("sessionRestore");
      sessionRequestIdRef.current = requestId;

      const cachedUser = loadPersistedUser();
      if (cachedUser && isMounted) {
        setUser(cachedUser);
      }

      const sessionUser = await fetchCurrentUser();
      if (!isMounted) {
        return;
      }

      if (sessionRequestIdRef.current !== requestId) {
        return;
      }

      if (sessionUser) {
        setUser(sessionUser);
        persistUser(sessionUser);
      } else {
        setUser(null);
        persistUser(null);
      }
      sessionRequestIdRef.current = null;
    };

    restoreUserFromSession();

    return () => {
      isMounted = false;
      sessionRequestIdRef.current = null;
    };
  }, []);

  /**
   * Persists the authenticated user and hides the login modal once the OTP
   * challenge succeeds.
   */
  const handleLoginSuccess = (loggedInUser: User) => {
    setUser(loggedInUser);
    persistUser(loggedInUser);
    setIsLoginModalOpen(false);
    sessionRequestIdRef.current = null;
  };

  /**
   * Adds a product to the cart and triggers a transient feedback animation so
   * customers receive immediate confirmation.
   */
  const handleAddToCartWithFeedback = (product: Product) => {
    addItem(product);
    triggerAddFeedback();
  };

  /** Synchronizes the search query with the URL so navigation stays in sync. */
  const handleSearchChange = (nextValue: string) => {
    const nextParams = new URLSearchParams(searchParams);
    if (nextValue) {
      nextParams.set("search", nextValue);
    } else {
      nextParams.delete("search");
    }
    setSearchParams(nextParams, { replace: true });
  };

  /**
   * Derives the heading for the current view using cached navigation metadata
   * when available.
   */
  const getTitle = () => {
    switch (view.type) {
      case "home":
        return "Все товары";
      case "category":
        return `Категория: ${
          categories.find((c) => c.id === view.categoryId)?.name ||
          view.categoryName ||
          view.categoryId
        }`;
      case "tag":
        return `Тег: ${
          tags.find((tag) => tag.id === view.tagId)?.name ||
          view.tagName ||
          view.tagId
        }`;
      case "product":
        return "Описание товара";
      default:
        return "Витрина";
    }
  };

  /**
   * Selects which view component to render based on the current route-aware
   * descriptor returned from the navigation hook.
   */
  const renderView = () => {
    if (isLoading) {
      return (
        <div className="flex justify-center items-center h-96">
          <SpinnerIcon className="w-12 h-12 text-indigo-600" />
        </div>
      );
    }

    if (view.type === "product") {
      return (
        <ProductView
          product={selectedProduct}
          categories={categories}
          isAddFeedbackActive={isAddFeedbackActive}
          activeImageIndex={activeImageIndex}
          onAddToCart={handleAddToCartWithFeedback}
          onImageIndexChange={setActiveImageIndex}
        />
      );
    }

    if (view.type === "category") {
      return (
        <CategoryView
          categories={categories}
          products={products}
          productLayout={productLayout}
          showCategories={!isSearchActive}
          onCategorySelect={goToCategory}
        />
      );
    }

    if (view.type === "tag") {
      return <TagView products={products} productLayout={productLayout} />;
    }

    return (
      <HomeView
        categories={categories}
        tags={tags}
        products={products}
        productLayout={productLayout}
        showFilters={!isSearchActive}
        onCategorySelect={goToCategory}
        onTagSelect={goToTag}
      />
    );
  };

  return (
    <Layout
      header={
        <Header
          user={user}
          cartItemCount={itemCount}
          onLoginClick={() => setIsLoginModalOpen(true)}
          onCartClick={() => setIsCartOpen(true)}
        />
      }
      overlays={
        <>
          <LoginModal
            isOpen={isLoginModalOpen}
            onClose={() => setIsLoginModalOpen(false)}
            onLoginSuccess={handleLoginSuccess}
          />
          <Cart
            isOpen={isCartOpen}
            onClose={() => setIsCartOpen(false)}
            user={user}
            onLoginClick={() => setIsLoginModalOpen(true)}
          />
          <ToastContainer />
        </>
      }
    >
      <div className="flex flex-wrap items-center gap-4 mb-6">
        {view.type !== "home" && (
          <button
            onClick={goHome}
            className="flex items-center text-indigo-600 hover:text-indigo-800 font-semibold mr-4"
          >
            <ArrowLeftIcon className="w-5 h-5 mr-1" />
            Назад
          </button>
        )}
        <div className="flex items-center gap-4 flex-wrap flex-1">
          <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight">
            {getTitle()}
          </h1>
          {view.type !== "product" && (
            <>
              <SearchBar
                value={searchQuery}
                onChange={handleSearchChange}
                placeholder="Поиск товаров и категорий"
              />
              <div className="flex items-center gap-2 bg-white rounded-full shadow px-2 py-1">
                {(["grid", "list"] as ProductLayout[]).map((layoutOption) => (
                  <button
                    key={layoutOption}
                    onClick={() => setProductLayout(layoutOption)}
                    className={`px-3 py-1 text-sm font-semibold rounded-full transition-colors duration-200 ${
                      productLayout === layoutOption
                        ? "bg-indigo-600 text-white"
                        : "text-gray-600 hover:text-gray-900"
                    }`}
                  >
                    {layoutOption === "grid" ? "Сетка" : "Список"}
                  </button>
                ))}
              </div>
            </>
          )}
        </div>
      </div>

      {renderView()}
    </Layout>
  );
};

export default App;
