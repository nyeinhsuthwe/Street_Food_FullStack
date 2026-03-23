const AdminSettings = () => {
  return (
    <div className="w-full max-w-4xl mx-auto">
      <div className="mb-6">
        <h1 className="text-2xl font-semibold">Admin Settings</h1>
        <p className="text-[color:var(--muted)] text-sm mt-1">
          Manage store details, notifications, and payment preferences.
        </p>
      </div>

      <div className="card p-6 space-y-6">
        <div className="grid gap-4 md:grid-cols-2">
          <div>
            <label className="block text-sm font-medium text-[color:var(--muted)] mb-1">
              Store Name
            </label>
            <input className="input w-full" placeholder="StreetBites" />
          </div>
          <div>
            <label className="block text-sm font-medium text-[color:var(--muted)] mb-1">
              Support Email
            </label>
            <input className="input w-full" placeholder="support@streetbites.com" />
          </div>
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          <div>
            <label className="block text-sm font-medium text-[color:var(--muted)] mb-1">
              Default Tax (%)
            </label>
            <input className="input w-full" placeholder="5" />
          </div>
          <div>
            <label className="block text-sm font-medium text-[color:var(--muted)] mb-1">
              Currency
            </label>
            <select className="input w-full">
              <option>MMK (Ks)</option>
              <option>USD ($)</option>
            </select>
          </div>
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          <div className="card-soft p-4">
            <p className="font-medium">Order Notifications</p>
            <p className="text-sm text-[color:var(--muted)] mt-1">
              Send email alerts for new orders.
            </p>
            <button className="btn-secondary mt-3">Configure</button>
          </div>
          <div className="card-soft p-4">
            <p className="font-medium">Payment Providers</p>
            <p className="text-sm text-[color:var(--muted)] mt-1">
              Manage mobile banking options and settlement.
            </p>
            <button className="btn-secondary mt-3">Manage</button>
          </div>
        </div>

        <div className="flex justify-end gap-3">
          <button className="btn-ghost">Cancel</button>
          <button className="btn-primary">Save Settings</button>
        </div>
      </div>
    </div>
  );
};

export default AdminSettings;
