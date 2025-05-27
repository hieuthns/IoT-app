"use client";

import {
  Card,
  CardBody,
  DateRangePicker,
  Select,
  SelectItem
} from "@heroui/react";
import { useState, useMemo } from "react";
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";
import { parseDate } from "@internationalized/date";
import { useQuery } from "@tanstack/react-query";
import { GetPeriodData } from "@/server/data";
import { useDateFormatter } from "@react-aria/i18n";

const METRICS = ["NO2", "SO2", "CO", "PM2.5", "PM10", "T", "H"];

type SensorData = {
  NO2: number;
  SO2: number;
  CO: number;
  "PM2.5": number;
  PM10: number;
  T: number;
  H: number;
  timestamp: string;
};

const HistoryChart: React.FC = () => {
  const [metric, setMetric] = useState<string>(METRICS[0]);

  const today = new Date();
  const initialStartDate = new Date(today);
  initialStartDate.setDate(today.getDate() - 3);
  const initialEndDate = new Date(today);
  initialEndDate.setDate(today.getDate() + 1);

  const [value, setValue] = useState({
    start: parseDate(initialStartDate.toISOString().split("T")[0]),
    end: parseDate(initialEndDate.toISOString().split("T")[0]),
  });

  const { data, isLoading } = useQuery({
    queryKey: ["historyData", metric, value.start.toString(), value.end.toString()],
    queryFn: () =>
      GetPeriodData(
        new Date(value.start.toString()),
        new Date(value.end.toString())
      ),
    enabled: !!(value.start && value.end),
  });

  const formatter = useDateFormatter({ dateStyle: "short", timeStyle: "medium" });

  const chartData = useMemo(() => {
    if (!data) return [];
    return (data).map((entry) => {
      const timestamp = new Date(entry.timestamp);
      const parsedData = JSON.parse(entry.payload);
      return {
        timestamp: formatter.format(timestamp),
        value: parsedData[metric] ?? null
      };
    });
  }, [data, metric, formatter]);

  console.log("Chart Data:", chartData);

  return (
    <Card className="flex flex-col w-full">
      <CardBody>
        <div className="flex gap-4 items-center mb-4">
          <DateRangePicker
            className="w-full"
            label="Chọn khoảng thời gian"
            value={value}
            onChange={(range) => {
              if (range) setValue(range);
            }}
          />
          <Select
            label="Chọn chỉ số"
            selectedKeys={[metric]}
            onSelectionChange={(keys) => setMetric(Array.from(keys)[0] as string)}
          >
            {METRICS.map((m) => (
              <SelectItem key={m}>{m}</SelectItem>
            ))}
          </Select>
        </div>

        <div style={{ height: 300 }}>
          <ResponsiveContainer>
            <AreaChart data={chartData} height={300}>
              <XAxis dataKey="timestamp" tick={{ fontSize: 12 }} />
              <YAxis />
              <Tooltip />
              <Area
                type="monotone"
                dataKey="value"
                stroke="#3182CE"
                fill="#BEE3F8"
                strokeWidth={3}
                dot={false}
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </CardBody>
    </Card>
  );
};

export default HistoryChart;
