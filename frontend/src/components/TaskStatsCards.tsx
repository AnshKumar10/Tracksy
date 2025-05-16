import { Card, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import type { StatisticsTypeInterface } from "@/lib/types/tasks";
import { Clock, AlertCircle, CircleDashed } from "lucide-react";

interface Props {
  stats: StatisticsTypeInterface;
}

export const TaskStatsCards: React.FC<Props> = ({ stats }) => {
  const completionPercentage =
    stats.totalTasks > 0
      ? Math.round((stats.completedTasks / stats.totalTasks) * 100)
      : 0;

  const calculatePercentage = (count: number) =>
    stats.totalTasks > 0 ? Math.round((count / stats.totalTasks) * 100) : 0;

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
      <Card className="shadow-sm p-2 gap-2 h-32">
        <CardContent className="p-3 flex flex-col">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium text-gray-500">
              Total Tasks
            </span>
            <CircleDashed className="h-4 w-4 text-gray-500" />
          </div>
          <div className="mt-1">
            <span className="text-xl font-bold">{stats.totalTasks}</span>
            <Progress value={completionPercentage} className="h-1.5 mt-1.5" />
            <p className="text-xs text-gray-500 mt-1">
              {completionPercentage}% completed
            </p>
          </div>
        </CardContent>
      </Card>

      <Card className="shadow-sm p-2 gap-2 h-32">
        <CardContent className="p-3 flex flex-col">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium text-gray-500">
              In Progress
            </span>
            <Clock className="h-4 w-4 text-blue-500" />
          </div>
          <div className="mt-1">
            <span className="text-xl font-bold">{stats.inProgressTasks}</span>
            <p className="text-xs text-gray-500 mt-1.5">
              {calculatePercentage(stats.inProgressTasks)}% of total
            </p>
          </div>
        </CardContent>
      </Card>

      <Card className="shadow-sm p-2 gap-2 h-32">
        <CardContent className="p-3 flex flex-col">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium text-gray-500">Pending</span>
            <CircleDashed className="h-4 w-4 text-yellow-500" />
          </div>
          <div className="mt-1">
            <span className="text-xl font-bold">{stats.pendingTasks}</span>
            <p className="text-xs text-gray-500 mt-1.5">
              {calculatePercentage(stats.pendingTasks)}% of total
            </p>
          </div>
        </CardContent>
      </Card>

      <Card className="shadow-sm p-2 gap-2 h-32">
        <CardContent className="p-3 flex flex-col">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium text-gray-500">Overdue</span>
            <AlertCircle className="h-4 w-4 text-red-500" />
          </div>
          <div className="mt-1">
            <span className="text-xl font-bold">{stats.overDueTasks}</span>
            <p className="text-xs text-gray-500 mt-1.5">
              {calculatePercentage(stats.overDueTasks)}% of total
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
