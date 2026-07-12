import { STORE_GOOGLE_MAPS_EMBED_URL, STORE_GOOGLE_MAPS_URL } from "../../../../constants/storeMapsUrl";

const STORE_ADDRESS = "Shop 64, Lalazar Commercial Market, Raiwind Road - Lahore";

export function MapSection() {
  return (
    <section className="bg-white py-20">
      <div className="container mx-auto px-4">
        <div className="text-center">
          <h2 className="mb-6 text-3xl font-bold text-[#0B2A4A]">Find Us</h2>
          <div className="mx-auto h-96 w-full max-w-5xl overflow-hidden rounded-2xl bg-gray-200 shadow-md ring-1 ring-black/5">
            <iframe
              title="Energy Mart store on Google Maps"
              src={STORE_GOOGLE_MAPS_EMBED_URL}
              className="h-full w-full border-0"
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              allowFullScreen
            />
          </div>
          <p className="mt-4 text-gray-600">
            <a
              href={STORE_GOOGLE_MAPS_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="transition-colors hover:text-[#FF7A00] hover:underline"
            >
              {STORE_ADDRESS}
            </a>
          </p>
        </div>
      </div>
    </section>
  );
}
