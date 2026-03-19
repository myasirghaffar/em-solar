import supabase from '../_supabase.js';
import { applyCors } from '../_cors.js';

export default async function handler(req, res) {
  applyCors(req, res, {
    methods: 'POST, OPTIONS',
    headers: 'Content-Type, Authorization'
  });
  if (req.method === 'OPTIONS') return res.status(204).end();

  try {
    if (req.method === 'POST') {
      const { email, password } = req.body;
      if (!email || !password) {
        return res.status(400).json({ error: 'Email and password required' });
      }

      const { data, error } = await supabase.rpc('auth_login', {
        user_email: email,
        user_password: password
      });

      if (error) {
        console.error('Login error:', error);
        return res.status(401).json({ error: 'Invalid email or password' });
      }

      if (!data || data.length === 0) {
        return res.status(401).json({ error: 'Invalid email or password' });
      }

      const user = data[0];
      return res.status(200).json({
        success: true,
        user: { id: user.id, email: user.email }
      });
    }

    res.status(405).json({ error: 'Method not allowed' });
  } catch (err) {
    console.error('Login API error:', err);
    res.status(500).json({ error: err.message });
  }
}
