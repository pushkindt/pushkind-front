import React, { useEffect, useRef, useState } from "react";
import type { User, Product, Tag, CartItem, ProductLayout } from "./types";
import Header from "./components/Header";
import LoginModal from "./components/LoginModal";
import Cart from "./components/Cart";
import ToastContainer from "./components/ToastContainer";
import { SpinnerIcon, ArrowLeftIcon } from "./components/Icons";
import useViewNavigation from "./hooks/useViewNavigation";
import Layout from "./components/Layout";
import HomeView from "./views/HomeView";
import CategoryView from "./views/CategoryView";
import TagView from "./views/TagView";
import ProductView from "./views/ProductView";
import useCatalogData from "./hooks/useCatalogData";
import useProductDetail from "./hooks/useProductDetail";

const App: React.FC = () => {
  const [user, setUser] = useState<User | null>(null);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [productLayout, setProductLayout] = useState<ProductLayout>("grid");
  const [isAddFeedbackActive, setIsAddFeedbackActive] = useState(false);
  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const addToCartFeedbackTimeoutRef =
    useRef<ReturnType<typeof setTimeout> | null>(null);

  const { view, goHome, goToCategory, goToTag } = useViewNavigation();

  const catalogData = useCatalogData(view, user);
  const productDetailData = useProductDetail(
    view.type === "product" ? view.productId : null,
    user,
  );

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

  useEffect(() => {
    return () => {
      if (addToCartFeedbackTimeoutRef.current) {
        clearTimeout(addToCartFeedbackTimeoutRef.current);
      }
    };
  }, []);

  useEffect(() => {
    setActiveImageIndex(0);
  }, [selectedProduct?.id]);

  const handleLoginSuccess = (loggedInUser: User) => {
    setUser(loggedInUser);
    setIsLoginModalOpen(false);
  };

  const handleAddToCart = (product: Product) => {
    setCart((prevCart) => {
      const existingItem = prevCart.find((item) => item.id === product.id);
      if (existingItem) {
        return prevCart.map((item) =>
          item.id === product.id
            ? { ...item, quantity: item.quantity + 1 }
            : item,
        );
      }
      return [...prevCart, { ...product, quantity: 1 }];
    });
  };

  const handleAddToCartWithFeedback = (product: Product) => {
    handleAddToCart(product);
    setIsAddFeedbackActive(true);
    if (addToCartFeedbackTimeoutRef.current) {
      clearTimeout(addToCartFeedbackTimeoutRef.current);
    }
    addToCartFeedbackTimeoutRef.current = setTimeout(() => {
      setIsAddFeedbackActive(false);
      addToCartFeedbackTimeoutRef.current = null;
    }, 1000);
  };

  const handleUpdateCartQuantity = (productId: number, quantity: number) => {
    if (quantity <= 0) {
      handleRemoveFromCart(productId);
      return;
    }
    setCart((cart) =>
      cart.map((item) => (item.id === productId ? { ...item, quantity } : item)),
    );
  };

  const handleRemoveFromCart = (productId: number) => {
    setCart((cart) => cart.filter((item) => item.id !== productId));
  };

  const cartItemCount = cart.reduce((acc, item) => acc + item.quantity, 0);

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
          onCategorySelect={goToCategory}
          onAddToCart={handleAddToCart}
        />
      );
    }

    if (view.type === "tag") {
      return (
        <TagView
          products={products}
          productLayout={productLayout}
          onAddToCart={handleAddToCart}
        />
      );
    }

    return (
      <HomeView
        categories={categories}
        tags={tags}
        products={products}
        productLayout={productLayout}
        onCategorySelect={goToCategory}
        onTagSelect={goToTag}
        onAddToCart={handleAddToCart}
      />
    );
  };

  return (
    <Layout
      header={
        <Header
          user={user}
          cartItemCount={cartItemCount}
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
            cartItems={cart}
            user={user}
            onUpdateQuantity={handleUpdateCartQuantity}
            onRemoveItem={handleRemoveFromCart}
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
        <div className="flex items-center gap-4 flex-wrap">
          <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight">
            {getTitle()}
          </h1>
          {view.type !== "product" && (
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
          )}
        </div>
      </div>

      {renderView()}
    </Layout>
  );
};

export default App;
