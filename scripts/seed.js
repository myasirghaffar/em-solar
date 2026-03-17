/**
 * Seed script - populates Supabase with dummy data.
 * Run: node scripts/seed.js
 * Requires: .env.local with NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY
 */
import { createClient } from '@supabase/supabase-js';
import { readFileSync } from 'fs';
import { resolve, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));

function loadEnv() {
  try {
    const envPath = resolve(__dirname, '../.env.local');
    const env = readFileSync(envPath, 'utf8');
    const vars = {};
    env.split('\n').forEach(line => {
      const m = line.match(/^([^#=]+)=(.*)$/);
      if (m) vars[m[1].trim()] = m[2].trim().replace(/^["']|["']$/g, '');
    });
    return vars;
  } catch {
    console.error('Create .env.local with NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY');
    process.exit(1);
  }
}

const { NEXT_PUBLIC_SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY } = loadEnv();
if (!NEXT_PUBLIC_SUPABASE_URL || !SUPABASE_SERVICE_ROLE_KEY) {
  console.error('Missing env vars');
  process.exit(1);
}

const supabase = createClient(NEXT_PUBLIC_SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);

const categories = [
  { name: 'Solar Panels', slug: 'solar-panels', icon: 'PanelTop' },
  { name: 'Solar Inverters', slug: 'solar-inverters', icon: 'Plug' },
  { name: 'Batteries', slug: 'batteries', icon: 'Battery' },
  { name: 'Accessories', slug: 'accessories', icon: 'Zap' }
];

const products = [
  { name: 'Longi 550W Mono Half-Cut Solar Panel', category: 'Solar Panels', price: 28000, stock: 50, description: 'High-efficiency monocrystalline solar panel with 22% efficiency.' },
  { name: 'Jinko 540W Tiger Neo Solar Panel', category: 'Solar Panels', price: 26500, stock: 45, description: 'Advanced N-type TOPCon technology solar panel.' },
  { name: 'Trina Vertex S+ 545W Solar Panel', category: 'Solar Panels', price: 27500, stock: 60, description: 'Premium multi-busbar solar panel with high durability.' },
  { name: 'Canadian 530W HiKu Solar Panel', category: 'Solar Panels', price: 25500, stock: 55, description: 'Reliable half-cut cell solar panel with 25-year warranty.' },
  { name: 'Huawei 10kW Three-Phase Inverter', category: 'Solar Inverters', price: 185000, stock: 20, description: 'Smart three-phase hybrid inverter with battery support.' },
  { name: 'Growatt 5kW Hybrid Inverter', category: 'Solar Inverters', price: 95000, stock: 35, description: 'Cost-effective hybrid inverter with solar and grid.' },
  { name: 'Inverex 3kW Nitrox Inverter', category: 'Solar Inverters', price: 55000, stock: 40, description: 'Popular pure sine wave inverter for residential use.' },
  { name: 'Tesla Powerwall 2 Battery', category: 'Batteries', price: 850000, stock: 10, description: 'Premium home battery with 13.5kWh capacity.' },
  { name: 'Pylontech US3000C Battery', category: 'Batteries', price: 145000, stock: 25, description: 'High-quality lithium battery module for solar storage.' },
  { name: 'Phoenix 200Ah Tubular Battery', category: 'Batteries', price: 45000, stock: 50, description: 'Deep cycle tubular battery for off-grid systems.' },
  { name: 'Solar Mounting Structure - Roof Mount', category: 'Accessories', price: 8500, stock: 100, description: 'Galvanized steel mounting structure for rooftop installation.' },
  { name: 'Solar DC Cable 4mm - 100 Meter', category: 'Accessories', price: 12000, stock: 80, description: 'High-quality DC solar cable for connecting panels.' }
];

const customers = [
  { name: 'Ahmed Khan', email: 'ahmed@email.com', phone: '03001234567', city: 'Lahore', address: '123 Gulberg III, Lahore' },
  { name: 'Sara Ali', email: 'sara@email.com', phone: '03217654321', city: 'Karachi', address: '456 Clifton Block 9, Karachi' },
  { name: 'Muhammad Hassan', email: 'hassan@email.com', phone: '03445678901', city: 'Islamabad', address: '789 F-7 Markaz, Islamabad' },
  { name: 'Fatima Zahra', email: 'fatima@email.com', phone: '03339876543', city: 'Faisalabad', address: '321 Peoples Colony, Faisalabad' },
  { name: 'Ali Raza', email: 'ali@email.com', phone: '03005432109', city: 'Multan', address: '654 Bosan Road, Multan' }
];

const consultations = [
  { name: 'Bilal Ahmed', phone: '03009876543', city: 'Rawalpindi', monthly_bill: '25000', message: 'I have a 10 marla house and want to install solar.', status: 'new' },
  { name: 'Ayesha Khan', phone: '03213456789', city: 'Lahore', monthly_bill: '15000', message: 'Looking for a 3kW system for my home.', status: 'contacted' },
  { name: 'Usman Malik', phone: '03452345678', city: 'Karachi', monthly_bill: '50000', message: 'Need commercial solar system for my factory.', status: 'new' },
  { name: 'Zainab Bibi', phone: '03123456789', city: 'Multan', monthly_bill: '12000', message: 'Interested in solar panels only, already have inverter.', status: 'converted' },
  { name: 'Rashid Mahmood', phone: '03006789012', city: 'Faisalabad', monthly_bill: '30000', message: 'Need consultation for 5kW system with battery backup.', status: 'new' }
];

const orders = [
  { customer_name: 'Ahmed Khan', customer_email: 'ahmed@email.com', customer_phone: '03001234567', city: 'Lahore', address: '123 Gulberg III, Lahore', notes: 'Please call before delivery', total_price: 185000, payment_status: 'pending', order_status: 'pending' },
  { customer_name: 'Sara Ali', customer_email: 'sara@email.com', customer_phone: '03217654321', city: 'Karachi', address: '456 Clifton Block 9, Karachi', notes: null, total_price: 95000, payment_status: 'pending', order_status: 'pending' },
  { customer_name: 'Muhammad Hassan', customer_email: 'hassan@email.com', customer_phone: '03445678901', city: 'Islamabad', address: '789 F-7 Markaz, Islamabad', notes: 'Install at ground floor', total_price: 27500, payment_status: 'pending', order_status: 'pending' }
];

async function seed() {
  console.log('Seeding database...');
  try {
    const { error: e1 } = await supabase.from('categories').insert(categories);
    if (e1) console.log('  Categories:', e1.message, '(may already exist)');
    else console.log('  ✓ Categories');

    const { error: e2 } = await supabase.from('products').insert(products);
    if (e2) console.log('  Products:', e2.message);
    else console.log('  ✓ Products');

    const { error: e3 } = await supabase.from('customers').insert(customers);
    if (e3) console.log('  Customers:', e3.message);
    else console.log('  ✓ Customers');

    const { error: e4 } = await supabase.from('consultations').insert(consultations);
    if (e4) console.log('  Consultations:', e4.message);
    else console.log('  ✓ Consultations');

    const { error: e5 } = await supabase.from('orders').insert(orders);
    if (e5) console.log('  Orders:', e5.message);
    else console.log('  ✓ Orders');

    console.log('Done! Data should display on frontend and dashboard.');
  } catch (err) {
    console.error('Seed failed:', err);
    process.exit(1);
  }
}

seed();
