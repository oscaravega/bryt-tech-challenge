export const getShop = `#graphql
  query getShop {
    shop {
      name
      description
    }
  }
` as const;
