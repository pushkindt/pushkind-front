import { useMemo } from "react";
import {
  matchPath,
  useLocation,
  useNavigate,
} from "react-router-dom";
import type { View } from "../types";

const parseId = (value: string | undefined): number | null => {
  if (!value) return null;
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : null;
};

const useViewNavigation = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const view = useMemo<View>(() => {
    const categoryMatch = matchPath(
      "/categories/:categoryId",
      location.pathname,
    );
    const tagMatch = matchPath("/tags/:tagId", location.pathname);
    const productMatch = matchPath("/products/:productId", location.pathname);
    const state = (location.state ?? {}) as Record<string, unknown>;

    if (productMatch?.params.productId) {
      const productId = parseId(productMatch.params.productId);
      if (productId !== null) {
        return { type: "product", productId };
      }
    }

    if (categoryMatch?.params.categoryId) {
      const categoryId = parseId(categoryMatch.params.categoryId);
      if (categoryId !== null) {
        return {
          type: "category",
          categoryId,
          categoryName:
            typeof state.categoryName === "string" ? state.categoryName : "",
        };
      }
    }

    if (tagMatch?.params.tagId) {
      const tagId = parseId(tagMatch.params.tagId);
      if (tagId !== null) {
        return {
          type: "tag",
          tagId,
          tagName: typeof state.tagName === "string" ? state.tagName : "",
        };
      }
    }

    return { type: "home" };
  }, [location.pathname, location.state]);

  const goHome = () => navigate("/");
  const goToCategory = (categoryId: number, categoryName?: string) =>
    navigate(`/categories/${categoryId}`, {
      state: { categoryName },
    });
  const goToTag = (tagId: number, tagName?: string) =>
    navigate(`/tags/${tagId}`, {
      state: { tagName },
    });
  return {
    view,
    goHome,
    goToCategory,
    goToTag,
  };
};

export default useViewNavigation;
