import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from "recharts";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";
import { priorityColors } from "@/lib/configs";

type PriorityType = "Low" | "Medium" | "High";

interface TaskPriorityDataItem {
  name: PriorityType;
  value: number;
}

interface TaskTrendChartProps {
  data: Record<PriorityType, number>;
}

export const TaskTrendChart: React.FC<TaskTrendChartProps> = ({ data }) => {
  const chartData: TaskPriorityDataItem[] = Object.entries(data).map(
    ([name, value]) => ({
      name: name as PriorityType,
      value,
    })
  );

  const maxValue = Math.max(...chartData.map((d) => d.value));

  return (
    <Card className="shadow-sm py-2">
      <CardHeader className="pb-2 px-4 pt-4">
        <CardTitle className="text-base">Task Trend</CardTitle>
        <CardDescription>Weekly task activity overview</CardDescription>
      </CardHeader>
      <CardContent className="p-4 pt-0">
        <div className="h-96">
          <ResponsiveContainer width="100%" height="85%">
            <BarChart
              data={chartData}
              layout="horizontal"
              margin={{ top: 5, right: 10, left: 5, bottom: 5 }}
            >
              <XAxis
                type="category"
                dataKey="name"
                tickLine={false}
                axisLine={false}
              />
              <YAxis
                type="number"
                domain={[0, maxValue + 2]}
                tick={{ fontSize: 12 }}
                ticks={Array.from({ length: maxValue + 2 }, (_, i) => i)}
              />
              <Tooltip
                formatter={(value: number) => [`${value} tasks`, "Count"]}
              />
              <Bar dataKey="value" radius={[4, 4, 0, 0]}>
                {chartData.map((entry, index) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={priorityColors[entry.name]}
                  />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
};
