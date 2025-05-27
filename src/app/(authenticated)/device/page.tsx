import DeviceTable from "@/components/device/DeviceTable";
import { GetDevices } from "@/server/device";
import { Alert } from "@heroui/react";

const DevicePage: React.FC = async () => {
  const devices = await GetDevices();

  if (!devices) {
    return <div className="p-4">
      <Alert>
        Không thể tải danh sách thiết bị. Vui lòng thử lại sau.
      </Alert>
    </div>;
  }
  return (
    <div className="w-full p-4">
      <DeviceTable devices={devices} />
    </div>
  )
}

export default DevicePage;