import { MapPin } from "lucide-react";

export function MapSection() {
  return (
    <section className="py-20 bg-white">
      <div className="container mx-auto px-4">
        <div className="text-center">
          <h2 className="text-3xl font-bold text-[#0B2A4A] mb-6">Find Us</h2>
          <div className="bg-gray-200 rounded-2xl overflow-hidden h-96 flex items-center justify-center">
            <div className="text-center">
              <MapPin className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-600">Interactive map will be displayed here</p>
              <p className="text-gray-500">123 Solar Street, Gulberg III, Lahore, Pakistan</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
