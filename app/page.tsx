import { getProductsFromCollection } from "@/lib/shopify/query";
import { ProductGridClient } from "@/components/ProductGrid.client";

const COLLECTION_HANDLE = "all";

export default async function Page() {
  const products = await getProductsFromCollection(COLLECTION_HANDLE);

  return (
    <main className="p-6">
      <h1 className="text-2xl font-semibold mb-6">Products</h1>
      <ProductGridClient products={products} />
    </main>
  );
}
