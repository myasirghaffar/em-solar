import { CheckCircle, Truck, CreditCard } from "lucide-react";
import Input from "../../../../components/ui/Input";

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
    <div className="lg:col-span-2 space-y-6">
      <div className="bg-white rounded-xl shadow-md p-6">
        <div className="flex items-center space-x-3 mb-6">
          <div className="w-10 h-10 bg-[#FF7A00]/10 rounded-full flex items-center justify-center">
            <CheckCircle className="w-5 h-5 text-[#FF7A00]" />
          </div>
          <h2 className="text-xl font-bold text-[#0B2A4A]">Contact Information</h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Input label="Full Name" value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} required />
          <Input label="Email" type="email" value={formData.email} onChange={(e) => setFormData({ ...formData, email: e.target.value })} required />
          <Input label="Phone Number" type="tel" value={formData.phone} onChange={(e) => setFormData({ ...formData, phone: e.target.value })} required />
          <Input label="City" value={formData.city} onChange={(e) => setFormData({ ...formData, city: e.target.value })} required />
        </div>
      </div>
      <div className="bg-white rounded-xl shadow-md p-6">
        <div className="flex items-center space-x-3 mb-6">
          <div className="w-10 h-10 bg-[#FF7A00]/10 rounded-full flex items-center justify-center">
            <Truck className="w-5 h-5 text-[#FF7A00]" />
          </div>
          <h2 className="text-xl font-bold text-[#0B2A4A]">Shipping Address</h2>
        </div>
        <div className="space-y-4">
          <Input label="Street Address" value={formData.address} onChange={(e) => setFormData({ ...formData, address: e.target.value })} required />
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Additional Notes (Optional)</label>
            <textarea value={formData.notes} onChange={(e) => setFormData({ ...formData, notes: e.target.value })} rows={3} className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#FF7A00]" placeholder="Any special instructions for delivery..." />
          </div>
        </div>
      </div>
      <div className="bg-white rounded-xl shadow-md p-6">
        <div className="flex items-center space-x-3 mb-6">
          <div className="w-10 h-10 bg-[#FF7A00]/10 rounded-full flex items-center justify-center">
            <CreditCard className="w-5 h-5 text-[#FF7A00]" />
          </div>
          <h2 className="text-xl font-bold text-[#0B2A4A]">Payment Method</h2>
        </div>
        <div className="space-y-4">
          <label className={`flex items-center p-4 border-2 rounded-lg cursor-pointer transition-colors ${formData.payment_method === "cod" ? "border-[#FF7A00] bg-[#FF7A00]/5" : "border-gray-300"}`}>
            <input type="radio" name="payment" value="cod" checked={formData.payment_method === "cod"} onChange={(e) => setFormData({ ...formData, payment_method: e.target.value })} className="w-4 h-4 text-[#FF7A00]" />
            <div className="ml-4">
              <p className="font-semibold text-[#0B2A4A]">Cash on Delivery</p>
              <p className="text-sm text-gray-500">Pay when you receive your order</p>
            </div>
          </label>
          <label className={`flex items-center p-4 border-2 rounded-lg cursor-pointer transition-colors ${formData.payment_method === "bank" ? "border-[#FF7A00] bg-[#FF7A00]/5" : "border-gray-300"}`}>
            <input type="radio" name="payment" value="bank" checked={formData.payment_method === "bank"} onChange={(e) => setFormData({ ...formData, payment_method: e.target.value })} className="w-4 h-4 text-[#FF7A00]" />
            <div className="ml-4">
              <p className="font-semibold text-[#0B2A4A]">Bank Transfer</p>
              <p className="text-sm text-gray-500">Transfer to our bank account</p>
            </div>
          </label>
        </div>
      </div>
    </div>
  );
}
