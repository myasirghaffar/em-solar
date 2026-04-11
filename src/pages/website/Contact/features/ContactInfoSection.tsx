import type { LucideIcon } from "lucide-react";
import { Mail, Phone, MapPin, Clock, Facebook, Instagram, Linkedin } from "lucide-react";
import type { ReactNode } from "react";
import { STORE_GOOGLE_MAPS_URL } from "../../../../constants/storeMapsUrl";
import { SOCIAL_LINKS } from "../../../../constants/socialLinks";

const STORE_ADDRESS = "Shop 64, Lalazar Commercial Market, Raiwind Road - Lahore";

const linkClass =
  "text-gray-600 transition-colors hover:text-[#FF7A00] underline-offset-2 hover:underline";

const rows: { icon: LucideIcon; title: string; main: ReactNode; sub?: string }[] = [
  {
    icon: MapPin,
    title: "Store Address",
    main: (
      <a
        href={STORE_GOOGLE_MAPS_URL}
        target="_blank"
        rel="noopener noreferrer"
        className={linkClass}
      >
        {STORE_ADDRESS}
      </a>
    ),
  },
  {
    icon: Phone,
    title: "Call Info",
    main: (
      <a href="tel:+923014756516" className={linkClass}>
        +92 301 4756516
      </a>
    ),
    sub: "Open a chat or give us call at",
  },
  {
    icon: Mail,
    title: "Email Support",
    main: (
      <p className="text-gray-600">
        Sent mail to{" "}
        <a href="mailto:info@energymart.pk" className={`font-medium ${linkClass}`}>
          info@energymart.pk
        </a>
      </p>
    ),
  },
  {
    icon: Clock,
    title: "Business Hours",
    main: (
      <>
        <p className="text-gray-600">Mon-Fri: 9AM-6PM, Sat: 10AM-4PM</p>
        <p className="mt-1 text-sm text-gray-500">Sunday: Closed</p>
      </>
    ),
  },
];

export function ContactInfoSection() {
  return (
    <div>
      <h2 className="mb-6 text-2xl font-bold text-[#0B2A4A]">Get in Touch</h2>
      <div className="mb-8 space-y-6">
        {rows.map(({ icon: Icon, title, main, sub }) => (
          <div key={title} className="flex items-start space-x-4">
            <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-lg bg-[#FF7A00]/10">
              <Icon className="h-6 w-6 text-[#FF7A00]" />
            </div>
            <div>
              <h3 className="mb-1 font-semibold text-[#0B2A4A]">{title}</h3>
              <div className="min-w-0">{main}</div>
              {sub && <p className="mt-1 text-sm text-gray-500">{sub}</p>}
            </div>
          </div>
        ))}
      </div>
      <div>
        <h3 className="mb-4 font-semibold text-[#0B2A4A]">Follow Us</h3>
        <div className="flex space-x-4">
          {(
            [
              { Icon: Facebook, href: SOCIAL_LINKS.facebook, label: "Facebook" },
              { Icon: Instagram, href: SOCIAL_LINKS.instagram, label: "Instagram" },
              { Icon: Linkedin, href: SOCIAL_LINKS.linkedin, label: "LinkedIn" },
            ] as const
          ).map(({ Icon, href, label }) => (
            <a
              key={label}
              href={href}
              target="_blank"
              rel="noopener noreferrer"
              className="flex h-12 w-12 items-center justify-center rounded-lg bg-[#0B2A4A] text-white transition-colors hover:bg-[#FF7A00]"
              aria-label={`EnergyMart on ${label}`}
            >
              <Icon className="h-6 w-6" />
            </a>
          ))}
        </div>
      </div>
    </div>
  );
}
