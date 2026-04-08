import { Mail, Phone, MapPin, Clock, Facebook, Twitter, Instagram, Linkedin } from "lucide-react";

export function ContactInfoSection() {
  return (
    <div>
      <h2 className="text-2xl font-bold text-[#0B2A4A] mb-6">Get in Touch</h2>
      <div className="space-y-6 mb-8">
        {[
          { icon: MapPin, title: "Address", content: "123 Solar Street, Gulberg III, Lahore, Pakistan" },
          { icon: Phone, title: "Phone", content: "+92 300 1234567", sub: "Mon-Fri 9AM-6PM" },
          { icon: Mail, title: "Email", content: "info@energymart.pk", sub: "support@energymart.pk" },
          { icon: Clock, title: "Business Hours", content: "Mon-Fri: 9AM-6PM, Sat: 10AM-4PM", sub: "Sunday: Closed" },
        ].map((item) => {
          const Icon = item.icon;
          return (
            <div key={item.title} className="flex items-start space-x-4">
              <div className="w-12 h-12 bg-[#FF7A00]/10 rounded-lg flex items-center justify-center flex-shrink-0">
                <Icon className="w-6 h-6 text-[#FF7A00]" />
              </div>
              <div>
                <h3 className="font-semibold text-[#0B2A4A] mb-1">{item.title}</h3>
                <p className="text-gray-600">{item.content}</p>
                {item.sub && <p className="text-gray-500 text-sm">{item.sub}</p>}
              </div>
            </div>
          );
        })}
      </div>
      <div>
        <h3 className="font-semibold text-[#0B2A4A] mb-4">Follow Us</h3>
        <div className="flex space-x-4">
          {[Facebook, Twitter, Instagram, Linkedin].map((Icon) => (
            <a key={Icon.name} href="#" className="w-12 h-12 bg-[#0B2A4A] text-white rounded-lg flex items-center justify-center hover:bg-[#FF7A00] transition-colors">
              <Icon className="w-6 h-6" />
            </a>
          ))}
        </div>
      </div>
    </div>
  );
}
