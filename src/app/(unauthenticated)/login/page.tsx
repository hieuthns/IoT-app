"use client";

import { addToast, Button, Card, CardBody, Form, Input } from "@heroui/react";
import { Controller, useForm } from "react-hook-form";
import { Icon } from "@iconify/react";
import { signIn, signOut } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

interface LoginFormValues {
  email: string;
  password: string;
}

const LoginPage: React.FC = () => {
  const router = useRouter();
  
  const { handleSubmit, control } = useForm<LoginFormValues>({
    defaultValues: {
      email: "",
      password: ""
    },
  });

  // useEffect(() => {
  //   signOut();
  //   // eslint-disable-next-line react-hooks/exhaustive-deps
  // }, []);

  const onSubmit = async (data: LoginFormValues) => {
    const result = await signIn("credentials", {
      redirect: false,
      email: data.email,
      password: data.password
    });

    if (result?.ok) {
      router.push("/home");
    } else {
      addToast({
        title: "Đăng nhập thất bại",
        description: "Vui lòng kiểm tra lại email và mật khẩu của bạn.",
        color: "danger",
      })
    }
  };

  return (
    <div className="h-screen w-screen flex items-center justify-center">
      <Card className="max-w-[500px] min-w-[300px]">
        <CardBody className="flex flex-col gap-4 max-w-[500px]">
          <div className="flex items-center gap-2 w-full justify-center">
            <Icon icon="eos-icons:iot" fontSize={32} className="text-primary" />
          </div>
          <Form className="flex flex-col gap-4" onSubmit={handleSubmit(onSubmit)}>
            <Controller
              control={control}
              name="email"
              render={({ field }) => (
                <Input {...field} label="Email" />
              )}
            />
            <Controller
              control={control}
              name="password"
              render={({ field }) => (
                <Input type="password" {...field} label="Mật khẩu" />
              )}
            />
            <Button type="submit" color="primary" className="w-full">Đăng nhập</Button>
          </Form>
        </CardBody>
      </Card>
    </div>
  )
}

export default LoginPage;