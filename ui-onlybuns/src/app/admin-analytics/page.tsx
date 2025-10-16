"use client";
import { useEffect, useState } from "react";
import axios from "axios";
import { RadialBarChart, RadialBar, Legend,Tooltip } from "recharts";

export default function AdminAnalytics() {
  const [data, setData] = useState<any>(null);

  useEffect(() => {
    const token = localStorage.getItem("access_token");
    axios.get("http://localhost:8000/stats/admin_analytics", {
      headers: { Authorization: `Bearer ${token}` },
    })
    .then((res: any) => setData(res.data))
    .catch((err: any) => console.error(err));
  }, []);

  if (!data) return <p className="text-center mt-10">Loading analytics...</p>;

  const chartData = [
    { name: "Made Posts", value: data.percentages.made_posts, fill: "#4ade80" },
    { name: "Only Comments", value: data.percentages.only_comments, fill: "#fbbf24" },
    { name: "Inactive", value: data.percentages.inactive, fill: "#f87171" },
  ];

  return (
    <div className="p-8 text-green-900">
      <h1 className="text-3xl font-bold mb-8">📊 Application Analytics</h1>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-10">
        <div className="p-4 bg-white shadow rounded-xl text-center">
          <h2 className="text-lg font-semibold mb-2">Weekly</h2>
          <p>Posts: {data.weekly.posts}</p>
          <p>Comments: {data.weekly.comments}</p>
        </div>
        <div className="p-4 bg-white shadow rounded-xl text-center">
          <h2 className="text-lg font-semibold mb-2">Monthly</h2>
          <p>Posts: {data.monthly.posts}</p>
          <p>Comments: {data.monthly.comments}</p>
        </div>
        <div className="p-4 bg-white shadow rounded-xl text-center">
          <h2 className="text-lg font-semibold mb-2">Yearly</h2>
          <p>Posts: {data.yearly.posts}</p>
          <p>Comments: {data.yearly.comments}</p>
        </div>
      </div>

      <div className="flex justify-center">
        <RadialBarChart
          width={400}
          height={400}
          innerRadius="30%"
          outerRadius="100%"
          data={chartData ?? []}
          startAngle={180}
          endAngle={0}
        >
          <RadialBar dataKey="value" />
          <Legend iconSize={10} layout="vertical" verticalAlign="middle" align="right" />
          <Tooltip />
        </RadialBarChart>
      </div>
    </div>
  );
}
