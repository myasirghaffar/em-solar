"use client";

import { useState } from "react";
import type { LucideIcon } from "lucide-react";
import {
  ShoppingCart,
  Star,
  Truck,
  Shield,
  Check,
  Minus,
  Plus,
  Heart,
  Share2,
} from "lucide-react";

import { useCart } from "../../../../context/CartContext";
import { useFavorites } from "../../../../context/FavoritesContext";
import { ButtonSpinner } from "../../../../components/ui/Button";
import { toastError, toastSuccess } from "../../../../lib/toast";

const HIGHLIGHT_ICONS: LucideIcon[] = [Truck, Shield, Check, Check];

interface ProductInfoProps {
  product: any;
  quantity: number;
  setQuantity: (v: number) => void;
  onAddToCart: () => void;
}

export function ProductInfo({ product, quantity, setQuantity, onAddToCart }: ProductInfoProps) {
  const { cartItems } = useCart();
  const { isFavorite, toggleFavorite } = useFavorites();
  const [sharing, setSharing] = useState(false);

  const isInCart = cartItems.some((item: { id: number }) => item.id === product.id);
  const favorited = isFavorite(product.id);
  const highlightOptions: string[] = Array.isArray(product.highlightOptions)
    ? product.highlightOptions.filter((o: unknown) => typeof o === "string" && o.trim().length > 0)
    : [];

  const handleShare = async () => {
    if (sharing) return;
    setSharing(true);
    try {
      const url = `${window.location.origin}/product/${product.id}`;
      const sharePayload = {
        title: product.name,
        text: `Check out ${product.name} on EnergyMart`,
        url,
      };

      try {
        if (typeof navigator.share === "function") {
          await navigator.share(sharePayload);
          return;
        }
      } catch (err) {
        if (err instanceof DOMException && err.name === "AbortError") return;
      }

      try {
        await navigator.clipboard.writeText(url);
        toastSuccess("Product link copied to clipboard");
      } catch {
        toastError("Could not share this product");
      }
    } finally {
      setSharing(false);
    }
  };

  return (
    <div className="space-y-8">
      <div className="space-y-3">
        <span className="inline-flex rounded-full bg-[#FF7A00]/10 px-3.5 py-1 text-xs font-semibold tracking-wide text-[#FF7A00]">
          {product.category}
        </span>
        <h1 className="text-3xl font-bold tracking-tight text-[#0B2A4A] md:text-4xl md:leading-tight">
          {product.name}
        </h1>
        <div className="flex flex-wrap items-center gap-2 text-sm text-gray-600">
          <div className="flex text-yellow-400" aria-hidden>
            {[...Array(5)].map((_, i) => (
              <Star key={i} className="h-4 w-4 fill-current md:h-[1.125rem] md:w-[1.125rem]" />
            ))}
          </div>
          <span className="text-gray-500">(4.5 out of 5)</span>
        </div>
      </div>

      <div>
        <p className="text-3xl font-bold tracking-tight text-[#FF7A00] md:text-4xl">
          Rs. {product.price.toLocaleString()}
        </p>
        <p className="mt-1 text-sm text-gray-500">Inclusive of all taxes</p>
      </div>

      {highlightOptions.length > 0 ? (
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-2 sm:gap-4">
          {highlightOptions.map((label, index) => {
            const Icon = HIGHLIGHT_ICONS[index % HIGHLIGHT_ICONS.length];
            return (
              <div
                key={`${label}-${index}`}
                className="flex items-center gap-3 rounded-2xl bg-gray-50/90 px-4 py-3.5 ring-1 ring-gray-100 transition-colors hover:bg-gray-50"
              >
                <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-white shadow-sm ring-1 ring-gray-100">
                  <Icon className="h-4 w-4 text-[#FF7A00]" aria-hidden />
                </span>
                <span className="text-sm font-medium leading-snug text-[#0B2A4A]">{label}</span>
              </div>
            );
          })}
        </div>
      ) : null}

      <div className="flex flex-col gap-3 sm:flex-row sm:items-stretch">
        <div className="inline-flex h-12 shrink-0 items-stretch overflow-hidden rounded-2xl bg-white shadow-sm ring-1 ring-gray-200/90 sm:h-[3.25rem]">
          <button
            type="button"
            onClick={() => setQuantity(Math.max(1, quantity - 1))}
            className="px-4 text-gray-600 transition-colors hover:bg-gray-50 hover:text-[#0B2A4A]"
            aria-label="Decrease quantity"
          >
            <Minus className="h-5 w-5" />
          </button>
          <span className="flex min-w-[3rem] items-center justify-center border-x border-gray-100 px-2 text-base font-semibold tabular-nums text-[#0B2A4A]">
            {quantity}
          </span>
          <button
            type="button"
            onClick={() => setQuantity(quantity + 1)}
            className="px-4 text-gray-600 transition-colors hover:bg-gray-50 hover:text-[#0B2A4A]"
            aria-label="Increase quantity"
          >
            <Plus className="h-5 w-5" />
          </button>
        </div>

        <div className="flex min-w-0 flex-1 gap-2.5">
          <button
            type="button"
            onClick={onAddToCart}
            disabled={product.stock <= 0}
            className="inline-flex h-12 min-w-0 flex-1 items-center justify-center gap-2 rounded-2xl bg-[#FF7A00] px-5 text-sm font-semibold text-white shadow-md shadow-orange-500/20 transition-all hover:bg-[#e86e00] hover:shadow-lg hover:shadow-orange-500/25 disabled:cursor-not-allowed disabled:opacity-50 sm:h-[3.25rem] sm:text-base"
          >
            <ShoppingCart className="h-5 w-5 shrink-0" aria-hidden />
            <span className="truncate">{isInCart ? "Added in cart" : "Add to Cart"}</span>
          </button>

          <button
            type="button"
            onClick={() => toggleFavorite(product.id)}
            aria-pressed={favorited}
            aria-label={favorited ? "Remove from saved" : "Save to favorites"}
            className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl shadow-sm ring-1 transition-all sm:h-[3.25rem] sm:w-[3.25rem] ${
              favorited
                ? "bg-[#FF7A00]/10 text-[#FF7A00] ring-[#FF7A00]/30"
                : "bg-white text-gray-500 ring-gray-200/90 hover:bg-gray-50 hover:text-[#FF7A00]"
            }`}
          >
            <Heart className={`h-5 w-5 ${favorited ? "fill-current" : ""}`} aria-hidden />
          </button>

          <button
            type="button"
            onClick={() => void handleShare()}
            disabled={sharing}
            aria-label="Share product"
            aria-busy={sharing}
            className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-white text-gray-500 shadow-sm ring-1 ring-gray-200/90 transition-all hover:bg-gray-50 hover:text-[#0B2A4A] disabled:cursor-not-allowed disabled:opacity-60 sm:h-[3.25rem] sm:w-[3.25rem]"
          >
            {sharing ? <ButtonSpinner className="h-5 w-5" /> : <Share2 className="h-5 w-5" aria-hidden />}
          </button>
        </div>
      </div>

      <div
        className={`inline-flex items-center gap-2 rounded-full px-3 py-1.5 text-sm font-medium ${
          product.stock > 0 ? "bg-emerald-50 text-emerald-800" : "bg-red-50 text-red-800"
        }`}
      >
        <Check className="h-4 w-4 shrink-0" aria-hidden />
        <span>{product.stock > 0 ? `In stock · ${product.stock} available` : "Out of stock"}</span>
      </div>
    </div>
  );
}
