import React, { useState, useEffect, useCallback, useRef } from "react";
import { Outlet, useOutletContext } from "react-router-dom";
import type {
  User,
  Product,
  Category,
  Tag,
  CartItem,
  ProductLayout,
  View,
} from "./types";
import * as api from "./services/api";
import Header from "./components/Header";
import LoginModal from "./components/LoginModal";
import Cart from "./components/Cart";
import ProductCard from "./components/ProductCard";
import ToastContainer from "./components/ToastContainer";
import { SpinnerIcon, ArrowLeftIcon } from "./components/Icons";
import useViewNavigation from "./hooks/useViewNavigation";

type AppOutletContext = {
  view: View;
  goHome: () => void;
  goToCategory: (categoryId: number, categoryName?: string) => void;
  goToTag: (tagId: number, tagName?: string) => void;
  isLoading: boolean;
  categories: Category[];
  tags: Tag[];
  products: Product[];
  selectedProduct: Product | null;
  handleAddToCart: (product: Product) => void;
  handleAddToCartWithFeedback: (product: Product) => void;
  productLayout: ProductLayout;
  setProductLayout: React.Dispatch<React.SetStateAction<ProductLayout>>;
  isAddFeedbackActive: boolean;
  activeImageIndex: number;
  setActiveImageIndex: React.Dispatch<React.SetStateAction<number>>;
};

const App: React.FC = () => {
  const [user, setUser] = useState<User | null>(null);
  const [categories, setCategories] = useState<Category[]>([]);
  const [tags, setTags] = useState<Tag[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [productLayout, setProductLayout] =
    useState<ProductLayout>("grid");
  const [isAddFeedbackActive, setIsAddFeedbackActive] = useState(false);
  const addToCartFeedbackTimeoutRef =
    useRef<ReturnType<typeof setTimeout> | null>(null);
  const [activeImageIndex, setActiveImageIndex] = useState(0);

  const { view, goHome, goToCategory, goToTag } = useViewNavigation();

  const fetchData = useCallback(async () => {
    setIsLoading(true);
    try {
      const categoryParentId =
        view.type === "category" ? view.categoryId : null;
      const [fetchedCategories, fetchedTags] = await Promise.all([
        api.fetchCategories(categoryParentId),
        api.fetchTags(),
      ]);
      setCategories(fetchedCategories);
      setTags(fetchedTags);

      let fetchedProducts: Product[] = [];
      if (view.type === "home") {
        fetchedProducts = await api.fetchProducts(user);
      } else if (view.type === "category") {
        fetchedProducts = await api.fetchProducts(user, {
          categoryId: view.categoryId,
        });
      } else if (view.type === "tag") {
        fetchedProducts = await api.fetchProducts(user, {
          tagId: view.tagId,
        });
      } else if (view.type === "product") {
        const product = await api.fetchProductById(user, view.productId);
        setSelectedProduct(product || null);
        setProducts([]); // No list to show
      }
      if (view.type !== "product") {
        setProducts(fetchedProducts);
        setSelectedProduct(null);
      }
    } catch (error) {
      console.error("Не удалось загрузить данные:", error);
    } finally {
      setIsLoading(false);
    }
  }, [view, user]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

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
      cart.map((item) =>
        item.id === productId ? { ...item, quantity } : item,
      ),
    );
  };

  const handleRemoveFromCart = (productId: number) => {
    setCart((cart) => cart.filter((item) => item.id !== productId));
  };

  const cartItemCount = cart.reduce((acc, item) => acc + item.quantity, 0);

  const outletContext: AppOutletContext = {
    view,
    goHome,
    goToCategory,
    goToTag,
    isLoading,
    categories,
    tags,
    products,
    selectedProduct,
    handleAddToCart,
    handleAddToCartWithFeedback,
    productLayout,
    setProductLayout,
    isAddFeedbackActive,
    activeImageIndex,
    setActiveImageIndex,
  };

  return (
    <div className="min-h-screen bg-gray-100 font-sans">
      <Header
        user={user}
        cartItemCount={cartItemCount}
        onLoginClick={() => setIsLoginModalOpen(true)}
        onCartClick={() => setIsCartOpen(true)}
      />

      <main className="container mx-auto p-4 sm:p-6 lg:p-8">
        <Outlet context={outletContext} />
      </main>

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
    </div>
    );
};

