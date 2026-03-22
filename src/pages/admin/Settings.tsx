import { useState } from "react";
import { Save, Shield, Bell, Store } from "lucide-react";

export default function AdminSettings() {
  const [saving, setSaving] = useState(false);
  const [settings, setSettings] = useState({
    storeName: "EnergyMart.pk",
    supportEmail: "support@energymart.pk",
    orderNotifications: true,
    lowStockAlerts: true,
  });

  const onSave = async () => {
    setSaving(true);
    await new Promise((r) => setTimeout(r, 600));
    setSaving(false);
  };

  return (
    <div className="space-y-6 min-w-0 w-full max-w-full">
      <div>
        <h1 className="text-2xl font-bold text-[#0B2A4A]">Settings</h1>
        <p className="text-gray-600">Manage store preferences and admin options.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 min-w-0">
        <div className="bg-white rounded-xl shadow-md p-6 lg:col-span-2">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 rounded-full bg-[#FF7A00]/10 flex items-center justify-center">
              <Store className="w-5 h-5 text-[#FF7A00]" />
            </div>
            <h2 className="text-xl font-bold text-[#0B2A4A]">Store</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Store name</label>
              <input
                value={settings.storeName}
                onChange={(e) => setSettings((s) => ({ ...s, storeName: e.target.value }))}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#FF7A00]"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Support email</label>
              <input
                value={settings.supportEmail}
                onChange={(e) => setSettings((s) => ({ ...s, supportEmail: e.target.value }))}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#FF7A00]"
              />
            </div>
          </div>

          <div className="mt-6 flex justify-end">
            <button
              onClick={onSave}
              disabled={saving}
              className="inline-flex items-center gap-2 px-5 py-3 rounded-lg bg-[#FF7A00] text-white font-semibold hover:bg-[#FF7A00]/90 disabled:opacity-60"
            >
              <Save className="w-5 h-5" />
              {saving ? "Saving..." : "Save changes"}
            </button>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-md p-6 space-y-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-[#FF7A00]/10 flex items-center justify-center">
              <Bell className="w-5 h-5 text-[#FF7A00]" />
            </div>
            <h2 className="text-xl font-bold text-[#0B2A4A]">Notifications</h2>
          </div>

          <label className="flex items-start gap-3 cursor-pointer">
            <input
              type="checkbox"
              checked={settings.orderNotifications}
              onChange={(e) =>
                setSettings((s) => ({ ...s, orderNotifications: e.target.checked }))
              }
              className="mt-1 w-4 h-4 accent-[#FF7A00]"
            />
            <div>
              <p className="font-semibold text-[#0B2A4A]">Order notifications</p>
              <p className="text-sm text-gray-600">Get notified when new orders arrive.</p>
            </div>
          </label>

          <label className="flex items-start gap-3 cursor-pointer">
            <input
              type="checkbox"
              checked={settings.lowStockAlerts}
              onChange={(e) =>
                setSettings((s) => ({ ...s, lowStockAlerts: e.target.checked }))
              }
              className="mt-1 w-4 h-4 accent-[#FF7A00]"
            />
            <div>
              <p className="font-semibold text-[#0B2A4A]">Low stock alerts</p>
              <p className="text-sm text-gray-600">Warn when product stock is low.</p>
            </div>
          </label>

          <div className="pt-2 border-t">
            <div className="flex items-center gap-3 mb-3">
              <Shield className="w-5 h-5 text-[#FF7A00]" />
              <p className="font-bold text-[#0B2A4A]">Security</p>
            </div>
            <p className="text-sm text-gray-600">
              For now, admin security is managed via your login session. (We can add password
              change + 2FA later.)
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

