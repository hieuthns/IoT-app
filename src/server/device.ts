"use server";

import { PrismaClient } from "@prisma/client";
import mqtt from "mqtt";
import { revalidatePath } from "next/cache";

export async function GetDevices() {
  const prisma = new PrismaClient();

  try {
    const devices = await prisma.device.findMany();
    return devices;
  } catch (error) {
    throw new Error("Failed to fetch users");
  }
}

export async function UpdateDevice(id: string, data: { name: string; topic: string }) {
  const prisma = new PrismaClient();

  try {
    await prisma.device.update({
      where: { id },
      data: {
        name: data.name,
        topic: data.topic,
      },
    });
    revalidatePath("/device");
  } catch (error) {
    console.log(error);
    throw new Error("Failed to update device");
  }
}

export async function DeleteDevice(id: string) {
  const prisma = new PrismaClient();

  try {
    await prisma.device.delete({
      where: { id },
    });
    revalidatePath("/device");
  } catch (error) {
    throw new Error("Failed to delete device");
  }
}

export async function CreateDevice(data: { name: string; topic: string }) {
  const prisma = new PrismaClient();

  try {
    await prisma.device.create({
      data: {
        name: data.name,
        topic: data.topic,
      },
    });
    revalidatePath("/device");
  } catch (error) {
    throw new Error("Failed to create device");
  }
}

function sendMQTTMessage(topic: string, payload: string) {
  const mqttBrokerUrl = process.env.NEXT_PUBLIC_MQTT_BROKER_URL as string;
  console.log("MQTT Broker URL:", mqttBrokerUrl);
  const client = mqtt.connect(mqttBrokerUrl, {
    username: process.env.NEXT_PUBLIC_MQTT_USERNAME,
    password: process.env.NEXT_PUBLIC_MQTT_PASSWORD,
    port: 8883,
    protocol: "mqtts",
  });

  client.on("connect", () => {
    console.log(`MQTT connected. Publishing to topic: ${topic}`);
    client.publish(topic, payload, { qos: 1 }, (error) => {
      if (error) {
        console.error("Failed to publish message:", error);
      } else {
        console.log("Message published successfully");
      }
      client.end();
    });
  });
}

export async function SwitchDevice(id: string) {
  const prisma = new PrismaClient();

  try {
    const device = await prisma.device.findUnique({
      where: { id },
    });

    if (!device) {
      throw new Error("Device not found");
    }

    const newStatus = device.currentStatus === "on" ? "off" : "on";

    await prisma.device.update({
      where: { id },
      data: { currentStatus: newStatus },
    });

    console.log(`Switching device ${device.topic} to ${newStatus}`);
    let payload = newStatus === "on" ? "1" : "0";
    sendMQTTMessage(device.topic, payload);
    revalidatePath("/device");
  } catch (error) {
    console.log(error);
    throw new Error("Failed to switch device status");
  }
}