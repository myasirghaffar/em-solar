import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { Heart, HeartOff, ShoppingBag, X } from "lucide-react";
import { useCart } from "../../context/CartContext";
import { useFavorites } from "../../context/FavoritesContext";
import { useScrollLock } from "../../hooks/useScrollLock";
import { CartEmpty, CartItems, OrderSummary } from "../../pages/website/Cart/features";

export default function CartDrawer() {
  const {
    cartItems,
    updateCartQuantity,
    removeFromCart,
    isCartOpen,
    closeCart,
    drawerTab,
    setDrawerTab,
  } = useCart();
  const { favoriteIds, removeFavorite } = useFavorites();

  const [catalog, setCatalog] = useState<any[]>([]);

  useScrollLock(isCartOpen);

  const subtotal = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const shipping = subtotal > 50000 ? 0 : 2000;
  const total = subtotal + shipping;
  const itemCount = cartItems.reduce((sum, item) => sum + item.quantity, 0);

  const favoriteProducts = useMemo(
    () => catalog.filter((p: { id: number }) => favoriteIds.includes(p.id)),
    [catalog, favoriteIds],
  );

  useEffect(() => {
    if (!isCartOpen) return;
    let cancelled = false;
    (async () => {
      try {
        const { fetchProducts } = await import("../../lib/api");
        const { withStoreProductFallback } = await import("../../data/dummyProducts");
        const data = await fetchProducts();
        if (!cancelled) setCatalog(withStoreProductFallback(data));
      } catch {
        if (!cancelled) setCatalog([]);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [isCartOpen]);

  useEffect(() => {
    if (!isCartOpen) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") closeCart();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [isCartOpen, closeCart]);

  const title = drawerTab === "cart" ? "Your cart" : "Saved items";
  const subtitle =
    drawerTab === "cart"
      ? itemCount > 0
        ? `${itemCount} ${itemCount === 1 ? "item" : "items"}`
        : null
      : favoriteIds.length > 0
        ? `${favoriteIds.length} ${favoriteIds.length === 1 ? "product" : "products"}`
        : "No saved items yet";

  return (
    <div
      className={`fixed inset-0 z-[100] flex justify-end ${
        isCartOpen ? "visible" : "pointer-events-none invisible"
      }`}
      aria-hidden={!isCartOpen}
    >
      <button
        type="button"
        className={`absolute inset-0 bg-black/40 transition-opacity duration-300 ease-out ${
          isCartOpen ? "pointer-events-auto opacity-100" : "opacity-0"
        }`}
        onClick={closeCart}
        aria-label="Close drawer"
      />

      <aside
        className={`pointer-events-auto relative flex h-full w-full max-w-md flex-col bg-white shadow-2xl transition-transform duration-300 ease-out ${
          isCartOpen ? "translate-x-0" : "translate-x-full"
        }`}
        role="dialog"
        aria-modal="true"
        aria-labelledby="store-drawer-title"
      >
        <div className="flex shrink-0 items-start justify-between gap-3 border-b border-gray-100 bg-white px-4 py-4">
          <div className="min-w-0 flex-1">
            <div className="mb-3 flex gap-1 rounded-xl bg-gray-100/90 p-1">
              <button
                type="button"
                onClick={() => setDrawerTab("cart")}
                className={[
                  "flex flex-1 items-center justify-center gap-1.5 rounded-lg px-3 py-2 text-xs font-semibold transition-colors sm:text-sm",
                  drawerTab === "cart"
                    ? "bg-white text-[#0B2A4A] shadow-sm"
                    : "text-gray-600 hover:text-[#0B2A4A]",
                ].join(" ")}
                aria-pressed={drawerTab === "cart"}
              >
                <ShoppingBag className="h-4 w-4 shrink-0" aria-hidden />
                Cart
                {itemCount > 0 ? (
                  <span className="tabular-nums text-gray-500">({itemCount})</span>
                ) : null}
              </button>
              <button
                type="button"
                onClick={() => setDrawerTab("favorites")}
                className={[
                  "flex flex-1 items-center justify-center gap-1.5 rounded-lg px-3 py-2 text-xs font-semibold transition-colors sm:text-sm",
                  drawerTab === "favorites"
                    ? "bg-white text-[#0B2A4A] shadow-sm"
                    : "text-gray-600 hover:text-[#0B2A4A]",
                ].join(" ")}
                aria-pressed={drawerTab === "favorites"}
              >
                <Heart className="h-4 w-4 shrink-0" aria-hidden />
                Saved
                {favoriteIds.length > 0 ? (
                  <span className="tabular-nums text-gray-500">({favoriteIds.length})</span>
                ) : null}
              </button>
            </div>
            <h2 id="store-drawer-title" className="text-lg font-bold tracking-tight text-[#0B2A4A]">
              {title}
            </h2>
            {subtitle ? <p className="mt-0.5 text-sm text-gray-500">{subtitle}</p> : null}
          </div>
          <button
            type="button"
            onClick={closeCart}
            className="shrink-0 rounded-full p-2 text-gray-500 transition-colors hover:bg-gray-100 hover:text-[#0B2A4A]"
            aria-label="Close drawer"
          >
            <X className="h-6 w-6" />
          </button>
        </div>

        <div className="min-h-0 flex-1 overflow-y-auto overscroll-contain bg-slate-50/60 px-4 py-4">
          {drawerTab === "cart" ? (
            cartItems.length === 0 ? (
              <CartEmpty onContinue={closeCart} />
            ) : (
              <div className="space-y-4 pb-2">
                <CartItems
                  items={cartItems}
                  updateCartQuantity={updateCartQuantity}
                  removeFromCart={removeFromCart}
                />
                <OrderSummary
                  subtotal={subtotal}
                  shipping={shipping}
                  total={total}
                  itemCount={itemCount}
                  onNavigate={closeCart}
                />
              </div>
            )
          ) : favoriteIds.length === 0 ? (
            <div className="flex flex-col items-center px-4 py-14 text-center">
              <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-[#FF7A00]/10 text-[#FF7A00]">
                <Heart className="h-8 w-8" aria-hidden />
              </div>
              <p className="text-base font-semibold text-[#0B2A4A]">No saved items yet</p>
              <p className="mt-2 max-w-xs text-sm text-gray-600">
                Tap the heart on a product to save it here for quick access.
              </p>
              <Link
                to="/shop"
                onClick={closeCart}
                className="mt-6 rounded-full bg-[#0B2A4A] px-6 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-[#0B2A4A]/90"
              >
                Browse shop
              </Link>
            </div>
          ) : favoriteProducts.length === 0 ? (
            <p className="py-8 text-center text-sm text-gray-500">Loading saved items…</p>
          ) : (
            <ul className="space-y-3 pb-2">
              {favoriteProducts.map((p: any) => (
                <li
                  key={p.id}
                  className="overflow-hidden rounded-xl border border-gray-200/80 bg-white shadow-sm ring-1 ring-gray-100"
                >
                  <div className="flex gap-3 p-4">
                    <Link
                      to={`/product/${p.id}`}
                      onClick={closeCart}
                      className="relative shrink-0"
                    >
                      <img
                        src={p.images?.[0] || "/placeholder-product.jpg"}
                        alt=""
                        className="h-20 w-20 rounded-lg object-cover sm:h-24 sm:w-24"
                      />
                    </Link>
                    <div className="min-w-0 flex-1">
                      <Link
                        to={`/product/${p.id}`}
                        onClick={closeCart}
                        className="block text-sm font-semibold leading-snug text-[#0B2A4A] transition-colors hover:text-[#FF7A00] sm:text-base"
                      >
                        {p.name}
                      </Link>
                      {p.category ? (
                        <p className="mt-1 text-xs text-gray-500 sm:text-sm">{p.category}</p>
                      ) : null}
                      <p className="mt-2 text-sm font-bold text-[#FF7A00]">
                        Rs. {Number(p.price).toLocaleString()}
                      </p>
                    </div>
                    <button
                      type="button"
                      onClick={() => removeFavorite(p.id)}
                      className="shrink-0 self-start rounded-lg p-2 text-gray-400 transition-colors hover:bg-red-50 hover:text-red-600"
                      aria-label={`Remove ${p.name} from saved`}
                    >
                      <HeartOff className="h-5 w-5" />
                    </button>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>
      </aside>
    </div>
  );
}
