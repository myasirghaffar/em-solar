import supabase from './_supabase.js';
import { applyCors } from './_cors.js';

export default async function handler(req, res) {
  applyCors(req, res, {
    methods: 'GET, POST, PUT, OPTIONS',
    headers: 'Content-Type, Authorization'
  });
  if (req.method === 'OPTIONS') return res.status(204).end();

  try {
    if (req.method === 'GET') {
      const { data, error } = await supabase
        .from('consultations')
        .select('*')
        .order('created_at', { ascending: false });
      if (error) throw error;
      return res.status(200).json(data);
    }
    
    if (req.method === 'POST') {
      const { name, phone, city, monthly_bill, message } = req.body;
      const { data, error } = await supabase
        .from('consultations')
        .insert({ name, phone, city, monthly_bill, message, status: 'new' })
        .select()
        .single();
      if (error) throw error;
      return res.status(201).json(data);
    }
    
    if (req.method === 'PUT') {
      const { id, status } = req.body;
      const { data, error } = await supabase
        .from('consultations')
        .update({ status })
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