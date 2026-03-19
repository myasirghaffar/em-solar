import supabase from './_supabase.js';
import { applyCors } from './_cors.js';

export default async function handler(req, res) {
  applyCors(req, res, {
    methods: 'GET, POST, PUT, DELETE, OPTIONS',
    headers: 'Content-Type, Authorization'
  });
  if (req.method === 'OPTIONS') return res.status(204).end();

  try {
    if (req.method === 'GET') {
      const { category, search, minPrice, maxPrice } = req.query;
      let query = supabase.from('products').select('*').order('id', { ascending: true });
      
      if (category) query = query.eq('category', category);
      if (search) query = query.ilike('name', `%${search}%`);
      if (minPrice) query = query.gte('price', parseFloat(minPrice));
      if (maxPrice) query = query.lte('price', parseFloat(maxPrice));
      
      const { data, error } = await query;
      if (error) throw error;
      // Parse JSON strings if they're stored as strings
      const parsedData = data.map(product => ({
        ...product,
        images: typeof product.images === 'string' ? JSON.parse(product.images) : product.images,
        specifications: typeof product.specifications === 'string' ? JSON.parse(product.specifications) : product.specifications
      }));
      return res.status(200).json(parsedData);
    }
    
    if (req.method === 'POST') {
      const { name, category, price, stock, description, specifications, images, brand } = req.body;
      const { data, error } = await supabase
        .from('products')
        .insert({ name, category, price, stock, description, specifications, images, brand, status: 'active' })
        .select()
        .single();
      if (error) throw error;
      return res.status(201).json(data);
    }
    
    if (req.method === 'PUT') {
      const { id, ...updates } = req.body;
      const { data, error } = await supabase
        .from('products')
        .update(updates)
        .eq('id', id)
        .select()
        .single();
      if (error) throw error;
      return res.status(200).json(data);
    }
    
    if (req.method === 'DELETE') {
      const { id } = req.body;
      const { error } = await supabase.from('products').delete().eq('id', id);
      if (error) throw error;
      return res.status(200).json({ ok: true });
    }
    
    res.status(405).json({ error: 'Method not allowed' });
  } catch (err) {
    console.error('API error:', err);
    res.status(500).json({ error: err.message });
  }
}