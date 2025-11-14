import { useCallback, useEffect, useState } from "react";
import * as api from "../services/api";
import type { Category, Product, User } from "../types";

const useProductDetail = (productId: number | null, user: User | null) => {
  const [product, setProduct] = useState<Product | null>(null);
  const [categories, setCategories] = useState<Category[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const fetchProductDetail = useCallback(async () => {
    if (!productId) {
      setProduct(null);
      setCategories([]);
      setIsLoading(false);
      return;
    }

    setIsLoading(true);
    try {
      const [fetchedProduct, fetchedCategories] = await Promise.all([
        api.fetchProductById(user, productId),
        api.fetchCategories(null),
      ]);
      setProduct(fetchedProduct ?? null);
      setCategories(fetchedCategories);
    } catch (error) {
      console.error("Не удалось загрузить товар:", error);
      setProduct(null);
    } finally {
      setIsLoading(false);
    }
  }, [productId, user]);

  useEffect(() => {
    fetchProductDetail();
  }, [fetchProductDetail]);

  return {
    product,
    categories,
    isLoading,
  };
};

export default useProductDetail;
