import { DUMMY_PRODUCTS } from "./dummyProducts";

function clone<T>(value: T): T {
  return JSON.parse(JSON.stringify(value));
}

const BRANDS = [
  "Canadian Solar",
  "Growatt",
  "Pylontech",
  "SolarMax",
  "JA Solar",
  "Mean Well",
];

function buildSeedProducts(): any[] {
  const fromCatalog = DUMMY_PRODUCTS.map((p, i) => ({
    ...clone(p),
    brand: BRANDS[i % BRANDS.length],
    specifications: { Power: "550W", Type: "Monocrystalline" },
    longDescription: `Order ${p.name} from EnergyMart.pk for genuine stock, invoice-backed warranty, and nationwide logistics support. Our team can help you match this item with inverters, mounting, and cabling for your site.`,
    attachments:
      i % 2 === 0
        ? [
            { title: "Technical datasheet (PDF)", href: "#" },
            { title: "Installation checklist (PDF)", href: "#" },
          ]
        : [{ title: "Product brochure (PDF)", href: "#" }],
  }));
  return [
    ...fromCatalog,
    {
      id: 9907,
      name: "MPPT Solar Charge Controller 60A",
      price: 34500,
      description: "Programmable MPPT controller for 12/24/48V battery banks.",
      images: [
        "https://images.unsplash.com/photo-1621905251918-48416bd8575a?w=800&q=80",
      ],
      category: "Accessories",
      status: "active",
      stock: 22,
      brand: "Victron",
      specifications: { Amps: "60A", Voltage: "12–48V" },
      longDescription:
        "Suitable for off-grid and backup systems. Configure charging profiles via the companion app or front panel. EnergyMart.pk supplies factory-sealed units with manufacturer warranty registration support.",
      attachments: [
        { title: "User manual (PDF)", href: "#" },
        { title: "Wiring diagram (PDF)", href: "#" },
      ],
    },
    {
      id: 9908,
      name: "Grid-Tie String Inverter 10kW",
      price: 265000,
      description: "Three-phase string inverter with Wi‑Fi monitoring.",
      images: [
        "https://images.unsplash.com/photo-1508514177221-188b1cf16e9d?w=800&q=80",
      ],
      category: "Solar Inverters",
      status: "active",
      stock: 5,
      brand: "Solis",
      specifications: { Power: "10kW", Phases: "3" },
      longDescription:
        "Designed for three-phase commercial rooftops and small industrial plants. Includes Wi‑Fi / app monitoring. Pair with approved DC combiners and surge protection for code-compliant string design.",
      attachments: [{ title: "Datasheet & certificates (ZIP)", href: "#" }],
    },
  ];
}

const SEED_CUSTOMERS = [
  {
    id: 1,
    name: "Ali Khan",
    email: "ali.khan@example.com",
    phone: "03001234567",
    city: "Lahore",
    created_at: "2026-01-08T09:00:00.000Z",
  },
  {
    id: 2,
    name: "Sara Malik",
    email: "sara.malik@example.com",
    phone: "03219876543",
    city: "Karachi",
    created_at: "2026-01-22T11:30:00.000Z",
  },
  {
    id: 3,
    name: "Hassan Raza",
    email: "h.raza@example.com",
    phone: "03335551234",
    city: "Islamabad",
    created_at: "2026-02-05T14:15:00.000Z",
  },
  {
    id: 4,
    name: "Fatima Noor",
    email: "fatima.noor@example.com",
    phone: "03451237890",
    city: "Faisalabad",
    created_at: "2026-02-18T10:00:00.000Z",
  },
  {
    id: 5,
    name: "Omar Siddiqui",
    email: "omar.s@example.com",
    phone: "03114445566",
    city: "Multan",
    created_at: "2026-03-02T16:45:00.000Z",
  },
  {
    id: 6,
    name: "Ayesha Tariq",
    email: "ayesha.t@example.com",
    phone: "03007778899",
    city: "Rawalpindi",
    created_at: "2026-03-20T08:20:00.000Z",
  },
  {
    id: 7,
    name: "Bilal Ahmed",
    email: "bilal.ahmed@example.com",
    phone: "03226667788",
    city: "Peshawar",
    created_at: "2026-04-01T12:00:00.000Z",
  },
];

