import "server-only";
import { createStorefrontApiClient } from "@shopify/storefront-api-client";
import { env } from "@/env";

export const client = createStorefrontApiClient({
  privateAccessToken: env.SHOPIFY_STOREFRONT_PRIVATE_ACCESS_TOKEN,
  storeDomain: env.SHOPIFY_STORE_DOMAIN,
  apiVersion: env.SHOPIFY_STOREFRONT_API_VERSION,
});
