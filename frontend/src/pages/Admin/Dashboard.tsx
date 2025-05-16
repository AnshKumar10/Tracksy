import { useEffect, useState } from "react";
import { DashboardLayout } from "@/components/layouts/DashboardLayout";
import axiosInstance from "@/lib/axios";
import { API_PATHS } from "@/lib/apiPaths";
import { handleApiError } from "@/lib/utils";
import { GreetingHeader } from "@/components/GreetingHeader";
import { TaskStatsCards } from "@/components/TaskStatsCards";
import { RecentTasksList } from "@/components/RecentTasksList";
import type { DashboardDataTypeInterface } from "@/lib/types/tasks";
import { TaskTrendChart } from "@/components/TaskTrendChart";
import { TaskDistributionChart } from "@/components/TaskDistributionChart";
import Loader from "@/components/Loader";

const Dashboard = () => {
  const [dashboardData, setDashboardData] =
    useState<DashboardDataTypeInterface>({
      statistics: {
        totalTasks: 0,
        pendingTasks: 0,
        completedTasks: 0,
        inProgressTasks: 0,
        overDueTasks: 0,
      },
      charts: {
        taskDistribution: { Pending: 0, InProgress: 0, Completed: 0, All: 0 },
        taskPriority: { Low: 0, Medium: 0, High: 0 },
      },
      recentTasks: [],
    });

  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const getDashboardStats = async () => {
      try {
        setIsLoading(true);
        const response = await axiosInstance.get(
          API_PATHS.REPORTS.DASHBOARD_REPORT
        );
        setDashboardData(response.data);
      } catch (error) {
        handleApiError(error);
      } finally {
        setIsLoading(false);
      }
    };

    getDashboardStats();
  }, []);

  if (isLoading) return <Loader />;

  return (
    <DashboardLayout>
      <div className="p-4 space-y-4">
        <GreetingHeader />
        <TaskStatsCards stats={dashboardData.statistics} />
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          <TaskTrendChart data={dashboardData.charts.taskPriority} />
          <TaskDistributionChart data={dashboardData.charts.taskDistribution} />
        </div>
        <RecentTasksList tasks={dashboardData.recentTasks} />
      </div>
    </DashboardLayout>
  );
};

export default Dashboard;
