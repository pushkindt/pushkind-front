/**
 * @file formatPrice.ts groups helpers for pricing labels and image URLs.
 */

export interface FormatPriceOptions extends Intl.NumberFormatOptions {
  locale?: string;
  fallback?: string;
}

const DEFAULT_LOCALE = 'ru-RU';
const DEFAULT_FALLBACK = 'Цена недоступна';
const PLACEHOLDER_IMAGE = '/placeholder.png';

/**
 * Formats a cent-denominated amount into a localized currency string.
 */
export const formatPrice = (
  priceCents: number | null,
  currency: string,
  options: FormatPriceOptions = {},
): string => {
  const { locale = DEFAULT_LOCALE, fallback = DEFAULT_FALLBACK, ...intlOptions } =
    options;

  if (priceCents === null || Number.isNaN(priceCents)) {
    return fallback;
  }

  return new Intl.NumberFormat(locale, {
    style: 'currency',
    currency,
    ...intlOptions,
  }).format(priceCents / 100);
};

/**
 * Formats a unit price label such as "за 1 кг".
 */
export const formatUnitPrice = (
  amount: number | null,
  units?: string | null,
  options: { prefix?: string } = {},
): string | null => {
  if (amount === null || amount === undefined || !units) {
    return null;
  }

  const prefix = options.prefix ?? 'за';
  return `${prefix} ${amount} ${units}`;
};

/** Adds a `_resized` suffix to an image filename when possible. */
export const appendResizedSuffix = (url: string): string => {
  if (!url) {
    return url;
  }

  const queryStart = url.search(/[?#]/);
  const baseUrl = queryStart === -1 ? url : url.slice(0, queryStart);
  const suffix = queryStart === -1 ? '' : url.slice(queryStart);
  const lastSlashIndex = baseUrl.lastIndexOf('/');
  const fileName =
    lastSlashIndex === -1 ? baseUrl : baseUrl.slice(lastSlashIndex + 1);

  if (!fileName) {
    return url;
  }

  const lastDotInFileName = fileName.lastIndexOf('.');
  if (lastDotInFileName <= 0) {
    return url;
  }

  const dotIndex =
    lastSlashIndex === -1
      ? lastDotInFileName
      : lastSlashIndex + 1 + lastDotInFileName;

  return `${baseUrl.slice(0, dotIndex)}_resized${baseUrl.slice(dotIndex)}${suffix}`;
};

/** Returns the primary image (or placeholder) for a product. */
export const getPrimaryImage = (imageUrls: string[] = []): string => {
  if (!imageUrls.length) {
    return PLACEHOLDER_IMAGE;
  }

  const url = imageUrls[0];
  if (!url) {
    return PLACEHOLDER_IMAGE;
  }

  return appendResizedSuffix(url);
};

export { PLACEHOLDER_IMAGE };
