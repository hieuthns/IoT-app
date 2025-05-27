"use client";

import {
  addToast,
  Button,
  Chip,
  Form,
  Input,
  Modal,
  ModalBody,
  ModalContent,
  ModalHeader,
  Select,
  SelectItem,
  Table,
  TableBody,
  TableCell,
  TableColumn,
  TableHeader,
  TableRow,
  useDisclosure
} from "@heroui/react";
import { Device, User } from "@prisma/client";
import { Icon } from "@iconify/react";
import { useEffect, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { useMutation } from "@tanstack/react-query";
import { CreateUser, DeleteUser, UpdateUser } from "@/server/user";
import { useSession } from "next-auth/react";
import { CreateDevice, DeleteDevice, UpdateDevice } from "@/server/device";

interface DeviceTableProps {
  devices: Device[];
}

const DeviceTable: React.FC<DeviceTableProps> = ({ devices }) => {
  const [selectedDevice, setSelectedDevice] = useState<Device | null>(null);
  const { isOpen, onOpen, onClose } = useDisclosure();

  const { handleSubmit, control, reset } = useForm({
    defaultValues: {
      name: "",
      topic: "",
    },
  });


  const deleteDevice = useMutation({
    mutationKey: ["deleteDevice"],
    mutationFn: (id: string) => DeleteDevice(id),
    onSuccess: () => {
      addToast({
        title: "Thành công",
        description: "Thiết bị đã được xóa thành công",
        color: "success",
      });
    },
    onError: (error) => {
      addToast({
        title: "Lỗi",
        description: `Không thể xóa thiết bị`,
        color: "danger",
      })
    }
  });

  const createDevice = useMutation({
    mutationKey: ["createDevice"],
    mutationFn: (data: { name: string; topic: string }) => CreateDevice(data),
    onSuccess: () => {
      addToast({
        title: "Thành công",
        description: "Thiết bị đã được thêm thành công",
        color: "success",
      });
    },
    onError: (error) => {
      addToast({
        title: "Lỗi",
        description: `Không thể thêm thiết bị`,
        color: "danger",
      });
    }
  });

  const updateDevice = useMutation({
    mutationKey: ["updateDevice"],
    mutationFn: ({ id, data }: { id: string; data: { name: string; topic: string } }) => UpdateDevice(id, data),
    onSuccess: () => {
      addToast({
        title: "Thành công",
        description: "Thiết bị đã được cập nhật thành công",
        color: "success",
      });
    },
    onError: (error) => {
      addToast({
        title: "Lỗi",
        description: `Không thể cập nhật thiết bị`,
        color: "danger",
      });
    }
  })

  const handleCloseModal = () => {
    setSelectedDevice(null);
    onClose();
  }

  const onUpdateSubmit = (data: { name: string, topic: string }) => {
    if (selectedDevice) {
      updateDevice.mutate({ id: selectedDevice.id, data });
    } else {
      createDevice.mutate(data);
    }
    handleCloseModal();
  }

  const handleDeleteSubmit = (deviceId: string) => {
    deleteDevice.mutate(deviceId);
    handleCloseModal();
  }

  const handleOpenModal = (type: "create" | "update", device: Device | null) => {
    if (type === "update" && device) {
      setSelectedDevice(device);
    } else {
      setSelectedDevice(null);
      reset({
        name: "",
        topic: "",
      });
    }
    onOpen();
  }

  useEffect(() => {
    if (selectedDevice) {
      reset({
        name: selectedDevice.name,
        topic: selectedDevice.topic,
      });
    }
  }, [selectedDevice, reset]);

  return (
    <>
      <div className="flex w-full justify-end">
        <Button
          variant="solid"
          color="primary"
          className="mb-4"
          onPress={() => handleOpenModal("create", null)}
        >
          <Icon icon="basil:add-outline" className="mr-2" />
          Thêm thiết bị
        </Button>
      </div>
      <Table>
        <TableHeader>
          <TableColumn>Tên</TableColumn>
          <TableColumn>Mã kết nối</TableColumn>
          <TableColumn>Hành động</TableColumn>
        </TableHeader>
        <TableBody>
          {devices.map((device) => (
            <TableRow key={device.id}>
              <TableCell>{device.name}</TableCell>
              <TableCell>{device.topic}</TableCell>
              <TableCell>
                <Button isIconOnly variant="light" onPress={() => handleOpenModal("update", device)}>
                  <Icon icon="basil:edit-outline" />
                </Button>
                <Button isIconOnly variant="light" color="danger" onPress={() => handleDeleteSubmit(device.id)}>
                  <Icon icon="basil:trash-outline" />
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
      <Modal isOpen={isOpen} onClose={handleCloseModal} size="2xl">
        <ModalContent>
          <ModalHeader>
            <h2 className="text-lg font-semibold">
              {selectedDevice ? "Cập nhật thiết bị" : "Thêm thiết bị"}
            </h2>
          </ModalHeader>
          <ModalBody className="p-4">
            <Form className="flex flex-col gap-4" onSubmit={handleSubmit(onUpdateSubmit)}>
              <Controller
                name="name"
                control={control}
                render={({ field }) => (
                  <Input {...field} label="Tên thiết bị" />
                )}
              />
              <Controller
                name="topic"
                control={control}
                render={({ field }) => (
                  <Input {...field} label="Mã kết nối" />
                )}
              />
              <Button type="submit" variant="solid" color="primary" className="w-full">
                Cập nhật
              </Button>
            </Form>
          </ModalBody>
        </ModalContent>
      </Modal>
    </>
  )
}

export default DeviceTable;