const AppContent: React.FC = () => {
  const {
    view,
    goHome,
    goToCategory,
    goToTag,
    isLoading,
    categories,
    tags,
    products,
    selectedProduct,
    handleAddToCart,
    handleAddToCartWithFeedback,
    productLayout,
    setProductLayout,
    isAddFeedbackActive,
    activeImageIndex,
    setActiveImageIndex,
  } = useOutletContext<AppOutletContext>();

  const renderContent = () => {
    if (isLoading) {
      return (
        <div className="flex justify-center items-center h-96">
          <SpinnerIcon className="w-12 h-12 text-indigo-600" />
        </div>
      );
    }

    if (view.type === "product") {
      if (!selectedProduct)
        return <p className="text-center text-gray-500">Товар не найден.</p>;
      const imageUrls =
        selectedProduct.imageUrls.length > 0
          ? selectedProduct.imageUrls
          : ["placeholder.png"];
      const formattedPrice =
        selectedProduct.priceCents !== null
          ? new Intl.NumberFormat("ru-RU", {
              style: "currency",
              currency: selectedProduct.currency,
            }).format(selectedProduct.priceCents / 100)
          : "Цена недоступна";

      const boundedImageIndex = Math.min(activeImageIndex, imageUrls.length - 1);
      const activeImage = imageUrls[boundedImageIndex];
      const hasMultipleImages = imageUrls.length > 1;

      return (
        <div className="bg-white rounded-lg shadow-xl overflow-hidden max-w-5xl mx-auto">
          <div className="md:flex gap-6">
            <div className="md:flex-shrink-0 md:w-1/2">
              <div className="relative">
                <img
                  className="h-96 w-full object-cover rounded-lg shadow-sm"
                  src={activeImage}
                  alt={`${selectedProduct.name} ${boundedImageIndex + 1}`}
                />
                {hasMultipleImages && (
                  <div className="absolute inset-x-0 bottom-2 flex justify-between px-4">
                    <button
                      type="button"
                      onClick={() =>
                        setActiveImageIndex((prev) =>
                          (prev - 1 + imageUrls.length) % imageUrls.length,
                        )
                      }
                      className="bg-white bg-opacity-70 text-gray-700 rounded-full px-3 py-1 shadow"
                    >
                      ←
                    </button>
                    <button
                      type="button"
                      onClick={() =>
                        setActiveImageIndex((prev) =>
                          (prev + 1) % imageUrls.length,
                        )
                      }
                      className="bg-white bg-opacity-70 text-gray-700 rounded-full px-3 py-1 shadow"
                    >
                      →
                    </button>
                  </div>
                )}
              </div>
              {hasMultipleImages && (
                <div className="flex gap-2 mt-4 flex-wrap">
                  {imageUrls.map((url, index) => (
                    <button
                      key={`${selectedProduct.id}-thumb-${index}`}
                      type="button"
                      onClick={() => setActiveImageIndex(index)}
                      className={`border rounded-lg overflow-hidden transition-transform duration-200 ${
                        boundedImageIndex === index
                          ? "border-indigo-600 scale-105"
                          : "border-gray-200 hover:scale-105"
                      }`}
                    >
                      <img
                        className="h-16 w-24 object-cover"
                        src={url}
                        alt={`${selectedProduct.name} thumbnail ${index + 1}`}
                      />
                    </button>
                  ))}
                </div>
              )}
            </div>
            <div className="p-8 flex flex-col justify-between">
              <div>
                <div className="uppercase tracking-wide text-sm text-indigo-500 font-semibold">
                  {categories.find((c) => c.id === selectedProduct.categoryId)?.name}
                </div>
                <h1 className="block mt-1 text-3xl leading-tight font-extrabold text-black">
                  {selectedProduct.name}
                </h1>
                {selectedProduct.sku && (
                  <p className="mt-2 text-sm text-gray-500 uppercase tracking-wide">
                    Артикул: {selectedProduct.sku}
                  </p>
                )}
                {selectedProduct.units && (
                  <p className="text-sm text-gray-500">
                    Единицы: {selectedProduct.units}
                  </p>
                )}
                <p className="mt-4 text-gray-600">{selectedProduct.description}</p>
              </div>
              <div className="mt-6">
                <div className="flex items-baseline mb-4 space-x-2">
                  <span className="text-3xl font-bold text-gray-900">{formattedPrice}</span>
                  {selectedProduct.priceCents !== null &&
                    selectedProduct.units &&
                    selectedProduct.amount !== null && (
                      <span className="text-sm text-gray-600">
                        за {selectedProduct.amount} {selectedProduct.units}
                      </span>
                    )}
                </div>
                <button
                  onClick={() => handleAddToCartWithFeedback(selectedProduct)}
                  className={`w-full text-white py-3 px-6 rounded-lg font-semibold text-lg transition-colors duration-300 ${
                    isAddFeedbackActive
                      ? "bg-green-500 hover:bg-green-600"
                      : "bg-indigo-600 hover:bg-indigo-700"
                  }`}
                >
                  Добавить в корзину
                </button>
              </div>
            </div>
          </div>
        </div>
      );
    }

    return (
      <>
        {(view.type === "home" ||
          (view.type === "category" && categories.length > 0)) && (
          <div className="mb-12">
            {view.type === "home" && (
              <h2 className="text-3xl font-bold text-gray-800 mb-6">Категории</h2>
            )}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {categories.map((category) => (
                <div
                  key={category.id}
                  onClick={() => goToCategory(category.id, category.name)}
                  className="relative rounded-lg overflow-hidden shadow-lg cursor-pointer group transform hover:scale-105 transition-transform duration-300"
                >
                  <img
                    src={category.imageUrl ?? "/placeholder.png"}
                    alt={category.name}
                    className="w-full h-40 object-cover"
                  />
                  <div className="absolute inset-0 bg-black bg-opacity-40 group-hover:bg-opacity-50 transition-all duration-300 flex items-center justify-center">
                    <h3 className="text-white text-2xl font-bold">{category.name}</h3>
                  </div>
                </div>
              ))}
            </div>
            {view.type === "home" && (
              <div className="mt-8">
                <h3 className="text-2xl font-bold text-gray-800 mb-4">Фильтр по тегам</h3>
                <div className="flex flex-wrap gap-2">
                  {tags.map((tag) => (
                    <button
                      key={tag.id}
                      onClick={() => goToTag(tag.id, tag.name)}
                      className="bg-gray-200 text-gray-700 px-4 py-2 rounded-full hover:bg-indigo-500 hover:text-white transition-colors duration-200"
                    >
                      {tag.name}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
        <div
          data-testid="product-layout"
          className={
            productLayout === "grid"
              ? "grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6"
              : "flex flex-col gap-6"
          }
        >
          {products.map((product) => (
            <ProductCard
              key={product.id}
              product={product}
              layout={productLayout}
              onAddToCart={handleAddToCart}
            />
          ))}
        </div>
      </>
    );
  };

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

  return (
    <>
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
        </div>
      </div>

      {renderContent()}
    </>
  );
};

export default App;
export { AppContent };
