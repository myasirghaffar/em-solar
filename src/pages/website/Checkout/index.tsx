import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { ArrowLeft, CheckCircle2, Copy, Landmark, MessageCircle } from "lucide-react";
import { useCart } from "../../../context/CartContext";
import { toastError, toastSuccess } from "../../../lib/toast";
import type { StoreOrder } from "../../../lib/api";
import { CheckoutEmpty, CheckoutForm, CheckoutOrderSummary } from "./features";

const COD_LIMIT = 10_000;
const BANK_TRANSFER_DETAILS = {
  accountTitle: "Mubashir Zubair",
  whatsapp: "+92 301 4756516",
  whatsappDigits: "923014756516",
};

export default function Checkout() {
  const { cartItems, clearCart } = useCart();
  const [loading, setLoading] = useState(false);
  const [createdOrder, setCreatedOrder] = useState<StoreOrder | null>(null);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    city: "",
    address: "",
    notes: "",
    payment_method: "cod",
  });

  const subtotal = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const shipping = subtotal > 50000 ? 0 : 2000;
  const total = subtotal + shipping;
  const codUnavailable = total > COD_LIMIT;

  useEffect(() => {
    if (codUnavailable && formData.payment_method !== "bank") {
      setFormData((current) => ({ ...current, payment_method: "bank" }));
    }
  }, [codUnavailable, formData.payment_method]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const { createOrder } = await import("../../../lib/api");
      const paymentMethod = codUnavailable ? "bank" : formData.payment_method;
      const order = await createOrder({
        ...formData,
        payment_method: paymentMethod,
        products: cartItems,
        total_price: total,
      });
      if (!order?.id) throw new Error("createOrder failed");
      setCreatedOrder(order);
      clearCart();
      toastSuccess(paymentMethod === "bank" ? "Order placed. Please complete bank transfer." : "Order placed successfully!");
    } catch (err) {
      console.error("Error:", err);
      toastError("Failed to place order. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  if (createdOrder) {
    return <CheckoutSuccess order={createdOrder} />;
  }

  if (cartItems.length === 0) return <CheckoutEmpty />;

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="border-b border-gray-100 bg-white">
        <div className="container mx-auto flex flex-col gap-3 px-4 py-4 sm:flex-row sm:items-center sm:justify-between">
          <Link
            to="/shop"
            className="inline-flex items-center text-sm font-medium text-gray-600 transition-colors hover:text-[#FF7A00]"
          >
            <ArrowLeft className="mr-2 h-4 w-4 shrink-0" aria-hidden />
            Back to shop
          </Link>
          <span className="text-xs font-semibold uppercase tracking-[0.18em] text-[#FF7A00]">Secure checkout</span>
        </div>
      </div>
      <div className="container mx-auto px-4 py-8 md:py-10">
        <div className="mb-8">
          <h1 className="text-3xl font-bold tracking-tight text-[#0B2A4A] md:text-4xl">Checkout</h1>
          <p className="mt-2 max-w-2xl text-sm text-gray-600 md:text-base">
            Enter your shipping details and choose how you would like to pay.
          </p>
        </div>
        <form id="checkout-form" onSubmit={handleSubmit} className="grid grid-cols-1 gap-8 lg:grid-cols-3 lg:gap-10">
          <CheckoutForm
            formData={formData}
            setFormData={setFormData}
            codUnavailable={codUnavailable}
            codLimit={COD_LIMIT}
          />
          <CheckoutOrderSummary cartItems={cartItems} subtotal={subtotal} shipping={shipping} total={total} loading={loading} />
        </form>
      </div>
    </div>
  );
}

