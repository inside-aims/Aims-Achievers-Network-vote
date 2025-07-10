import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Bar,
  BarChart,
  XAxis,
  YAxis,
  ResponsiveContainer,
  Cell,
} from "recharts";
import type { CategoryWithNominees } from "@/lib/types";

interface CategoryChartProps {
  category: CategoryWithNominees;
}

export function CategoryChart({ category }: CategoryChartProps) {
  const chartData = category.nominees.map((nominee, index) => ({
    name: nominee.stage_name || nominee.name,
    fullName: nominee.name,
    votes: nominee.totalVotes,
    color: `hsl(${45 + index * 15}, 93%, ${47 + index * 5}%)`, // Gold variations
  }));

  const maxVotes = Math.max(...chartData.map((d) => d.votes));
  const yAxisMax = Math.ceil((maxVotes * 1.1) / 100) * 100; // Round up to nearest 100

  return (
    <Card className="bg-zinc-900 border-zinc-800">
      <CardHeader>
        <CardTitle className="text-lg text-yellow-400 flex items-center justify-between">
          {category.name}
          <span className="text-sm font-normal text-zinc-400">
            {category.votes.toLocaleString()} total votes
          </span>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-[300px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={chartData}
              margin={{ top: 20, right: 30, left: 60, bottom: 80 }}
            >
              <XAxis
                dataKey="name"
                tick={{ fill: "#fbbf24", fontSize: 11 }}
                angle={-45}
                textAnchor="end"
                height={80}
                interval={0}
              />
              <YAxis
                tick={{ fill: "#fbbf24", fontSize: 12 }}
                domain={[0, yAxisMax]}
                tickFormatter={(value) => value.toLocaleString()}
              />
              <Bar dataKey="votes" radius={[4, 4, 0, 0]}>
                {chartData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Bar>

              {/* Custom labels on top of bars */}
              {chartData.map((entry, index) => (
                <text
                  key={`label-${index}`}
                  x={
                    index * (100 / chartData.length) +
                    100 / chartData.length / 2 +
                    "%"
                  }
                  y={`${100 - (entry.votes / yAxisMax) * 80 - 5}%`}
                  textAnchor="middle"
                  fill="#fbbf24"
                  fontSize="12"
                  fontWeight="bold"
                >
                  {entry.votes.toLocaleString()}
                </text>
              ))}
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Legend */}
        <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-2">
          {chartData.map((nominee, index) => (
            <div key={index} className="flex items-center gap-2 text-sm">
              <div
                className="w-3 h-3 rounded-sm"
                style={{ backgroundColor: nominee.color }}
              />
              <span className="text-zinc-300 truncate">
                {nominee.fullName} - {nominee.votes.toLocaleString()} votes
              </span>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
