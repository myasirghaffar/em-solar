import { useEffect, useMemo, useState } from 'react';
import { DollarSign, ShoppingCart, Users, Package, TrendingUp, AlertCircle } from 'lucide-react';
import { ApiError } from '../../lib/api';
import {
  AreaChart,
  Area,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';
import { AdminPageHeader, AdminPanel, AdminTablePagination, AdminTableShell, StatusPill } from '../../components/admin/AdminUI';
import { useAdminTablePagination } from '../../hooks/useAdminTablePagination';

type ChartPeriod = 'weekly' | 'monthly' | 'yearly';

const CHART_PERIOD_OPTIONS: { id: ChartPeriod; label: string; description: string }[] = [
  { id: 'weekly', label: 'Weekly', description: 'Last 12 weeks (Mon–Sun)' },
  { id: 'monthly', label: 'Monthly', description: 'Current calendar year by month' },
  { id: 'yearly', label: 'Yearly', description: 'Last 6 calendar years' },
];

function normalizeAnalyticsPayload(raw: unknown): any | null {
  if (!raw || typeof raw !== 'object') return null;
  const r = raw as Record<string, unknown>;
  const cs = r.chartSeries as Record<string, unknown> | undefined;
  const series =
    cs && typeof cs === 'object' && !Array.isArray(cs)
      ? {
          weekly: Array.isArray(cs.weekly) ? cs.weekly : [],
          monthly: Array.isArray(cs.monthly) ? cs.monthly : [],
          yearly: Array.isArray(cs.yearly) ? cs.yearly : [],
        }
      : { weekly: [], monthly: [], yearly: [] };
  const monthlySales = Array.isArray(r.monthlySales)
    ? (r.monthlySales as unknown[]).map((n) => Number(n) || 0)
    : Array.from({ length: 12 }, () => 0);
  const orderGrowth = Array.isArray(r.orderGrowth)
    ? (r.orderGrowth as unknown[]).map((n) => Number(n) || 0)
    : Array.from({ length: 12 }, () => 0);
  return {
    totalSales: Number(r.totalSales) || 0,
    totalOrders: Number(r.totalOrders) || 0,
    totalCustomers: Number(r.totalCustomers) || 0,
    totalProducts: Number(r.totalProducts) || 0,
    monthlySales,
    orderGrowth,
    chartSeries: series,
  };
}

export default function AdminDashboard() {
  const [analytics, setAnalytics] = useState<any>(null);
  const [recentOrders, setRecentOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [analyticsError, setAnalyticsError] = useState<string | null>(null);
  const [chartPeriod, setChartPeriod] = useState<ChartPeriod>('monthly');

  useEffect(() => {
    void loadDashboard();
  }, []);

  const loadDashboard = async () => {
    setLoading(true);
    setAnalyticsError(null);
    try {
      const { fetchAdminBootstrap } = await import('../../lib/api');
      const boot = await fetchAdminBootstrap();
      setAnalytics(normalizeAnalyticsPayload(boot.analytics));
      setRecentOrders(Array.isArray(boot.orders) ? boot.orders : []);
    } catch (err) {
      console.error('Fetch error:', err);
      const msg =
        err instanceof ApiError
          ? err.message
          : err instanceof Error
            ? err.message
            : 'Could not load dashboard data.';
      setAnalyticsError(msg);
      setAnalytics(null);
      setRecentOrders([]);
    } finally {
      setLoading(false);
    }
  };

  const chartRows = useMemo(() => {
    const series = analytics?.chartSeries;
    if (series?.[chartPeriod]) return series[chartPeriod];
    if (chartPeriod === 'monthly' && analytics?.monthlySales) {
      const m = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
      return analytics.monthlySales.map((v: number, i: number) => ({
        label: m[i],
        sales: v,
        orders: analytics.orderGrowth?.[i] ?? 0,
      }));
    }
    return [];
  }, [analytics, chartPeriod]);

  const periodMeta = CHART_PERIOD_OPTIONS.find((o) => o.id === chartPeriod);

  const {
    page: ordersPage,
    setPage: setOrdersPage,
    pageItems: dashboardOrderRows,
    totalPages: ordersTotalPages,
    startItem: ordersStartItem,
    endItem: ordersEndItem,
    totalItems: ordersTotalItems,
  } = useAdminTablePagination(recentOrders);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#FF7A00]" />
      </div>
    );
  }

  return (
    <div className="space-y-6 min-w-0 w-full max-w-full">
      <AdminPageHeader
        title="Dashboard Overview"
        subtitle="Welcome back! Here's what's happening with your store."
      />

      {analyticsError ? (
        <div className="rounded-2xl border border-rose-200 bg-rose-50/90 px-4 py-3 text-sm text-rose-900 sm:flex sm:items-center sm:justify-between sm:gap-4">
          <div className="flex items-start gap-2">
            <AlertCircle className="mt-0.5 h-5 w-5 shrink-0 text-rose-600" aria-hidden />
            <span>{analyticsError}</span>
          </div>
          <button
            type="button"
            onClick={() => void loadDashboard()}
            className="mt-3 inline-flex h-9 shrink-0 items-center justify-center rounded-lg bg-[#0B2A4A] px-3 text-xs font-bold text-white hover:bg-[#0a2440] sm:mt-0"
          >
            Retry
          </button>
        </div>
      ) : null}

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
      <div className="space-y-3 min-w-0">
        <div className="flex flex-col gap-3 rounded-2xl border border-slate-200/80 bg-gradient-to-br from-white to-slate-50/80 px-4 py-3.5 shadow-sm sm:flex-row sm:items-center sm:justify-between sm:px-5">
          <div>
            <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">Analytics range</p>
            <p className="mt-0.5 text-sm text-slate-600">{periodMeta?.description}</p>
          </div>
          <ChartPeriodToggle value={chartPeriod} onChange={setChartPeriod} />
        </div>
        <div className="grid grid-cols-1 gap-5 min-w-0 lg:grid-cols-2 lg:gap-6">
          <AdminPanel className="overflow-hidden shadow-[0_12px_40px_-12px_rgba(15,23,42,0.12)] ring-1 ring-slate-200/60">
            <div className="mb-1 flex flex-col gap-1">
              <h2 className="text-lg font-bold tracking-tight text-slate-900">Sales performance</h2>
              <p className="text-sm text-slate-500">Revenue from completed orders in the selected period.</p>
            </div>
            <div className="mt-5 h-[300px] w-full min-w-0">
              <ResponsiveContainer width="100%" height="100%" minHeight={280}>
                <AreaChart data={chartRows} margin={{ top: 10, right: 6, left: 4, bottom: chartPeriod === 'weekly' ? 18 : 4 }}>
                  <defs>
                    <linearGradient id="dashSalesArea" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#FF7A00" stopOpacity={0.42} />
                      <stop offset="55%" stopColor="#FF9F4A" stopOpacity={0.12} />
                      <stop offset="100%" stopColor="#FF7A00" stopOpacity={0.02} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="4 8" stroke="#e2e8f0" vertical={false} />
                  <XAxis
                    dataKey="label"
                    tick={{ fill: '#64748b', fontSize: 11 }}
                    tickLine={false}
                    axisLine={{ stroke: '#e2e8f0' }}
                    interval={chartPeriod === 'weekly' ? 1 : 0}
                    {...(chartPeriod === 'weekly'
                      ? { angle: -32, textAnchor: 'end', height: 56 }
                      : {})}
                  />
                  <YAxis
                    tickFormatter={formatSalesAxis}
                    tick={{ fill: '#94a3b8', fontSize: 11 }}
                    tickLine={false}
                    axisLine={false}
                    width={44}
                  />
                  <Tooltip
                    cursor={{ stroke: '#cbd5e1', strokeWidth: 1, strokeDasharray: '4 4' }}
                    content={<SalesChartTooltip />}
                  />
                  <Area
                    type="monotone"
                    dataKey="sales"
                    stroke="#ea580c"
                    strokeWidth={2.5}
                    fill="url(#dashSalesArea)"
                    activeDot={{ r: 5, strokeWidth: 2, stroke: '#fff', fill: '#ea580c' }}
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </AdminPanel>
          <AdminPanel className="overflow-hidden shadow-[0_12px_40px_-12px_rgba(15,23,42,0.12)] ring-1 ring-slate-200/60">
            <div className="mb-1 flex flex-col gap-1">
              <h2 className="text-lg font-bold tracking-tight text-slate-900">Orders overview</h2>
              <p className="text-sm text-slate-500">Number of orders placed in the same period.</p>
            </div>
            <div className="mt-5 h-[300px] w-full min-w-0">
              <ResponsiveContainer width="100%" height="100%" minHeight={280}>
                <BarChart data={chartRows} margin={{ top: 10, right: 6, left: 4, bottom: chartPeriod === 'weekly' ? 18 : 4 }} barCategoryGap="18%">
                  <defs>
                    <linearGradient id="dashOrdersBar" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#FF9F4A" />
                      <stop offset="100%" stopColor="#E85D00" />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="4 8" stroke="#e2e8f0" vertical={false} />
                  <XAxis
                    dataKey="label"
                    tick={{ fill: '#64748b', fontSize: 11 }}
                    tickLine={false}
                    axisLine={{ stroke: '#e2e8f0' }}
                    interval={chartPeriod === 'weekly' ? 1 : 0}
                    {...(chartPeriod === 'weekly'
                      ? { angle: -32, textAnchor: 'end', height: 56 }
                      : {})}
                  />
                  <YAxis
                    allowDecimals={false}
                    tick={{ fill: '#94a3b8', fontSize: 11 }}
                    tickLine={false}
                    axisLine={false}
                    width={36}
                  />
                  <Tooltip
                    cursor={{ fill: 'rgba(255, 122, 0, 0.08)' }}
                    content={<OrdersChartTooltip />}
                  />
                  <Bar
                    dataKey="orders"
                    fill="url(#dashOrdersBar)"
                    radius={[8, 8, 0, 0]}
                    maxBarSize={44}
                    animationDuration={700}
                  />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </AdminPanel>
        </div>
      </div>

      {/* Recent Orders */}
      <AdminTableShell>
        <div className="p-4 sm:p-6 border-b border-gray-200">
          <h2 className="text-base font-bold text-slate-900">Orders</h2>
          <p className="mt-1 text-sm text-gray-500">Newest first · {ordersTotalItems} total</p>
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
              {dashboardOrderRows.map(order => (
                <tr key={order.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-slate-900">#{order.id}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">{order.customer_name}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-semibold text-[#FF7A00]">
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
        <AdminTablePagination
          enabled={recentOrders.length > 0}
          page={ordersPage}
          totalPages={ordersTotalPages}
          onPageChange={setOrdersPage}
          startItem={ordersStartItem}
          endItem={ordersEndItem}
          totalItems={ordersTotalItems}
        />
      </AdminTableShell>
    </div>
  );
}

function ChartPeriodToggle({
  value,
  onChange,
}: {
  value: ChartPeriod;
  onChange: (p: ChartPeriod) => void;
}) {
  return (
    <div
      className="inline-flex rounded-xl bg-slate-100/90 p-1 ring-1 ring-slate-200/70"
      role="group"
      aria-label="Chart time range"
    >
      {CHART_PERIOD_OPTIONS.map((opt) => (
        <button
          key={opt.id}
          type="button"
          onClick={() => onChange(opt.id)}
          className={`rounded-lg px-3.5 py-2 text-xs font-semibold transition-all sm:px-4 sm:text-sm ${
            value === opt.id
              ? 'bg-white text-[#0f172a] shadow-md shadow-slate-900/8 ring-1 ring-slate-200/90'
              : 'text-slate-500 hover:text-slate-800'
          }`}
        >
          {opt.label}
        </button>
      ))}
    </div>
  );
}

function formatSalesAxis(n: number) {
  if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(1)}M`;
  if (n >= 1000) return `${(n / 1000).toFixed(0)}k`;
  return n === 0 ? '0' : String(Math.round(n));
}

function SalesChartTooltip({ active, payload, label }: any) {
  if (!active || !payload?.length) return null;
  const v = Number(payload[0]?.value ?? 0);
  return (
    <div className="rounded-xl border border-slate-200/90 bg-white/95 px-3.5 py-2.5 shadow-xl shadow-slate-900/10 backdrop-blur-sm">
      <p className="text-[11px] font-semibold uppercase tracking-wide text-slate-400">{label}</p>
      <p className="mt-1 text-base font-bold tabular-nums text-slate-900">Rs. {v.toLocaleString()}</p>
    </div>
  );
}

function OrdersChartTooltip({ active, payload, label }: any) {
  if (!active || !payload?.length) return null;
  const v = Number(payload[0]?.value ?? 0);
  return (
    <div className="rounded-xl border border-slate-200/90 bg-white/95 px-3.5 py-2.5 shadow-xl shadow-slate-900/10 backdrop-blur-sm">
      <p className="text-[11px] font-semibold uppercase tracking-wide text-slate-400">{label}</p>
      <p className="mt-1 text-base font-bold tabular-nums text-slate-900">
        {v} order{v === 1 ? '' : 's'}
      </p>
    </div>
  );
}

function StatCard({ title, value, icon: Icon, trend, trendUp }: any) {
  return (
    <div className="min-w-0 overflow-hidden bg-white rounded-2xl border border-gray-200/60 p-[17px]">
      <div className="flex items-center justify-between mb-4">
        <div className="w-10 h-10 rounded-[10px] bg-[#FF7A00]/10 flex items-center justify-center">
          <Icon className="w-5 h-5 text-[#FF7A00]" />
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