const SEED_ORDERS = [
  {
    id: 1001,
    customer_name: "Ali Khan",
    customer_phone: "03001234567",
    customer_email: "ali.khan@example.com",
    city: "Lahore",
    address: "45 Garden Town, Lahore",
    total_price: 142000,
    products: [
      { name: "Monocrystalline Solar Panel 550W", quantity: 4, price: 28500 },
      { name: "Roof Mounting Rail Kit", quantity: 1, price: 18500 },
    ],
    payment_status: "paid",
    order_status: "delivered",
    created_at: "2026-01-12T10:00:00.000Z",
    notes: "",
  },
  {
    id: 1002,
    customer_name: "Sara Malik",
    customer_phone: "03219876543",
    customer_email: "sara.malik@example.com",
    city: "Karachi",
    address: "Block 5 Clifton, Karachi",
    total_price: 112000,
    products: [{ name: "Hybrid Solar Inverter 5kW", quantity: 1, price: 112000 }],
    payment_status: "paid",
    order_status: "shipped",
    created_at: "2026-01-28T15:30:00.000Z",
    notes: "Call before delivery",
  },
  {
    id: 1003,
    customer_name: "Hassan Raza",
    customer_phone: "03335551234",
    customer_email: "h.raza@example.com",
    city: "Islamabad",
    address: "F-7 Markaz, Islamabad",
    total_price: 198000,
    products: [{ name: "Lithium Battery 48V 100Ah", quantity: 1, price: 198000 }],
    payment_status: "pending",
    order_status: "processing",
    created_at: "2026-02-03T09:00:00.000Z",
    notes: "",
  },
  {
    id: 1004,
    customer_name: "Fatima Noor",
    customer_phone: "03451237890",
    customer_email: "fatima.noor@example.com",
    city: "Faisalabad",
    address: "Susan Road, Faisalabad",
    total_price: 57200,
    products: [{ name: "Polycrystalline Panel 450W", quantity: 2, price: 22900 }],
    payment_status: "paid",
    order_status: "delivered",
    created_at: "2026-02-14T11:00:00.000Z",
    notes: "",
  },
  {
    id: 1005,
    customer_name: "Omar Siddiqui",
    customer_phone: "03114445566",
    customer_email: "omar.s@example.com",
    city: "Multan",
    address: "Cantt Multan",
    total_price: 24800,
    products: [{ name: "DC Combiner Box & Surge Protection", quantity: 2, price: 12400 }],
    payment_status: "paid",
    order_status: "pending",
    created_at: "2026-02-22T13:20:00.000Z",
    notes: "",
  },
  {
    id: 1006,
    customer_name: "Ayesha Tariq",
    customer_phone: "03007778899",
    customer_email: "ayesha.t@example.com",
    city: "Rawalpindi",
    address: "Satellite Town, Rawalpindi",
    total_price: 356500,
    products: [
      { name: "Hybrid Solar Inverter 5kW", quantity: 1, price: 112000 },
      { name: "Lithium Battery 48V 100Ah", quantity: 1, price: 198000 },
      { name: "Monocrystalline Solar Panel 550W", quantity: 2, price: 28500 },
    ],
    payment_status: "pending",
    order_status: "processing",
    created_at: "2026-03-08T08:45:00.000Z",
    notes: "Site survey requested",
  },
  {
    id: 1007,
    customer_name: "Bilal Ahmed",
    customer_phone: "03226667788",
    customer_email: "bilal.ahmed@example.com",
    city: "Peshawar",
    address: "University Town, Peshawar",
    total_price: 85500,
    products: [
      { name: "Monocrystalline Solar Panel 550W", quantity: 3, price: 28500 },
    ],
    payment_status: "paid",
    order_status: "delivered",
    created_at: "2026-03-25T16:00:00.000Z",
    notes: "",
  },
  {
    id: 1008,
    customer_name: "Nadia Iqbal",
    customer_phone: "03009990011",
    customer_email: "nadia.iqbal@example.com",
    city: "Lahore",
    address: "DHA Phase 6, Lahore",
    total_price: 34500,
    products: [
      { name: "MPPT Solar Charge Controller 60A", quantity: 1, price: 34500 },
    ],
    payment_status: "paid",
    order_status: "cancelled",
    created_at: "2026-04-02T12:10:00.000Z",
    notes: "Customer cancelled — stock returned",
  },
];

const SEED_CONSULTATIONS = [
  {
    id: 1,
    name: "Kamran Sheikh",
    phone: "03001112233",
    city: "Lahore",
    monthly_bill: "45000",
    message: "Need 10kW system for home rooftop.",
    status: "new",
    created_at: "2026-04-08T09:00:00.000Z",
  },
  {
    id: 2,
    name: "Zainab Hussain",
    phone: "03214445566",
    city: "Karachi",
    monthly_bill: "62000",
    message: "Commercial warehouse, daytime load heavy.",
    status: "contacted",
    created_at: "2026-04-07T14:30:00.000Z",
  },
  {
    id: 3,
    name: "Usman Farooq",
    phone: "03337778899",
    city: "Islamabad",
    monthly_bill: "28000",
    message: "Interested in hybrid with battery backup.",
    status: "converted",
    created_at: "2026-04-05T11:00:00.000Z",
  },
  {
    id: 4,
    name: "Hina Kashif",
    phone: "03456667788",
    city: "Sialkot",
    monthly_bill: "19500",
    message: "Small 3kW quote for factory office.",
    status: "new",
    created_at: "2026-04-04T10:15:00.000Z",
  },
  {
    id: 5,
    name: "Rehan Malik",
    phone: "03119990000",
    city: "Multan",
    monthly_bill: "51000",
    message: "Farm tube wells — need solar pumping option.",
    status: "closed",
    created_at: "2026-03-28T08:00:00.000Z",
  },
  {
    id: 6,
    name: "Sana Amin",
    phone: "03005556677",
    city: "Rawalpindi",
    monthly_bill: "33000",
    message: "Net metering paperwork help.",
    status: "contacted",
    created_at: "2026-03-22T15:45:00.000Z",
  },
  {
    id: 7,
    name: "Tariq Mehmood",
    phone: "03228889900",
    city: "Faisalabad",
    monthly_bill: "88000",
    message: "Textile unit — large roof area available.",
    status: "new",
    created_at: "2026-04-01T13:20:00.000Z",
  },
  {
    id: 8,
    name: "Mariam Lodhi",
    phone: "03331112244",
    city: "Lahore",
    monthly_bill: "22000",
    message: "Budget-friendly starter kit for 5 marla house.",
    status: "converted",
    created_at: "2026-03-15T09:30:00.000Z",
  },
];

