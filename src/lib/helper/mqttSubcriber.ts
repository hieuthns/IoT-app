import mqtt from 'mqtt';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

const MQTT_BROKER_URL = 'mqtts://4a722156d4e344c4b9484807b4d27f5f.s1.eu.hivemq.cloud';
const MQTT_USERNAME = "benkyoushimashou";
const MQTT_PASSWORD = "Benkyoushimashou123";
const TOPIC = 'device/data';

const client = mqtt.connect(MQTT_BROKER_URL, {
  username: MQTT_USERNAME,
  password: MQTT_PASSWORD,
  port: 8883,
  protocol: 'mqtts',
});

client.on('connect', () => {
  console.log(`MQTT connected. Subscribing to topic: ${TOPIC}`);
  client.subscribe(TOPIC);
});

client.on('message', async (topic, message) => {
  const payload = message.toString();
  console.log(`Received on ${topic}: ${payload}`);

  try {
    await prisma.deviceData.create({
      data: {
        payload: payload,
      }
    })
    console.log('Saved to DB');
  } catch (err) {
    console.error('Error saving to DB:', err);
  }
});
