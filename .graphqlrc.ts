import { ApiType, shopifyApiProject } from "@shopify/api-codegen-preset";
import { ApiVersion } from "@shopify/shopify-api";
import type { IGraphQLConfig } from "graphql-config";

const config: IGraphQLConfig = {
  projects: {
    default: shopifyApiProject({
      apiType: ApiType.Storefront,
      apiVersion: ApiVersion.October25,
      documents: ["./lib/shopify/graphql/**/*.ts"],
      outputDir: "./lib/shopify/graphql/.generated",
    }),
  },
};

export default config;