type StoreState = {
  products: any[];
  orders: any[];
  customers: any[];
  consultations: any[];
};

const state: StoreState = {
  products: buildSeedProducts(),
  orders: clone(SEED_ORDERS),
  customers: clone(SEED_CUSTOMERS),
  consultations: clone(SEED_CONSULTATIONS),
};

function nextId(items: { id: number }[]): number {
  return items.length ? Math.max(...items.map((x) => x.id)) + 1 : 1;
}

function computeAnalytics() {
  const orders = state.orders;
  const year = new Date().getFullYear();
  const totalSales = orders.reduce((s: number, o: any) => s + (Number(o.total_price) || 0), 0);
  const monthlySales = Array.from({ length: 12 }, (_, i) =>
    orders
      .filter((o: any) => {
        const d = new Date(o.created_at);
        return d.getMonth() === i && d.getFullYear() === year;
      })
      .reduce((s: number, o: any) => s + (Number(o.total_price) || 0), 0),
  );
  const orderGrowth = Array.from({ length: 12 }, (_, i) =>
    orders.filter((o: any) => {
      const d = new Date(o.created_at);
      return d.getMonth() === i && d.getFullYear() === year;
    }).length,
  );
  return {
    totalSales,
    totalOrders: orders.length,
    totalCustomers: state.customers.length,
    totalProducts: state.products.length,
    monthlySales,
    orderGrowth,
  };
}

export const localStore = {
  getProducts: () => clone(state.products),

  createProduct: (payload: any) => {
    const id = nextId(state.products);
    state.products.push({
      ...payload,
      id,
      status: payload.status ?? "active",
    });
    return true;
  },

  updateProduct: (id: number, payload: any) => {
    const i = state.products.findIndex((p) => p.id === id);
    if (i === -1) return false;
    state.products[i] = { ...state.products[i], ...payload, id };
    return true;
  },

  deleteProduct: (id: number) => {
    const before = state.products.length;
    state.products = state.products.filter((p) => p.id !== id);
    return state.products.length < before;
  },

  getOrders: () => clone(state.orders).sort((a, b) => b.id - a.id),

  updateOrderStatus: (id: number, order_status: string) => {
    const o = state.orders.find((x) => x.id === id);
    if (!o) return false;
    o.order_status = order_status;
    return true;
  },

  createOrder: (payload: any) => {
    const id = nextId(state.orders);
    const order = {
      id,
      customer_name: payload.name,
      customer_email: payload.email,
      customer_phone: payload.phone,
      city: payload.city,
      address: payload.address,
      notes: payload.notes ?? "",
      payment_method: payload.payment_method ?? "cod",
      total_price: Number(payload.total_price) || 0,
      products: Array.isArray(payload.products) ? clone(payload.products) : [],
      payment_status: "pending",
      order_status: "pending",
      created_at: new Date().toISOString(),
    };
    state.orders.unshift(order);
    return true;
  },

  getCustomers: () => clone(state.customers).sort((a, b) => b.id - a.id),

  getCustomerByEmail: (email: string) => {
    const e = email.trim().toLowerCase();
    const c = state.customers.find((x) => String(x.email || "").toLowerCase() === e);
    return c ? clone(c) : null;
  },

  getOrdersByCustomerEmail: (email: string) => {
    const e = email.trim().toLowerCase();
    return clone(state.orders)
      .filter((o: any) => String(o.customer_email || "").toLowerCase() === e)
      .sort((a: any, b: any) => b.id - a.id);
  },

  getConsultations: () =>
    clone(state.consultations).sort((a, b) => b.id - a.id),

  updateConsultationStatus: (id: number, status: string) => {
    const c = state.consultations.find((x) => x.id === id);
    if (!c) return false;
    c.status = status;
    return true;
  },

  createConsultation: (payload: any) => {
    const id = nextId(state.consultations);
    state.consultations.unshift({
      id,
      name: payload.name,
      phone: payload.phone,
      city: payload.city,
      monthly_bill: payload.monthly_bill ?? "",
      message: payload.message ?? "",
      status: "new",
      created_at: new Date().toISOString(),
    });
    return true;
  },

  getAnalytics: () => computeAnalytics(),
};
