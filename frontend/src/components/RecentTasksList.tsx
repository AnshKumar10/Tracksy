import { Calendar } from "lucide-react";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import type { TaskTypeInterface } from "@/lib/types/tasks";
import { priorityColors, statusColors } from "@/lib/configs";

interface RecentTasksListProps {
  tasks: TaskTypeInterface[];
}

const formatDate = (dateString: string): string => {
  try {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  } catch (error) {
    console.error("Invalid date:", error);
    return dateString;
  }
};

const isOverdue = (dueDate: string): boolean => {
  return new Date(dueDate) < new Date() && !!dueDate;
};

export const RecentTasksList: React.FC<RecentTasksListProps> = ({ tasks }) => {
  return (
    <Card className="shadow-sm py-2">
      <CardHeader className="pb-2 px-4 pt-4">
        <CardTitle className="text-base">Recent Tasks</CardTitle>
        <CardDescription>
          Latest tasks that require your attention
        </CardDescription>
      </CardHeader>
      <CardContent className="p-4 pt-2">
        <div className="space-y-2">
          {tasks.map((task) => (
            <div
              key={task._id}
              className="flex flex-col sm:flex-row sm:items-center justify-between p-3 border rounded-lg"
            >
              <div className="flex-1 min-w-0 mb-1 sm:mb-0">
                <div className="flex items-center mb-1">
                  <h3 className="font-medium text-primary truncate mr-2">
                    {task.title}
                  </h3>
                  <Badge
                    style={{
                      backgroundColor: statusColors[task.status] || "#999",
                    }}
                    className="text-white"
                    variant="outline"
                  >
                    {task.status}
                  </Badge>
                </div>
                <div className="flex items-center text-xs text-gray-500">
                  <Calendar className="h-3 w-3 mr-1" />
                  <span
                    className={
                      isOverdue(task.dueDate) && task.status !== "Completed"
                        ? "text-red-500"
                        : ""
                    }
                  >
                    Due: {formatDate(task.dueDate)}
                    {isOverdue(task.dueDate) &&
                      task.status !== "Completed" &&
                      " (Overdue)"}
                  </span>
                </div>
              </div>
              <div className="flex items-center mt-1 sm:mt-0">
                <Badge
                  style={{
                    backgroundColor: priorityColors[task.priority] || "#999",
                  }}
                  className="text-white"
                  variant="outline"
                >
                  {task.priority}
                </Badge>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};
