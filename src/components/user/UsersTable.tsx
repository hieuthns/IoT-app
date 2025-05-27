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
import { User } from "@prisma/client";
import { Icon } from "@iconify/react";
import { useEffect, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { useMutation } from "@tanstack/react-query";
import { CreateUser, DeleteUser, UpdateUser } from "@/server/user";
import { useSession } from "next-auth/react";

interface UsersTableProps {
  users: User[];
}

const UsersTable: React.FC<UsersTableProps> = ({ users }) => {
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const { isOpen, onOpen, onClose } = useDisclosure();
  const { data: session } = useSession();

  const { handleSubmit, control, reset } = useForm({
    defaultValues: {
      name: "",
      email: "",
      role: "USER",
    },
  });


  const deleteUser = useMutation({
    mutationKey: ["deleteUser"],
    mutationFn: (id: string) => DeleteUser(id),
    onSuccess: () => {
      addToast({
        title: "Thành công",
        description: "Người dùng đã được xóa thành công",
        color: "success",
      });
    },
    onError: (error) => {
      addToast({
        title: "Lỗi",
        description: `Không thể xóa người dùng`,
        color: "danger",
      })
    }
  });

  const createUser = useMutation({
    mutationKey: ["createUser"],
    mutationFn: (data: { name: string; email: string; role: string }) => CreateUser(data),
    onSuccess: () => {
      addToast({
        title: "Thành công",
        description: "Người dùng đã được thêm thành công",
        color: "success",
      });
    },
    onError: (error) => {
      addToast({
        title: "Lỗi",
        description: `Không thể thêm người dùng`,
        color: "danger",
      });
    }
  });

  const updateUser = useMutation({
    mutationKey: ["updateUser"],
    mutationFn: ({ id, data }: { id: string, data: { name: string, email: string, role: string } }) => UpdateUser(id, data),
    onSuccess: () => {
      addToast({
        title: "Thành công",
        description: "Người dùng đã được cập nhật thành công",
        color: "success",
      });
    },
    onError: (error) => {
      addToast({
        title: "Lỗi",
        description: `Không thể cập nhật người dùng`,
        color: "danger",
      });
    }
  })

  const handleCloseModal = () => {
    setSelectedUser(null);
    onClose();
  }

  const onUpdateSubmit = (data: { name: string; email: string; role: string }) => {
    if (selectedUser) {
      updateUser.mutate({ id: selectedUser.id, data });
    } else {
      createUser.mutate(data);
    }
    handleCloseModal();
  }

  const handleDeleteSubmit = (userId: string) => {
    if (session?.user.id! === userId) {
      addToast({
        title: "Lỗi",
        description: "Bạn không thể xóa chính mình",
        color: "danger",
      });
      return;
    }
    deleteUser.mutate(userId);
    handleCloseModal();
  }

  const handleOpenModal = (type: "create" | "update", user: User | null) => {
    if (type === "update" && user) {
      setSelectedUser(user);
    } else {
      setSelectedUser(null);
    }
    onOpen();
  }

  useEffect(() => {
    if (selectedUser) {
      reset({
        name: selectedUser.name!,
        email: selectedUser.email!,
        role: selectedUser.role,
      });
    }
  }, [selectedUser, reset]);

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
          Thêm người dùng
        </Button>
      </div>
      <Table>
        <TableHeader>
          <TableColumn>Tên</TableColumn>
          <TableColumn>Email</TableColumn>
          <TableColumn>Vai trò</TableColumn>
          <TableColumn>Hành động</TableColumn>
        </TableHeader>
        <TableBody>
          {users.map((user) => (
            <TableRow key={user.id}>
              <TableCell>{user.name}</TableCell>
              <TableCell>{user.email}</TableCell>
              <TableCell>
                {user.role === "ADMIN" && (
                  <Chip variant="solid" color="primary">
                    Quản trị viên
                  </Chip>
                )}
                {user.role === "USER" && (
                  <Chip variant="solid" color="secondary">
                    Người dùng
                  </Chip>
                )}
              </TableCell>
              <TableCell>
                <Button isIconOnly variant="light" onPress={() => handleOpenModal("update", user)}>
                  <Icon icon="basil:edit-outline" />
                </Button>
                <Button isIconOnly variant="light" color="danger" onPress={() => handleDeleteSubmit(user.id)}>
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
            <h2 className="text-lg font-semibold">Thông tin người dùng</h2>
          </ModalHeader>
          <ModalBody className="p-4">
            <Form className="flex flex-col gap-4" onSubmit={handleSubmit(onUpdateSubmit)}>
              <Controller
                name="name"
                control={control}
                render={({ field }) => (
                  <Input {...field} label="Tên người dùng" />
                )}
              />
              <Controller
                name="email"
                control={control}
                render={({ field }) => (
                  <Input {...field} label="Email" type="email" />
                )}
              />
              <Controller
                name="role"
                control={control}
                render={({ field }) => (
                  <Select {...field} selectedKeys={[field.value]} label="Vai trò">
                    <SelectItem key="USER">Người dùng</SelectItem>
                    <SelectItem key="ADMIN">Quản trị viên</SelectItem>
                  </Select>
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

export default UsersTable;