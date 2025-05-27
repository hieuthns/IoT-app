"use client";

import { GetDevices, SwitchDevice } from "@/server/device";
import { Switch, Table, TableBody, TableCell, TableColumn, TableHeader, TableRow } from "@heroui/react"
import { useMutation, useQuery } from "@tanstack/react-query";

export const DeviceManager: React.FC = () => {
  const { data, refetch } = useQuery({
    queryKey: ["devices-status"],
    queryFn: () => GetDevices(),
    refetchInterval: 5000,
  });

  const switchMutation = useMutation({
    mutationFn: ({ deviceId }: { deviceId: string }) => SwitchDevice(deviceId),
    onSuccess: () => {
      refetch();
    },
    onError: (error) => {
      console.error("Error switching device:", error);
    },
  });

  if (!data) {
    return <div>Loading...</div>;
  }

  const handleSwitch = (deviceId: string) => {
    switchMutation.mutate({ deviceId });
  };

  return (
    <div className="min-w-[400px]">
      <Table>
        <TableHeader>
          <TableColumn>Thiết bị</TableColumn>
          <TableColumn>Thao tác</TableColumn>
        </TableHeader>
        <TableBody>
          {data.map((device) => (
            <TableRow key={device.id}>
              <TableCell>{device.name}</TableCell>
              <TableCell>
                <Switch
                  isSelected={device.currentStatus === "on"}
                  onChange={() => {
                    handleSwitch(device.id);
                  }}
                  aria-label={`Switch for ${device.name}`}
                />
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  )
}