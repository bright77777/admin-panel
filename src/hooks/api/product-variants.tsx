import type { FetchError } from "@medusajs/js-sdk";

import type { QueryKey, UseQueryOptions } from "@tanstack/react-query";
import { useQuery } from "@tanstack/react-query";

import { sdk } from "@lib/client";
import { queryKeysFactory } from "@lib/query-key-factory";

const PRODUCT_VARIANT_QUERY_KEY = "product_variant" as const;
export const productVariantQueryKeys = queryKeysFactory(
  PRODUCT_VARIANT_QUERY_KEY,
);

export const useVariants = (
  // @todo fix any type
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  query?: Record<string, any>,
  options?: Omit<
    // @todo fix any type
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    UseQueryOptions<any, FetchError, any, QueryKey>,
    "queryFn" | "queryKey"
  >,
) => {
  const { data, ...rest } = useQuery({
    queryFn: () => sdk.admin.productVariant.list(query),
    queryKey: productVariantQueryKeys.list(query),
    ...options,
  });

  return { ...data, ...rest };
};
