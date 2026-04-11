import { useEffect, useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  User,
  Package,
  MapPin,
  ChevronRight,
  ChevronDown,
  Calendar,
  CreditCard,
  Truck,
} from "lucide-react";
import { useAuth } from "../../../context/AuthContext";
import { StatusPill } from "../../../components/admin/AdminUI";

type TabId = "account" | "orders" | "addresses";

const tabs: { id: TabId; label: string; icon: typeof User }[] = [
  { id: "account", label: "Account details", icon: User },
  { id: "orders", label: "Orders", icon: Package },
  { id: "addresses", label: "Addresses", icon: MapPin },
];

function statusVariant(
  status: string,
): "default" | "success" | "warning" | "danger" | "info" | "purple" {
  const s = (status || "").toLowerCase();
  if (s === "delivered") return "success";
  if (s === "shipped") return "info";
  if (s === "processing") return "warning";
  if (s === "cancelled") return "danger";
  return "default";
}

export default function CustomerAccount() {
  const { user, isAuthenticated, isAdmin, logout } = useAuth();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<TabId>("account");
  const [orders, setOrders] = useState<any[]>([]);
  const [customerRow, setCustomerRow] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);
  const [expandedOrderId, setExpandedOrderId] = useState<number | null>(null);

  useEffect(() => {
    if (isAuthenticated && isAdmin) {
      navigate("/admin", { replace: true });
    }
  }, [isAuthenticated, isAdmin, navigate]);

  useEffect(() => {
    if (!user?.email || user.role !== "user") return;
    let cancelled = false;
    (async () => {
      setLoading(true);
      try {
        const { fetchMyOrders, fetchCustomerByEmail } = await import("../../../lib/api");
        const [o, c] = await Promise.all([
          fetchMyOrders(user.email),
          fetchCustomerByEmail(user.email),
        ]);
        if (!cancelled) {
          setOrders(o);
          setCustomerRow(c);
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [user?.email, user?.role]);

  const addresses = useMemo(() => {
    const map = new Map<string, { address: string; city: string }>();
    for (const o of orders) {
      const key = `${o.address || ""}|${o.city || ""}`;
      if (key !== "|") map.set(key, { address: o.address, city: o.city });
    }
    return Array.from(map.values());
  }, [orders]);

  if (!user || user.role !== "user") {
    return null;
  }

  const displayName = customerRow?.name || user.name;
  const displayPhone = customerRow?.phone || user.phone || "—";
  const displayCity = customerRow?.city || user.city || "—";
  const memberSince = customerRow?.created_at
    ? new Date(customerRow.created_at).toLocaleDateString(undefined, {
        year: "numeric",
        month: "long",
        day: "numeric",
      })
    : "—";

  return (
    <div className="min-h-screen bg-slate-50 py-8 md:py-12">
      <div className="container mx-auto px-4 max-w-6xl">
        <div className="mb-8">
          <h1 className="text-2xl md:text-3xl font-bold text-[#0B2A4A]">My account</h1>
          <p className="text-gray-600 mt-1">
            Manage your account details and view your orders.
          </p>
        </div>

        <div className="flex flex-col lg:flex-row gap-6 lg:gap-8">
          {/* Vertical tabs — WordPress-style */}
          <aside className="w-full lg:w-64 shrink-0">
            <nav className="bg-white rounded-2xl border border-gray-200 shadow-sm p-2 flex flex-row lg:flex-col gap-1 overflow-x-auto lg:overflow-visible">
              {tabs.map((tab) => {
                const Icon = tab.icon;
                const active = activeTab === tab.id;
                return (
                  <button
                    key={tab.id}
                    type="button"
                    onClick={() => setActiveTab(tab.id)}
                    className={`flex items-center gap-3 px-4 py-3 rounded-xl text-left text-sm font-semibold whitespace-nowrap transition-colors ${
                      active
                        ? "bg-[#0B2A4A] text-white"
                        : "text-gray-600 hover:bg-gray-50"
                    }`}
                  >
                    <Icon className="w-5 h-5 shrink-0" />
                    {tab.label}
                    <ChevronRight
                      className={`w-4 h-4 ml-auto shrink-0 hidden lg:block ${active ? "opacity-100" : "opacity-0"}`}
                    />
                  </button>
                );
              })}
            </nav>
            <button
              type="button"
              onClick={() => {
                logout();
                navigate("/", { replace: true });
              }}
              className="mt-4 w-full px-4 py-3 rounded-xl border border-gray-200 text-sm font-semibold text-gray-700 hover:bg-gray-50"
            >
              Log out
            </button>
          </aside>

          {/* Content */}
          <main className="flex-1 min-w-0 bg-white rounded-2xl border border-gray-200 shadow-sm p-6 md:p-8">
            {activeTab === "account" && (
              <div className="space-y-6">
                <h2 className="text-lg font-bold text-[#0B2A4A] border-b border-gray-100 pb-3">
                  Account details
                </h2>
                <dl className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <div>
                    <dt className="text-xs font-semibold uppercase tracking-wide text-gray-500">
                      Name
                    </dt>
                    <dd className="mt-1 text-gray-900 font-medium">{displayName}</dd>
                  </div>
                  <div>
                    <dt className="text-xs font-semibold uppercase tracking-wide text-gray-500">
                      Email
                    </dt>
                    <dd className="mt-1 text-gray-900 font-medium break-all">{user.email}</dd>
                  </div>
                  <div>
                    <dt className="text-xs font-semibold uppercase tracking-wide text-gray-500">
                      Phone
                    </dt>
                    <dd className="mt-1 text-gray-900 font-medium">{displayPhone}</dd>
                  </div>
                  <div>
                    <dt className="text-xs font-semibold uppercase tracking-wide text-gray-500">
                      City
                    </dt>
                    <dd className="mt-1 text-gray-900 font-medium">{displayCity}</dd>
                  </div>
                  <div className="sm:col-span-2">
                    <dt className="text-xs font-semibold uppercase tracking-wide text-gray-500">
                      Member since
                    </dt>
                    <dd className="mt-1 text-gray-900 font-medium">{memberSince}</dd>
                  </div>
                </dl>
              </div>
            )}

            {activeTab === "orders" && (
              <div className="space-y-4">
                <h2 className="text-lg font-bold text-[#0B2A4A] border-b border-gray-100 pb-3">
                  Orders
                </h2>
                {loading ? (
                  <div className="flex justify-center py-16">
                    <div className="animate-spin rounded-full h-10 w-10 border-2 border-[#FF7A00] border-t-transparent" />
                  </div>
                ) : orders.length === 0 ? (
                  <p className="text-gray-500 py-8 text-center">
                    You have not placed any orders yet.{" "}
                    <Link to="/shop" className="text-[#FF7A00] font-semibold hover:underline">
                      Browse the shop
                    </Link>
                  </p>
                ) : (
                  <ul className="space-y-3">
                    {orders.map((order) => {
                      const open = expandedOrderId === order.id;
                      return (
                        <li
                          key={order.id}
                          className="rounded-xl border border-gray-200 overflow-hidden"
                        >
                          <button
                            type="button"
                            onClick={() =>
                              setExpandedOrderId(open ? null : order.id)
                            }
                            className="w-full flex flex-wrap items-center gap-3 p-4 text-left hover:bg-gray-50 transition-colors"
                          >
                            <div className="flex items-center gap-2 min-w-0">
                              <Package className="w-5 h-5 text-[#FF7A00] shrink-0" />
                              <span className="font-semibold text-[#0B2A4A]">
                                Order #{order.id}
                              </span>
                            </div>
                            <div className="flex flex-wrap items-center gap-2 ml-auto">
                              <span className="text-sm text-gray-500 flex items-center gap-1">
                                <Calendar className="w-4 h-4" />
                                {order.created_at
                                  ? new Date(order.created_at).toLocaleDateString()
                                  : "—"}
                              </span>
                              <StatusPill
                                label={order.order_status || "pending"}
                                variant={statusVariant(order.order_status)}
                              />
                              <StatusPill
                                label={order.payment_status || "pending"}
                                variant={
                                  order.payment_status === "paid" ? "success" : "warning"
                                }
                              />
                              <span className="font-bold text-[#FF7A00]">
                                Rs. {Number(order.total_price || 0).toLocaleString()}
                              </span>
                              <ChevronDown
                                className={`w-5 h-5 text-gray-400 transition-transform ${open ? "rotate-180" : ""}`}
                              />
                            </div>
                          </button>
                          {open && (
                            <div className="px-4 pb-4 pt-0 border-t border-gray-100 bg-gray-50/80">
                              <div className="pt-4 space-y-3">
                                <div className="flex flex-wrap gap-4 text-sm text-gray-600">
                                  <span className="inline-flex items-center gap-1">
                                    <Truck className="w-4 h-4" />
                                    {order.city}
                                  </span>
                                  {order.payment_method && (
                                    <span className="inline-flex items-center gap-1">
                                      <CreditCard className="w-4 h-4" />
                                      {String(order.payment_method).toUpperCase()}
                                    </span>
                                  )}
                                </div>
                                <p className="text-sm">
                                  <span className="font-semibold text-gray-700">Ship to: </span>
                                  {order.address}
                                </p>
                                {order.notes ? (
                                  <p className="text-sm text-gray-600">
                                    <span className="font-semibold">Notes: </span>
                                    {order.notes}
                                  </p>
                                ) : null}
                                <div>
                                  <p className="text-xs font-semibold uppercase text-gray-500 mb-2">
                                    Items
                                  </p>
                                  <ul className="space-y-2">
                                    {Array.isArray(order.products) &&
                                      order.products.map((item: any, idx: number) => (
                                        <li
                                          key={idx}
                                          className="flex justify-between text-sm bg-white rounded-lg px-3 py-2 border border-gray-100"
                                        >
                                          <span>
                                            {item.name}{" "}
                                            <span className="text-gray-500">
                                              × {item.quantity}
                                            </span>
                                          </span>
                                          <span className="font-medium text-[#0B2A4A]">
                                            Rs.{" "}
                                            {(
                                              Number(item.price) * Number(item.quantity)
                                            ).toLocaleString()}
                                          </span>
                                        </li>
                                      ))}
                                  </ul>
                                </div>
                              </div>
                            </div>
                          )}
                        </li>
                      );
                    })}
                  </ul>
                )}
              </div>
            )}

            {activeTab === "addresses" && (
              <div className="space-y-4">
                <h2 className="text-lg font-bold text-[#0B2A4A] border-b border-gray-100 pb-3">
                  Addresses
                </h2>
                {addresses.length === 0 ? (
                  <p className="text-gray-500 py-8 text-center">
                    No saved addresses yet. They appear here from your orders.
                  </p>
                ) : (
                  <ul className="space-y-3">
                    {addresses.map((addr, i) => (
                      <li
                        key={i}
                        className="rounded-xl border border-gray-200 p-4 flex gap-3"
                      >
                        <MapPin className="w-5 h-5 text-[#FF7A00] shrink-0 mt-0.5" />
                        <div>
                          <p className="font-semibold text-[#0B2A4A]">{addr.city}</p>
                          <p className="text-sm text-gray-600 mt-1">{addr.address}</p>
                        </div>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            )}
          </main>
        </div>
      </div>
    </div>
  );
}
