import { useState } from "react";

export function ConsultationForm() {
  const [formData, setFormData] = useState({ name: "", phone: "", city: "", monthly_bill: "", message: "" });
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await fetch("/api/consultations", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(formData) });
      setSubmitted(true);
      setFormData({ name: "", phone: "", city: "", monthly_bill: "", message: "" });
      setTimeout(() => setSubmitted(false), 3000);
    } catch (err) {
      console.error("Error:", err);
    }
  };

  if (submitted) {
    return (
      <div className="bg-white/20 backdrop-blur-sm rounded-xl p-6">
        <p className="text-xl font-semibold">Thank you! We'll contact you soon.</p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="bg-white/20 backdrop-blur-sm rounded-xl p-6 md:p-8 text-left">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
        <input type="text" placeholder="Your Name" value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} required className="px-4 py-3 rounded-lg bg-white/90 text-[#0B2A4A] placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-white" />
        <input type="tel" placeholder="Phone Number" value={formData.phone} onChange={(e) => setFormData({ ...formData, phone: e.target.value })} required className="px-4 py-3 rounded-lg bg-white/90 text-[#0B2A4A] placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-white" />
        <input type="text" placeholder="City" value={formData.city} onChange={(e) => setFormData({ ...formData, city: e.target.value })} required className="px-4 py-3 rounded-lg bg-white/90 text-[#0B2A4A] placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-white" />
        <input type="text" placeholder="Monthly Electricity Bill (PKR)" value={formData.monthly_bill} onChange={(e) => setFormData({ ...formData, monthly_bill: e.target.value })} className="px-4 py-3 rounded-lg bg-white/90 text-[#0B2A4A] placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-white" />
      </div>
      <textarea placeholder="Your Message" value={formData.message} onChange={(e) => setFormData({ ...formData, message: e.target.value })} rows={3} className="w-full px-4 py-3 rounded-lg bg-white/90 text-[#0B2A4A] placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-white mb-4" />
      <button type="submit" className="w-full bg-[#0B2A4A] text-white py-3 rounded-lg font-semibold hover:bg-[#0B2A4A]/90 transition-colors">Request Consultation</button>
    </form>
  );
}
