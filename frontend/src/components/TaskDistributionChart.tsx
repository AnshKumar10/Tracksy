import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from "recharts";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";

type StatusType = "Pending" | "InProgress" | "Completed" | "All";

interface TaskDistributionChartProps {
  data: Record<StatusType, number>;
}

interface ChartItem {
  name: Exclude<StatusType, "All">;
  value: number;
}

const statusColors: Record<Exclude<StatusType, "All">, string> = {
  Pending: "#ffb347",
  InProgress: "#4da6ff",
  Completed: "#4CAF50",
};

export const TaskDistributionChart: React.FC<TaskDistributionChartProps> = ({
  data,
}) => {
  const chartData: ChartItem[] = (
    Object.entries(data) as [StatusType, number][]
  )
    .filter(([key]) => key !== "All")
    .map(([name, value]) => ({
      name: name as Exclude<StatusType, "All">,
      value,
    }));

  return (
    <Card className="shadow-sm py-2">
      <CardHeader className="pb-2 px-4 pt-4">
        <CardTitle className="text-base">Task Distribution</CardTitle>
        <CardDescription>By status & priority</CardDescription>
      </CardHeader>
      <CardContent className="p-4 pt-0">
        <div className="grid grid-cols-1 gap-4 h-60">
          <div>
            <h4 className="text-xs font-medium text-gray-500 mb-2 text-center">
              Status
            </h4>
            <ResponsiveContainer width="100%" height="85%">
              <PieChart>
                <Pie
                  data={chartData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ percent }) => `${(percent * 100).toFixed(0)}%`}
                  outerRadius={80}
                  dataKey="value"
                >
                  {chartData.map((entry, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={statusColors[entry.name]}
                    />
                  ))}
                </Pie>
                <Tooltip
                  formatter={(value: number) => [`${value} tasks`, "Count"]}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="flex justify-center gap-3 mt-1">
          {chartData.map(({ name }) => (
            <div key={name} className="flex items-center">
              <div
                className="w-2 h-2 rounded-full mr-1"
                style={{ backgroundColor: statusColors[name] }}
              />
              <span className="text-xs">{name}</span>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};
