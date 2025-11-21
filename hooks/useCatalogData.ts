/**
 * @file useCatalogData.ts centralizes fetching for category, tag, and product
 * data used across home, category, and tag views.
 */
import { useCallback, useEffect, useState } from "react";
import * as api from "../services/api";
import type { Category, Product, Tag, User, View } from "../types";

/**
 * Fetches catalog metadata (categories, tags, products) for the current view
 * and exposes derived loading state.
 */
const useCatalogData = (view: View, user: User | null, searchQuery = "") => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [tags, setTags] = useState<Tag[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const userId = user?.id;

  /** Loads all catalog data for the current view. */
  const fetchCatalogData = useCallback(async () => {
    if (view.type === "product") {
      setCategories([]);
      setTags([]);
      setProducts([]);
      setIsLoading(false);
      return;
    }

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
      const searchFilter = searchQuery.trim();
      if (view.type === "home") {
        fetchedProducts = await api.fetchProducts(
          searchFilter ? { search: searchFilter } : {},
        );
      } else if (view.type === "category") {
        fetchedProducts = await api.fetchProducts({
          categoryId: view.categoryId,
          ...(searchFilter ? { search: searchFilter } : {}),
        });
      } else if (view.type === "tag") {
        fetchedProducts = await api.fetchProducts({
          tagId: view.tagId,
          ...(searchFilter ? { search: searchFilter } : {}),
        });
      }

      setProducts(fetchedProducts);
    } catch (error) {
      console.error("Не удалось загрузить данные каталога:", error);
    } finally {
      setIsLoading(false);
    }
  }, [searchQuery, userId, view]);

  useEffect(() => {
    fetchCatalogData();
  }, [fetchCatalogData]);

  return {
    categories,
    tags,
    products,
    isLoading,
  };
};

export default useCatalogData;
