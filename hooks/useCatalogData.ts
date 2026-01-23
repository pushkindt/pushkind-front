/**
 * @file useCatalogData.ts centralizes fetching for category, tag, and product
 * data used across home, category, and tag views.
 */
import { useCallback, useEffect, useRef, useState } from "react";
import * as api from "../services/api";
import type { Category, Product, Tag, User, Vendor, View } from "../types";

/**
 * Fetches catalog metadata (categories, tags, products) for the current view
 * and exposes derived loading state.
 */
const useCatalogData = (
  view: View,
  user: User | null,
  searchQuery = "",
  minAmount?: number,
  maxAmount?: number,
  vendorId?: number | null,
) => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [tags, setTags] = useState<Tag[]>([]);
  const [vendors, setVendors] = useState<Vendor[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const requestIdRef = useRef(0);
  const userId = user?.id;

  /** Loads all catalog data for the current view. */
  const fetchCatalogData = useCallback(async () => {
    const requestId = requestIdRef.current + 1;
    requestIdRef.current = requestId;

    if (view.type === "product") {
      setCategories([]);
      setTags([]);
      setVendors([]);
      setProducts([]);
      setIsLoading(false);
      return;
    }

    if (view.type === "orders") {
      setCategories([]);
      setTags([]);
      setVendors([]);
      setProducts([]);
      setIsLoading(false);
      return;
    }

    setIsLoading(true);
    try {
      const categoryParentId =
        view.type === "category" ? view.categoryId : null;
      const [fetchedCategories, fetchedTags, fetchedVendors] =
        await Promise.all([
          api.fetchCategories(categoryParentId),
          api.fetchTags(),
          api.fetchVendors(),
        ]);

      if (requestId !== requestIdRef.current) {
        return;
      }

      setCategories(fetchedCategories);
      setTags(fetchedTags);
      setVendors(fetchedVendors);

      let fetchedProducts: Product[] = [];
      const searchFilter = searchQuery.trim();
      const vendorFilter = typeof vendorId === "number" ? { vendorId } : {};
      const amountFilter = {
        ...(typeof minAmount === "number" ? { minAmount } : {}),
        ...(typeof maxAmount === "number" ? { maxAmount } : {}),
      };

      if (view.type === "home") {
        fetchedProducts = await api.fetchProducts(
          searchFilter
            ? { search: searchFilter, ...vendorFilter, ...amountFilter }
            : { ...vendorFilter, ...amountFilter },
        );
      } else if (view.type === "category") {
        fetchedProducts = await api.fetchProducts({
          categoryId: view.categoryId,
          ...(searchFilter ? { search: searchFilter } : {}),
          ...vendorFilter,
          ...amountFilter,
        });
      } else if (view.type === "tag") {
        fetchedProducts = await api.fetchProducts({
          tagId: view.tagId,
          ...(searchFilter ? { search: searchFilter } : {}),
          ...vendorFilter,
          ...amountFilter,
        });
      }

      if (requestId !== requestIdRef.current) {
        return;
      }

      setProducts(fetchedProducts);
    } catch (error) {
      console.error("Не удалось загрузить данные каталога:", error);
    } finally {
      if (requestId === requestIdRef.current) {
        setIsLoading(false);
      }
    }
  }, [maxAmount, minAmount, searchQuery, userId, vendorId, view]);

  useEffect(() => {
    fetchCatalogData();
  }, [fetchCatalogData]);

  return {
    categories,
    tags,
    vendors,
    products,
    isLoading,
  };
};

export default useCatalogData;
