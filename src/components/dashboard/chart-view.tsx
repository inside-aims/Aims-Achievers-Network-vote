import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Bar, BarChart, XAxis, YAxis, ResponsiveContainer } from "recharts";
import { ChartContainer } from "@/components/ui/chart";
import { CategoryChart } from "./category-chart";
import type { Category, CategoryWithNominees } from "@/lib/types";

interface ChartViewProps {
  categories: Category[];
  categoriesWithNominees: CategoryWithNominees[];
}

export function ChartView({
  categories,
  categoriesWithNominees,
}: ChartViewProps) {
  return (
    <div className="space-y-6">
      {/* Overall Category Distribution */}
      <Card className="bg-zinc-900 border-zinc-800">
        <CardHeader>
          <CardTitle className="text-xl text-yellow-400">
            Overall Vote Distribution by Category
          </CardTitle>
          <p className="text-zinc-400">Total votes across all categories</p>
        </CardHeader>
        <CardContent>
          <div className="h-[300px] md:h-[400px]">
            <ChartContainer
              config={{
                votes: {
                  label: "Votes",
                  color: "hsl(45, 93%, 47%)",
                },
              }}
              className="h-full w-full"
            >
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={categories}
                  margin={{ top: 20, right: 30, left: 60, bottom: 60 }}
                >
                  <XAxis
                    dataKey="name"
                    tick={{ fill: "#fbbf24", fontSize: 12 }}
                    angle={-45}
                    textAnchor="end"
                    height={80}
                  />
                  <YAxis
                    tick={{ fill: "#fbbf24", fontSize: 12 }}
                    tickFormatter={(value) => value.toLocaleString()}
                  />
                  <Bar
                    dataKey="votes"
                    fill="url(#goldGradient)"
                    radius={[4, 4, 0, 0]}
                  />
                  <defs>
                    <linearGradient
                      id="goldGradient"
                      x1="0"
                      y1="0"
                      x2="0"
                      y2="1"
                    >
                      <stop offset="0%" stopColor="#fbbf24" />
                      <stop offset="100%" stopColor="#f59e0b" />
                    </linearGradient>
                  </defs>
                </BarChart>
              </ResponsiveContainer>
            </ChartContainer>
          </div>

          {/* Category Summary */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mt-6">
            {categories.map((category) => (
              <div
                key={category.name}
                className="bg-zinc-800 rounded-lg p-4 border border-zinc-700"
              >
                <h3 className="font-medium text-yellow-400 mb-2">
                  {category.name}
                </h3>
                <p className="text-2xl font-bold text-white">
                  {category.votes.toLocaleString()}
                </p>
                <p className="text-sm text-zinc-400">
                  {(
                    (category.votes /
                      categories.reduce((sum, cat) => sum + cat.votes, 0)) *
                    100
                  ).toFixed(1)}
                  % of total
                </p>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Individual Category Charts */}
      <div className="space-y-6">
        <h2 className="text-2xl font-bold text-yellow-400 mb-4">
          Individual Category Breakdown
        </h2>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {categoriesWithNominees.map((category) => (
            <CategoryChart key={category.id} category={category} />
          ))}
        </div>
      </div>
    </div>
  );
}
