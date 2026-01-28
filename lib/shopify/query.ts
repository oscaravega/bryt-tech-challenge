import { client } from "./serverClient";

type ShopifyResponse<T> = { data?: T; errors?: unknown };

export async function shopifyQuery<T>(
  query: string,
  variables?: Record<string, unknown>,
) {
  const res = (await client.request(query, { variables })) as ShopifyResponse<T>;

  if (res.errors) {
    throw new Error(`Shopify GraphQL error: ${JSON.stringify(res.errors)}`);
  }

  if (!res.data) {
    throw new Error("No data returned from Shopify");
  }

  return res.data;
}

export type CollectionLite = { title: string; handle: string };

export async function getCollections() {
  const query = /* GraphQL */ `
    query GetCollections {
      collections(first: 20) {
        nodes {
          title
          handle
        }
      }
    }
  `;

  const data = await shopifyQuery<{
    collections: { nodes: CollectionLite[] };
  }>(query);

  return data.collections.nodes;
}

export type ProductCard = {
  id: string;
  handle: string;
  title: string;
  featuredImage?: {
    url: string;
    altText?: string | null;
    width?: number | null;
    height?: number | null;
  } | null;
  priceRange: {
    minVariantPrice: { amount: string; currencyCode: string };
  };
};

export async function getProductsFromCollection(handle: string) {
  const query = /* GraphQL */ `
    query ProductsFromCollection($handle: String!) {
      collection(handle: $handle) {
        products(first: 12) {
          nodes {
            id
            handle
            title
            featuredImage {
              url
              altText
              width
              height
            }
            priceRange {
              minVariantPrice {
                amount
                currencyCode
              }
            }
          }
        }
      }
    }
  `;

  const data = await shopifyQuery<{
    collection: { products: { nodes: ProductCard[] } } | null;
  }>(query, { handle });

  return data.collection?.products.nodes ?? [];
}

export type ShopifyProduct = {
  id: string;
  handle: string;
  title: string;
  description: string;
  featuredImage?: { url: string; altText?: string | null } | null;
  images: { nodes: Array<{ url: string; altText?: string | null }> };
  options: Array<{ name: string; values: string[] }>;
  variants: {
    nodes: Array<{
      id: string;
      availableForSale: boolean;
      selectedOptions: Array<{ name: string; value: string }>;
      image?: { url: string; altText?: string | null } | null;
      price: { amount: string; currencyCode: string };
    }>;
  };
};

export async function getProductByHandle(handle: string) {
  const query = /* GraphQL */ `
    query ProductByHandle($handle: String!) {
      product(handle: $handle) {
        id
        handle
        title
        description
        featuredImage {
          url
          altText
        }
        images(first: 10) {
          nodes {
            url
            altText
          }
        }
        options {
          name
          values
        }
        variants(first: 30) {
          nodes {
            id
            availableForSale
            selectedOptions {
              name
              value
            }
            image {
              url
              altText
            }
            price {
              amount
              currencyCode
            }
          }
        }
      }
    }
  `;

  const data = await shopifyQuery<{ product: ShopifyProduct | null }>(query, {
    handle,
  });

  return data.product;
}
