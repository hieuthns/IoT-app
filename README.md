# Hướng dẫn

1. Tạo file `.env` và cung cấp các trường sau

```text
DATABASE_URL="postgresql://postgres:postgres@127.0.0.1:5432/postgres?schema=public"

NEXTAUTH_URL="http://localhost:4000"
NEXTAUTH_SECRET="il5px+sO4JKWbhSWJiQKpKq3jX1BXEhaK2XOqA4c7vM="

NEXT_PUBLIC_MQTT_BROKER_URL="mqtts://4a722156d4e344c4b9484807b4d27f5f.s1.eu.hivemq.cloud"
NEXT_PUBLIC_MQTT_USERNAME="devicemanager"
NEXT_PUBLIC_MQTT_PASSWORD="Devicemanager123"
```

2. Mở Docker
3. Chạy `docker compose up -d`
4. Truy cập `http://localhost:5555` vào bảng `User` tạo 1 tài khoản
5. Truy cập `http://localhost:4000` và đăng nhập vào ứng dụng