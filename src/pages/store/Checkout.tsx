import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { CreditCard, Truck, CheckCircle } from 'lucide-react';
import { useCart } from '../../context/CartContext';
import Input from '../../components/ui/Input';

export default function Checkout() {
  const { cartItems, clearCart } = useCart();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    city: '',
    address: '',
    notes: '',
    payment_method: 'cod'
  });

  const subtotal = cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  const shipping = subtotal > 50000 ? 0 : 2000;
  const total = subtotal + shipping;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      await fetch('/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          products: cartItems,
          total_price: total
        })
      });
      
      clearCart();
      navigate('/');
      alert('Order placed successfully!');
    } catch (err) {
      console.error('Error:', err);
      alert('Failed to place order. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  if (cartItems.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-700 mb-4">Your cart is empty</h2>
          <Link to="/shop">
            <button className="bg-[#FF7A00] text-white px-8 py-3 rounded-lg font-semibold">Continue Shopping</button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4">
        <h1 className="text-3xl font-bold text-[#0B2A4A] mb-8">Checkout</h1>

        <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Checkout Form */}
          <div className="lg:col-span-2 space-y-6">
            {/* Contact Information */}
            <div className="bg-white rounded-xl shadow-md p-6">
              <div className="flex items-center space-x-3 mb-6">
                <div className="w-10 h-10 bg-[#FF7A00]/10 rounded-full flex items-center justify-center">
                  <CheckCircle className="w-5 h-5 text-[#FF7A00]" />
                </div>
                <h2 className="text-xl font-bold text-[#0B2A4A]">Contact Information</h2>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Input
                  label="Full Name"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  required
                />
                <Input
                  label="Email"
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  required
                />
                <Input
                  label="Phone Number"
                  type="tel"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  required
                />
                <Input
                  label="City"
                  value={formData.city}
                  onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                  required
                />
              </div>
            </div>

            {/* Shipping Address */}
            <div className="bg-white rounded-xl shadow-md p-6">
              <div className="flex items-center space-x-3 mb-6">
                <div className="w-10 h-10 bg-[#FF7A00]/10 rounded-full flex items-center justify-center">
                  <Truck className="w-5 h-5 text-[#FF7A00]" />
                </div>
                <h2 className="text-xl font-bold text-[#0B2A4A]">Shipping Address</h2>
              </div>
              <div className="space-y-4">
                <Input
                  label="Street Address"
                  value={formData.address}
                  onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                  required
                />
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Additional Notes (Optional)</label>
                  <textarea
                    value={formData.notes}
                    onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                    rows={3}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#FF7A00]"
                    placeholder="Any special instructions for delivery..."
                  />
                </div>
              </div>
            </div>

            {/* Payment Method */}
            <div className="bg-white rounded-xl shadow-md p-6">
              <div className="flex items-center space-x-3 mb-6">
                <div className="w-10 h-10 bg-[#FF7A00]/10 rounded-full flex items-center justify-center">
                  <CreditCard className="w-5 h-5 text-[#FF7A00]" />
                </div>
                <h2 className="text-xl font-bold text-[#0B2A4A]">Payment Method</h2>
              </div>
              <div className="space-y-4">
                <label className={`flex items-center p-4 border-2 rounded-lg cursor-pointer transition-colors ${
                  formData.payment_method === 'cod' ? 'border-[#FF7A00] bg-[#FF7A00]/5' : 'border-gray-300'
                }`}>
                  <input
                    type="radio"
                    name="payment"
                    value="cod"
                    checked={formData.payment_method === 'cod'}
                    onChange={(e) => setFormData({ ...formData, payment_method: e.target.value })}
                    className="w-4 h-4 text-[#FF7A00]"
                  />
                  <div className="ml-4">
                    <p className="font-semibold text-[#0B2A4A]">Cash on Delivery</p>
                    <p className="text-sm text-gray-500">Pay when you receive your order</p>
                  </div>
                </label>
                <label className={`flex items-center p-4 border-2 rounded-lg cursor-pointer transition-colors ${
                  formData.payment_method === 'bank' ? 'border-[#FF7A00] bg-[#FF7A00]/5' : 'border-gray-300'
                }`}>
                  <input
                    type="radio"
                    name="payment"
                    value="bank"
                    checked={formData.payment_method === 'bank'}
                    onChange={(e) => setFormData({ ...formData, payment_method: e.target.value })}
                    className="w-4 h-4 text-[#FF7A00]"
                  />
                  <div className="ml-4">
                    <p className="font-semibold text-[#0B2A4A]">Bank Transfer</p>
                    <p className="text-sm text-gray-500">Transfer to our bank account</p>
                  </div>
                </label>
              </div>
            </div>
          </div>

          {/* Order Summary */}
          <div>
            <div className="bg-white rounded-xl shadow-md p-6 sticky top-24">
              <h2 className="text-xl font-bold text-[#0B2A4A] mb-6">Order Summary</h2>
              
              {/* Cart Items */}
              <div className="space-y-4 mb-6 max-h-64 overflow-y-auto">
                {cartItems.map(item => (
                  <div key={`${item.id}-${item.quantity}`} className="flex space-x-4">
                    <img
                      src={item.images?.[0] || '/placeholder.jpg'}
                      alt={item.name}
                      className="w-16 h-16 object-cover rounded-lg"
                    />
                    <div className="flex-1">
                      <h4 className="font-medium text-[#0B2A4A] text-sm line-clamp-2">{item.name}</h4>
                      <p className="text-gray-500 text-sm">Qty: {item.quantity}</p>
                    </div>
                    <p className="font-semibold text-[#FF7A00]">Rs. {(item.price * item.quantity).toLocaleString()}</p>
                  </div>
                ))}
              </div>

              {/* Totals */}
              <div className="border-t pt-4 space-y-3">
                <div className="flex justify-between text-gray-600">
                  <span>Subtotal</span>
                  <span>Rs. {subtotal.toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-gray-600">
                  <span>Shipping</span>
                  <span>{shipping === 0 ? 'Free' : `Rs. ${shipping.toLocaleString()}`}</span>
                </div>
                <div className="flex justify-between text-lg font-bold text-[#0B2A4A] border-t pt-3">
                  <span>Total</span>
                  <span>Rs. {total.toLocaleString()}</span>
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full mt-6 bg-[#FF7A00] text-white py-3 rounded-lg font-semibold hover:bg-[#FF7A00]/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? 'Processing...' : 'Place Order'}
              </button>

              <Link to="/cart" className="block mt-4 text-center text-[#0B2A4A] hover:text-[#FF7A00] transition-colors">
                ← Back to Cart
              </Link>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}