function CheckoutSuccess({ order }: { order: StoreOrder }) {
  const isBankTransfer = order.payment_method === "bank";
  const total = Number(order.total_price || 0);
  const whatsappHref = useMemo(() => {
    const text = [
      `Payment proof for order #${order.id}`,
      `Amount: Rs. ${total.toLocaleString()}`,
      `Name: ${order.customer_name || ""}`,
    ].join("\n");
    return `https://wa.me/${BANK_TRANSFER_DETAILS.whatsappDigits}?text=${encodeURIComponent(text)}`;
  }, [order.customer_name, order.id, total]);

  const copyText = [
    `Order ID: #${order.id}`,
    `Amount: Rs. ${total.toLocaleString()}`,
    `Account title: ${BANK_TRANSFER_DETAILS.accountTitle}`,
    `WhatsApp payment proof: ${BANK_TRANSFER_DETAILS.whatsapp}`,
  ].join("\n");

  async function copyPaymentDetails() {
    try {
      await navigator.clipboard.writeText(copyText);
      toastSuccess("Payment details copied.");
    } catch {
      toastError("Could not copy details. Please copy them manually.");
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="border-b border-gray-100 bg-white">
        <div className="container mx-auto flex flex-col gap-3 px-4 py-4 sm:flex-row sm:items-center sm:justify-between">
          <Link
            to="/shop"
            className="inline-flex items-center text-sm font-medium text-gray-600 transition-colors hover:text-[#FF7A00]"
          >
            <ArrowLeft className="mr-2 h-4 w-4 shrink-0" aria-hidden />
            Back to shop
          </Link>
          <span className="text-xs font-semibold uppercase tracking-[0.18em] text-[#FF7A00]">Order received</span>
        </div>
      </div>

      <div className="container mx-auto max-w-3xl px-4 py-10 md:py-14">
        <div className="rounded-2xl bg-white p-6 shadow-[0_8px_30px_rgba(15,23,42,0.06)] ring-1 ring-gray-200/90 md:p-8">
          <div className="flex flex-col gap-5 sm:flex-row sm:items-start">
            <span className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-emerald-50 ring-1 ring-emerald-100">
              <CheckCircle2 className="h-7 w-7 text-emerald-600" aria-hidden />
            </span>
            <div className="min-w-0 flex-1">
              <p className="text-sm font-semibold uppercase tracking-[0.18em] text-[#FF7A00]">Thank you</p>
              <h1 className="mt-2 text-3xl font-bold tracking-tight text-[#0B2A4A] md:text-4xl">
                Order #{order.id} has been placed
              </h1>
              <p className="mt-3 text-sm leading-6 text-gray-600 md:text-base">
                We have received your order. {isBankTransfer ? "Please complete the bank transfer and send payment proof with your order ID so the admin can verify it and start shipping." : "Our team will contact you before dispatch."}
              </p>
            </div>
          </div>

          {isBankTransfer ? (
            <div className="mt-8 rounded-2xl border border-amber-200 bg-amber-50 p-5 text-amber-950">
              <div className="flex items-center gap-3">
                <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-white/80 ring-1 ring-amber-200">
                  <Landmark className="h-5 w-5 text-[#FF7A00]" aria-hidden />
                </span>
                <div>
                  <h2 className="text-lg font-bold text-[#0B2A4A]">Bank transfer instructions</h2>
                  <p className="text-sm text-amber-900">Pay the order amount first, then send the slip on WhatsApp.</p>
                </div>
              </div>

              <dl className="mt-5 grid gap-3 rounded-xl bg-white p-4 text-sm ring-1 ring-amber-100 sm:grid-cols-2">
                <div>
                  <dt className="text-gray-500">Order ID</dt>
                  <dd className="mt-1 font-bold text-[#0B2A4A]">#{order.id}</dd>
                </div>
                <div>
                  <dt className="text-gray-500">Amount to pay</dt>
                  <dd className="mt-1 font-bold text-[#0B2A4A]">Rs. {total.toLocaleString()}</dd>
                </div>
                <div>
                  <dt className="text-gray-500">Account title</dt>
                  <dd className="mt-1 font-bold text-[#0B2A4A]">{BANK_TRANSFER_DETAILS.accountTitle}</dd>
                </div>
                <div>
                  <dt className="text-gray-500">Send slip on WhatsApp</dt>
                  <dd className="mt-1 font-bold text-[#0B2A4A]">{BANK_TRANSFER_DETAILS.whatsapp}</dd>
                </div>
              </dl>

              <ol className="mt-5 list-decimal space-y-2 pl-5 text-sm leading-6 text-amber-950">
                <li>Transfer Rs. {total.toLocaleString()} to the provided account title.</li>
                <li>Take a screenshot or photo of the payment slip.</li>
                <li>Send the slip on WhatsApp with order ID #{order.id}.</li>
                <li>After admin verification, your order will move to shipping.</li>
              </ol>

              <div className="mt-6 flex flex-col gap-3 sm:flex-row">
                <button
                  type="button"
                  onClick={() => void copyPaymentDetails()}
                  className="inline-flex min-h-11 items-center justify-center gap-2 rounded-xl border border-amber-300 bg-white px-4 py-2 text-sm font-semibold text-[#0B2A4A] transition hover:bg-amber-100"
                >
                  <Copy className="h-4 w-4" aria-hidden />
                  Copy details
                </button>
                <a
                  href={whatsappHref}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex min-h-11 items-center justify-center gap-2 rounded-xl bg-[#25D366] px-4 py-2 text-sm font-semibold text-white transition hover:bg-[#1fb857]"
                >
                  <MessageCircle className="h-4 w-4" aria-hidden />
                  Send proof on WhatsApp
                </a>
              </div>
            </div>
          ) : null}

          <div className="mt-8 flex flex-col gap-3 border-t border-gray-100 pt-6 sm:flex-row">
            <Link
              to="/shop"
              className="inline-flex min-h-11 items-center justify-center rounded-xl bg-[#FF7A00] px-5 py-2 text-sm font-semibold text-white transition hover:bg-[#e86e00]"
            >
              Continue shopping
            </Link>
            <Link
              to="/profile"
              className="inline-flex min-h-11 items-center justify-center rounded-xl border border-gray-200 px-5 py-2 text-sm font-semibold text-[#0B2A4A] transition hover:bg-gray-50"
            >
              View my orders
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
