export function StatCard({ title, value }: { title: string; value: number | string }) {
  return (
    <div className="bg-white p-6 rounded-xl shadow-md text-center border border-gray-200">
      <h3 className="text-md font-medium text-gray-500">{title}</h3>
      <p className="text-4xl font-bold text-gray-900 mt-2 tracking-tight">{value}</p>
    </div>
  );
}