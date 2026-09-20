"use client";

import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from "recharts";

type Point = { date: string; views: number; downloads: number };

export default function StatsChart({ data }: { data: Point[] }) {
  return (
    <div className="h-64 w-full">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={data}>
          <CartesianGrid stroke="#1f2430" strokeDasharray="3 3" />
          <XAxis dataKey="date" stroke="#6b7280" fontSize={12} />
          <YAxis stroke="#6b7280" fontSize={12} />
          <Tooltip contentStyle={{ background: "#12151c", border: "1px solid #1f2430" }} />
          <Line type="monotone" dataKey="views" stroke="#00e5c7" strokeWidth={2} dot={false} />
          <Line type="monotone" dataKey="downloads" stroke="#7c5cff" strokeWidth={2} dot={false} />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
