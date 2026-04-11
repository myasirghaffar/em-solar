import { CheckCircle, Truck, CreditCard } from "lucide-react";
import Input from "../../../../components/ui/Input";

const panelClass =
  "rounded-2xl bg-white p-6 shadow-[0_8px_30px_rgba(15,23,42,0.06)] ring-1 ring-gray-200/90 md:p-7";

interface CheckoutFormProps {
  formData: {
    name: string;
    email: string;
    phone: string;
    city: string;
    address: string;
    notes: string;
    payment_method: string;
  };
  setFormData: (v: any) => void;
}

export function CheckoutForm({ formData, setFormData }: CheckoutFormProps) {
  return (
    <div className="space-y-6 lg:col-span-2">
      <div className={panelClass}>
        <div className="mb-6 flex items-center gap-3">
          <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-[#FF7A00]/10 ring-1 ring-[#FF7A00]/15">
            <CheckCircle className="h-5 w-5 text-[#FF7A00]" aria-hidden />
          </span>
          <div>
            <h2 className="text-lg font-bold tracking-tight text-[#0B2A4A] md:text-xl">Contact information</h2>
            <p className="text-sm text-gray-500">We will use this for order updates.</p>
          </div>
        </div>
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <Input label="Full Name" value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} required />
          <Input label="Email" type="email" value={formData.email} onChange={(e) => setFormData({ ...formData, email: e.target.value })} required />
          <Input label="Phone Number" type="tel" value={formData.phone} onChange={(e) => setFormData({ ...formData, phone: e.target.value })} required />
          <Input label="City" value={formData.city} onChange={(e) => setFormData({ ...formData, city: e.target.value })} required />
        </div>
      </div>
      <div className={panelClass}>
        <div className="mb-6 flex items-center gap-3">
          <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-[#FF7A00]/10 ring-1 ring-[#FF7A00]/15">
            <Truck className="h-5 w-5 text-[#FF7A00]" aria-hidden />
          </span>
          <div>
            <h2 className="text-lg font-bold tracking-tight text-[#0B2A4A] md:text-xl">Shipping address</h2>
            <p className="text-sm text-gray-500">Where should we deliver your order?</p>
          </div>
        </div>
        <div className="space-y-4">
          <Input label="Street Address" value={formData.address} onChange={(e) => setFormData({ ...formData, address: e.target.value })} required />
          <div>
            <label className="mb-2 block text-sm font-medium text-gray-700">Additional notes (optional)</label>
            <textarea
              value={formData.notes}
              onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
              rows={3}
              className="box-border min-h-[6.5rem] w-full resize-y rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm text-gray-900 shadow-sm outline-none transition-shadow focus:border-transparent focus:ring-2 focus:ring-[#FF7A00]"
              placeholder="Any special instructions for delivery…"
            />
          </div>
        </div>
      </div>
      <div className={panelClass}>
        <div className="mb-6 flex items-center gap-3">
          <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-[#FF7A00]/10 ring-1 ring-[#FF7A00]/15">
            <CreditCard className="h-5 w-5 text-[#FF7A00]" aria-hidden />
          </span>
          <div>
            <h2 className="text-lg font-bold tracking-tight text-[#0B2A4A] md:text-xl">Payment method</h2>
            <p className="text-sm text-gray-500">Choose how you would like to pay.</p>
          </div>
        </div>
        <div className="space-y-3">
          <label
            className={`flex cursor-pointer items-center gap-4 rounded-2xl p-4 ring-1 transition-all ${
              formData.payment_method === "cod"
                ? "bg-[#FF7A00]/5 ring-2 ring-[#FF7A00] shadow-sm"
                : "bg-gray-50/80 ring-gray-200/90 hover:bg-gray-50"
            }`}
          >
            <input
              type="radio"
              name="payment"
              value="cod"
              checked={formData.payment_method === "cod"}
              onChange={(e) => setFormData({ ...formData, payment_method: e.target.value })}
              className="h-4 w-4 shrink-0 text-[#FF7A00] focus:ring-[#FF7A00]"
            />
            <div className="min-w-0">
              <p className="font-semibold text-[#0B2A4A]">Cash on delivery</p>
              <p className="text-sm text-gray-500">Pay when you receive your order.</p>
            </div>
          </label>
          <label
            className={`flex cursor-pointer items-center gap-4 rounded-2xl p-4 ring-1 transition-all ${
              formData.payment_method === "bank"
                ? "bg-[#FF7A00]/5 ring-2 ring-[#FF7A00] shadow-sm"
                : "bg-gray-50/80 ring-gray-200/90 hover:bg-gray-50"
            }`}
          >
            <input
              type="radio"
              name="payment"
              value="bank"
              checked={formData.payment_method === "bank"}
              onChange={(e) => setFormData({ ...formData, payment_method: e.target.value })}
              className="h-4 w-4 shrink-0 text-[#FF7A00] focus:ring-[#FF7A00]"
            />
            <div className="min-w-0">
              <p className="font-semibold text-[#0B2A4A]">Bank transfer</p>
              <p className="text-sm text-gray-500">Transfer to our bank account.</p>
            </div>
          </label>
        </div>
      </div>
    </div>
  );
}
