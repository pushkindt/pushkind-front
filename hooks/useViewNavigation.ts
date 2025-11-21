/**
 * @file useViewNavigation.ts derives navigation helpers from the router.
 */
import { useMemo } from "react";
import { matchPath, useLocation, useNavigate } from "react-router-dom";
import type { View } from "../types";

/** Safely parses an ID from a route parameter string. */
const parseId = (value: string | undefined): number | null => {
  if (!value) return null;
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : null;
};

/**
 * Converts the current location into a typed view descriptor and exposes
 * helper callbacks for navigation.
 */
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

  const goHome = () =>
    navigate({
      pathname: "/",
      search: location.search,
    });
  const goToCategory = (categoryId: number, categoryName?: string) =>
    navigate(
      {
        pathname: `/categories/${categoryId}`,
        search: location.search,
      },
      {
        state: { categoryName },
      },
    );
  const goToTag = (tagId: number, tagName?: string) =>
    navigate(
      {
        pathname: `/tags/${tagId}`,
        search: location.search,
      },
      {
        state: { tagName },
      },
    );
  return {
    view,
    goHome,
    goToCategory,
    goToTag,
  };
};

export default useViewNavigation;
