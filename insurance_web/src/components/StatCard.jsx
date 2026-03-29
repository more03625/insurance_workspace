export default function StatCard({ label, value, icon: Icon, color = 'indigo' }) {
  const colorMap = {
    indigo: 'bg-indigo-50 text-indigo-600',
    green: 'bg-green-50 text-green-600',
    yellow: 'bg-yellow-50 text-yellow-600',
    red: 'bg-red-50 text-red-600',
    blue: 'bg-blue-50 text-blue-600',
  };

  return (
    <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
      <div className="flex items-center gap-4">
        {Icon && (
          <div className={`flex h-11 w-11 items-center justify-center rounded-lg ${colorMap[color]}`}>
            <Icon className="h-6 w-6" />
          </div>
        )}
        <div>
          <p className="text-sm font-medium text-gray-500">{label}</p>
          <p className="mt-0.5 text-2xl font-bold text-gray-900">{value}</p>
        </div>
      </div>
    </div>
  );
}
