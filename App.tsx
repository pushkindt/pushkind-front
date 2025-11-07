import React, { useState, useEffect, useCallback } from "react";
import type { User, Product, Category, Tag, CartItem, View } from "./types";
import * as api from "./services/api";
import Header from "./components/Header";
import LoginModal from "./components/LoginModal";
import Cart from "./components/Cart";
import ProductCard from "./components/ProductCard";
import { SpinnerIcon, ArrowLeftIcon } from "./components/Icons";

const App: React.FC = () => {
  const [user, setUser] = useState<User | null>(null);
  const [view, setView] = useState<View>({ type: "home" });
  const [categories, setCategories] = useState<Category[]>([]);
  const [tags, setTags] = useState<Tag[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const [isCartOpen, setIsCartOpen] = useState(false);

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
      const activeImage = imageUrls[0];
      const formattedPrice =
        selectedProduct.priceCents !== null
          ? new Intl.NumberFormat("ru-RU", {
            style: "currency",
            currency: selectedProduct.currency,
          }).format(selectedProduct.priceCents / 100)
          : "Цена недоступна";

      return (
        <div className="bg-white rounded-lg shadow-xl overflow-hidden max-w-4xl mx-auto">
          <div className="md:flex">
            <div className="md:flex-shrink-0">
              <img
                className="h-64 w-full object-cover md:h-full md:w-80"
                src={activeImage}
                alt={selectedProduct.name}
              />
            </div>
            <div className="p-8 flex flex-col justify-between">
              <div>
                <div className="uppercase tracking-wide text-sm text-indigo-500 font-semibold">
                  {
                    categories.find((c) => c.id === selectedProduct.categoryId)
                      ?.name
                  }
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
                <p className="mt-4 text-gray-600">
                  {selectedProduct.description}
                </p>
              </div>
              <div className="mt-6">
                <div className="flex items-baseline mb-4">
                  <span className="text-3xl font-bold text-gray-900">
                    {formattedPrice}
                    {selectedProduct.priceCents !== null &&
                      selectedProduct.units &&
                      selectedProduct.amount !== null
                      ? ` / ${selectedProduct.amount} ${selectedProduct.units}`
                      : ""}
                  </span>
                </div>
                <button
                  onClick={() => handleAddToCart(selectedProduct)}
                  className="w-full bg-indigo-600 text-white py-3 px-6 rounded-lg font-semibold hover:bg-indigo-700 text-lg"
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
                <h2 className="text-3xl font-bold text-gray-800 mb-6">
                  Категории
                </h2>
              )}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {categories.map((category) => (
                  <div
                    key={category.id}
                    onClick={() =>
                      setView({
                        type: "category",
                        categoryId: category.id,
                        categoryName: category.name,
                      })
                    }
                    className="relative rounded-lg overflow-hidden shadow-lg cursor-pointer group transform hover:scale-105 transition-transform duration-300"
                  >
                    <img
                      src={category.imageUrl ?? "/placeholder.png"}
                      alt={category.name}
                      className="w-full h-40 object-cover"
                    />
                    <div className="absolute inset-0 bg-black bg-opacity-40 group-hover:bg-opacity-50 transition-all duration-300 flex items-center justify-center">
                      <h3 className="text-white text-2xl font-bold">
                        {category.name}
                      </h3>
                    </div>
                  </div>
                ))}
              </div>
              {view.type === "home" && (
                <div className="mt-8">
                  <h3 className="text-2xl font-bold text-gray-800 mb-4">
                    Фильтр по тегам
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {tags.map((tag) => (
                      <button
                        key={tag.id}
                        onClick={() =>
                          setView({
                            type: "tag",
                            tagId: tag.id,
                            tagName: tag.name,
                          })
                        }
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
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {products.map((product) => (
            <ProductCard
              key={product.id}
              product={product}
              onProductClick={(id) =>
                setView({ type: "product", productId: id })
              }
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
        return `Категория: ${view.categoryName}`;
      case "tag":
        return `Тег: ${view.tagName}`;
      case "product":
        return "Описание товара";
      default:
        return "Витрина";
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 font-sans">
      <Header
        user={user}
        cartItemCount={cartItemCount}
        onLoginClick={() => setIsLoginModalOpen(true)}
        onCartClick={() => setIsCartOpen(true)}
        onHomeClick={() => setView({ type: "home" })}
      />

      <main className="container mx-auto p-4 sm:p-6 lg:p-8">
        <div className="flex items-center mb-6">
          {view.type !== "home" && (
            <button
              onClick={() => setView({ type: "home" })}
              className="flex items-center text-indigo-600 hover:text-indigo-800 font-semibold mr-4"
            >
              <ArrowLeftIcon className="w-5 h-5 mr-1" />
              Назад
            </button>
          )}
          <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight">
            {getTitle()}
          </h1>
        </div>

        {renderContent()}
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
    </div>
  );
};

export default App;
