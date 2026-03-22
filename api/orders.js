import supabase from './_supabase.js';
import { applyCors } from './_cors.js';

export default async function handler(req, res) {
  applyCors(req, res, {
    methods: 'GET, POST, PUT, DELETE, OPTIONS',
    headers: 'Content-Type, Authorization'
  });
  if (req.method === 'OPTIONS') return res.status(204).end();

  if (!supabase) {
    return res.status(503).json({ error: 'Supabase not configured. Add NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY in Vercel Environment Variables.' });
  }

  try {
    if (req.method === 'GET') {
      const { data, error } = await supabase
        .from('orders')
        .select('*')
        .order('created_at', { ascending: false });
      if (error) throw error;
      return res.status(200).json(data);
    }
    
    if (req.method === 'POST') {
      const { customer_name, customer_email, customer_phone, city, address, notes, payment_method, products, total_price } = req.body;
      const { data, error } = await supabase
        .from('orders')
        .insert({
          customer_name,
          customer_email,
          customer_phone,
          city,
          address,
          notes,
          payment_method,
          products,
          total_price,
          payment_status: 'pending',
          order_status: 'pending'
        })
        .select()
        .single();
      if (error) throw error;
      return res.status(201).json(data);
    }
    
    if (req.method === 'PUT') {
      const { id, ...updates } = req.body;
      const { data, error } = await supabase
        .from('orders')
        .update(updates)
        .eq('id', id)
        .select()
        .single();
      if (error) throw error;
      return res.status(200).json(data);
    }
    
    res.status(405).json({ error: 'Method not allowed' });
  } catch (err) {
    console.error('API error:', err);
    res.status(500).json({ error: err.message });
  }
}