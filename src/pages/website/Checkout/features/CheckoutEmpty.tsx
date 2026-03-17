import { Link } from "react-router-dom";

export function CheckoutEmpty() {
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
