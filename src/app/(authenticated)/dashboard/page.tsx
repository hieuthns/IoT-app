import { DeviceManager } from "@/components/dashboard/DeviceManager";
import HistoryChart from "@/components/dashboard/HistoryChart";
import MetricCards from "@/components/dashboard/MetricCard";

const DashboardPage: React.FC = () => {
  return (
    <div className="p-4">
      <div className="w-full mb-8">
        <MetricCards />
      </div>
      <div className="flex gap-4">
        <HistoryChart />
        <DeviceManager />
      </div>
    </div>
  )
}

export default DashboardPage;