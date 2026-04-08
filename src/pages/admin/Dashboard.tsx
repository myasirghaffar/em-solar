import { useEffect, useState } from 'react';
import { DollarSign, ShoppingCart, Users, Package, TrendingUp } from 'lucide-react';
import {
  AreaChart,
  Area,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer
} from 'recharts';
import { AdminPageHeader, AdminPanel, AdminTableShell, StatusPill } from '../../components/admin/AdminUI';

const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

export default function AdminDashboard() {
  const [analytics, setAnalytics] = useState<any>(null);
  const [recentOrders, setRecentOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAnalytics();
    fetchRecentOrders();
  }, []);

  const fetchAnalytics = async () => {
    try {
      const { fetchAnalytics: apiFetchAnalytics } = await import('../../lib/api');
      const data = await apiFetchAnalytics();
      setAnalytics(data);
    } catch (err) {
      console.error('Fetch error:', err);
    } finally {
      setLoading(false);
    }
  };

  const fetchRecentOrders = async () => {
    try {
      const { fetchOrders } = await import('../../lib/api');
      const data = await fetchOrders();
      setRecentOrders(data.slice(0, 5));
    } catch (err) {
      console.error('Fetch error:', err);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#FF7A00]" />
      </div>
    );
  }

  const salesData = analytics?.monthlySales?.map((value: number, index: number) => ({
    month: months[index],
    sales: value
  })) || [];

  const ordersData = analytics?.orderGrowth?.map((value: number, index: number) => ({
    month: months[index],
    orders: value
  })) || [];

  return (
    <div className="space-y-6 min-w-0 w-full max-w-full">
      <AdminPageHeader
        title="Dashboard Overview"
        subtitle="Welcome back! Here's what's happening with your store."
      />

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 min-w-0">
        <StatCard
          title="Total Sales"
          value={`Rs. ${(analytics?.totalSales || 0).toLocaleString()}`}
          icon={DollarSign}
          trend="+12.5%"
          trendUp={true}
        />
        <StatCard
          title="Total Orders"
          value={analytics?.totalOrders || 0}
          icon={ShoppingCart}
          trend="+8.2%"
          trendUp={true}
        />
        <StatCard
          title="Total Customers"
          value={analytics?.totalCustomers || 0}
          icon={Users}
          trend="+5.1%"
          trendUp={true}
        />
        <StatCard
          title="Total Products"
          value={analytics?.totalProducts || 0}
          icon={Package}
          trend="+2.3%"
          trendUp={true}
        />
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 min-w-0">
        <AdminPanel>
          <h2 className="text-base font-bold text-slate-900 mb-4">Monthly Sales</h2>
          <ResponsiveContainer width="100%" height={300}>
            <AreaChart data={salesData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis dataKey="month" stroke="#666" />
              <YAxis stroke="#666" />
              <Tooltip
                contentStyle={{
                  backgroundColor: '#111827',
                  border: 'none',
                  borderRadius: '8px'
                }}
                itemStyle={{ color: '#fff' }}
              />
              <Area type="monotone" dataKey="sales" stroke="#6366f1" fill="#6366f1" fillOpacity={0.3} />
            </AreaChart>
          </ResponsiveContainer>
        </AdminPanel>
        <AdminPanel>
          <h2 className="text-base font-bold text-slate-900 mb-4">Orders Growth</h2>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={ordersData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis dataKey="month" stroke="#666" />
              <YAxis stroke="#666" />
              <Tooltip
                contentStyle={{
                  backgroundColor: '#111827',
                  border: 'none',
                  borderRadius: '8px'
                }}
                itemStyle={{ color: '#fff' }}
              />
              <Bar dataKey="orders" fill="#6366f1" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </AdminPanel>
      </div>

      {/* Recent Orders */}
      <AdminTableShell>
        <div className="p-4 sm:p-6 border-b border-gray-200">
          <h2 className="text-base font-bold text-slate-900">Recent Orders</h2>
        </div>
        <div className="overflow-x-auto overflow-y-visible touch-pan-x min-w-0 admin-table-scroll">
          <table className="w-full min-w-full">
            <thead className="bg-gray-50/80">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider whitespace-nowrap">Order ID</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider whitespace-nowrap">Customer</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider whitespace-nowrap">Total</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider whitespace-nowrap">Status</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider whitespace-nowrap">Date</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {recentOrders.map(order => (
                <tr key={order.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-slate-900">#{order.id}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">{order.customer_name}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-semibold text-indigo-600">
                    Rs. {order.total_price?.toLocaleString() || 0}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <StatusPill
                      label={order.order_status || 'pending'}
                      variant={
                        order.order_status === 'delivered'
                          ? 'success'
                          : order.order_status === 'shipped'
                          ? 'info'
                          : order.order_status === 'processing'
                          ? 'warning'
                          : 'default'
                      }
                    />
                  </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {order.created_at ? new Date(order.created_at).toLocaleDateString() : '-'}
                  </td>
                </tr>
              ))}
              {recentOrders.length === 0 && (
                <tr>
                  <td colSpan={5} className="px-6 py-12 text-center text-gray-500">No orders yet</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </AdminTableShell>
    </div>
  );
}

function StatCard({ title, value, icon: Icon, trend, trendUp }: any) {
  return (
    <div className="min-w-0 overflow-hidden bg-white rounded-2xl border border-gray-200/60 p-[17px]">
      <div className="flex items-center justify-between mb-4">
        <div className="w-10 h-10 rounded-[10px] bg-indigo-500/10 flex items-center justify-center">
          <Icon className="w-5 h-5 text-indigo-500" />
        </div>
        <div className={`flex items-center space-x-1 text-xs ${
          trendUp ? 'text-green-600' : 'text-red-600'
        }`}>
          <TrendingUp className={`w-4 h-4 ${!trendUp && 'rotate-180'}`} />
          <span className="font-medium">{trend}</span>
        </div>
      </div>
      <p className="text-2xl font-bold text-slate-900">{value}</p>
      <h3 className="text-gray-500 text-sm font-medium mt-2">{title}</h3>
    </div>
  );
}