import { Link } from "react-router-dom";

export function CTASection() {
  return (
    <section className="py-20 bg-gradient-to-r from-[#FF7A00] to-[#ff9429] text-white">
      <div className="container mx-auto px-4 text-center">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Ready to Go Solar?</h2>
          <p className="text-xl mb-8 opacity-90">Join thousands of Pakistanis who have already made the switch to clean, renewable energy</p>
          <Link to="/shop" className="inline-block bg-white text-[#FF7A00] px-8 py-4 rounded-lg font-semibold text-lg hover:bg-gray-100 transition-colors">Browse Products</Link>
        </div>
      </div>
    </section>
  );
}
