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
    {
      id: 9909,
      name: "Solar PV Extension Cable 4mm² (30m roll)",
      price: 8900,
      description: "UV-resistant twin-core DC cable for string runs and combiner wiring.",
      images: [
        "https://images.unsplash.com/photo-1621905252507-b35492cc74b4?w=800&q=80",
      ],
      category: "Accessories",
      status: "active",
      stock: 55,
      brand: "Mean Well",
      specifications: { Gauge: "4mm²", Length: "30m" },
      longDescription:
        "Tinned copper conductors with XLPO jacket for outdoor lifetime. Suitable for 1000V DC string circuits. Cut to length on site or deploy full rolls for warehouse runs.",
      attachments: [{ title: "Cable spec sheet (PDF)", href: "#" }],
    },
    {
      id: 9910,
      name: "MC4-Compatible Branch Connector Pair",
      price: 1850,
      description: "Y-branch harness for parallel strings; IP67 when mated.",
      images: [
        "https://images.unsplash.com/photo-1592838064575-70b94206782a?w=800&q=80",
      ],
      category: "Accessories",
      status: "active",
      stock: 120,
      brand: "SolarMax",
      specifications: { Rating: "30A", IP: "IP67" },
      longDescription:
        "Install between panel strings and combiner inputs. Locking collars match standard MC4 tooling. EnergyMart.pk stocks genuine-spec connectors for warranty-safe arrays.",
      attachments: [{ title: "Installation torque guide (PDF)", href: "#" }],
    },
    {
      id: 9911,
      name: "Bifacial Monocrystalline Module 600W",
      price: 35200,
      description: "Dual-glass bifacial frame for higher yield on reflective rooftops.",
      images: [
        "https://images.unsplash.com/photo-1509391366360-2e959784a276?w=800&q=80",
      ],
      category: "Solar Panels",
      status: "active",
      stock: 16,
      brand: "JA Solar",
      specifications: { Power: "600W", Type: "Bifacial mono" },
      longDescription:
        "Higher rear-side gain on light-colored roofs and trackers. Pair with compatible string inverters and DC optimizers where required by your net-metering rules.",
      attachments: [
        { title: "Flash test report (PDF)", href: "#" },
        { title: "Warranty terms (PDF)", href: "#" },
      ],
    },
    {
      id: 9912,
      name: "Off-Grid Pure Sine Inverter 3kW 24V",
      price: 78500,
      description: "Standalone inverter with built-in charger for cabin and backup loads.",
      images: [
        "https://images.unsplash.com/photo-1613665813446-82a78c468a1d?w=800&q=80",
      ],
      category: "Solar Inverters",
      status: "active",
      stock: 9,
      brand: "Growatt",
      specifications: { Power: "3kW", DC: "24V" },
      longDescription:
        "Ideal for small off-grid homes and UPS-style backup. Supports generator assist input. Our team can size battery banks and surge loads for reliable autonomy.",
      attachments: [{ title: "Quick start guide (PDF)", href: "#" }],
    },
    {
      id: 9913,
      name: "Deep-Cycle AGM Battery 12V 200Ah",
      price: 62500,
      description: "Sealed AGM bank for 12/24/48V systems where LiFePO₄ is not required.",
      images: [
        "https://images.unsplash.com/photo-1620714223084-8fcacc6dfd8d?w=800&q=80",
      ],
      category: "Batteries",
      status: "active",
      stock: 14,
      brand: "Pylontech",
      specifications: { Voltage: "12V", Capacity: "200Ah" },
      longDescription:
        "Maintenance-free VRLA-AGM for ventilated battery rooms. Match with charge controllers sized for C/5–C/10 charge rates. Parallel for 24V or 48V banks with equal-length cabling.",
      attachments: [{ title: "Safety & venting guide (PDF)", href: "#" }],
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

const MONTH_SHORT = [
  "Jan",
  "Feb",
  "Mar",
  "Apr",
  "May",
  "Jun",
  "Jul",
  "Aug",
  "Sep",
  "Oct",
  "Nov",
  "Dec",
];

function startOfWeekMonday(d: Date): Date {
  const x = new Date(d);
  x.setHours(0, 0, 0, 0);
  const day = x.getDay();
  const diff = day === 0 ? -6 : 1 - day;
  x.setDate(x.getDate() + diff);
  return x;
}

function endOfWeekFromMondayStart(ws: Date): Date {
  const x = new Date(ws);
  x.setDate(x.getDate() + 6);
  x.setHours(23, 59, 59, 999);
  return x;
}

function computeWeeklyChart(orders: any[], weeksCount = 12) {
  const anchor = startOfWeekMonday(new Date());
  const rows: { label: string; sales: number; orders: number }[] = [];
  for (let i = weeksCount - 1; i >= 0; i--) {
    const ws = new Date(anchor);
    ws.setDate(ws.getDate() - i * 7);
    const we = endOfWeekFromMondayStart(ws);
    const t0 = ws.getTime();
    const t1 = we.getTime();
    let sales = 0;
    let orderCount = 0;
    for (const o of orders) {
      const t = new Date(o.created_at).getTime();
      if (t >= t0 && t <= t1) {
        sales += Number(o.total_price) || 0;
        orderCount += 1;
      }
    }
    const m0 = MONTH_SHORT[ws.getMonth()] ?? "";
    const m1 = MONTH_SHORT[we.getMonth()] ?? "";
    const sameMonth = ws.getMonth() === we.getMonth();
    const label = sameMonth
      ? `${m0} ${ws.getDate()}–${we.getDate()}`
      : `${m0} ${ws.getDate()} – ${m1} ${we.getDate()}`;
    rows.push({ label, sales, orders: orderCount });
  }
  return rows;
}

function computeYearlyChart(orders: any[], span = 6) {
  const currentYear = new Date().getFullYear();
  const from = currentYear - (span - 1);
  const rows: { label: string; sales: number; orders: number }[] = [];
  for (let y = from; y <= currentYear; y++) {
    let sales = 0;
    let orderCount = 0;
    for (const o of orders) {
      if (new Date(o.created_at).getFullYear() === y) {
        sales += Number(o.total_price) || 0;
        orderCount += 1;
      }
    }
    rows.push({ label: String(y), sales, orders: orderCount });
  }
  return rows;
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
  const monthlyChart = MONTH_SHORT.map((label, i) => ({
    label,
    sales: monthlySales[i] ?? 0,
    orders: orderGrowth[i] ?? 0,
  }));
  return {
    totalSales,
    totalOrders: orders.length,
    totalCustomers: state.customers.length,
    totalProducts: state.products.length,
    monthlySales,
    orderGrowth,
    chartSeries: {
      weekly: computeWeeklyChart(orders, 12),
      monthly: monthlyChart,
      yearly: computeYearlyChart(orders, 6),
    },
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
