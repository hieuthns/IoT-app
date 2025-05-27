"use client";

import { AQILevel, getOverallAQI, Metrics } from "@/lib/helper/aqiHandler";
import { GetLatestData } from "@/server/data";
import { Chip, Card, CardBody } from "@heroui/react";
import { Icon } from "@iconify/react";
import { useQuery } from "@tanstack/react-query";

interface MetricCardProps {
  title: string;
  value: number;
  unit?: string;
  icon?: string;
  level?: string;
}

const METRIC_LABELS: Record<string, { label: string; unit: string; icon?: string; }> = {
  NO2: { label: "Nitrogen Dioxide (NO₂)", unit: "ppb", icon: "lets-icons:cloud-duotone" },
  SO2: { label: "Sulfur Dioxide (SO₂)", unit: "ppb", icon: "lets-icons:cloud-duotone" },
  CO: { label: "Carbon Monoxide (CO)", unit: "ppm", icon: "lets-icons:cloud-duotone" },
  "PM2.5": { label: "PM2.5", unit: "µg/m³", icon: "material-symbols:air" },
  PM10: { label: "PM10", unit: "µg/m³", icon: "material-symbols:air" },
  T: { label: "Nhiệt độ", unit: "°C", icon: "solar:temperature-bold-duotone" },
  H: { label: "Độ ẩm", unit: "%", icon: "material-symbols-light:humidity-mid" },
}

const MetricCards: React.FC = () => {
  const { data } = useQuery({
    queryKey: ["metricsLatest"],
    queryFn: () => GetLatestData(),
    refetchInterval: 10000, // Refetch every 10 seconds
  });

  if (!data) {
    return <div>Loading...</div>;
  }

  const payload = JSON.parse(data[0]?.payload);

  const metrics = {
    NO2: payload.NO2,
    SO2: payload.SO2,
    CO: payload.CO,
    "PM2.5": payload["PM2.5"],
    PM10: payload.PM10,
    T: payload.T,
    H: payload.H,
  } as Metrics;

  const aqi = getOverallAQI(metrics);
  console.log("AQI:", aqi);

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
      <MetricCard title="AQI" value={aqi.overallAQI} level={aqi.level} />
      {Object.keys(METRIC_LABELS).map((key) => {
        const { label, unit, icon } = METRIC_LABELS[key];
        return (
          <MetricCard
            key={key}
            title={`${label}`}
            unit={unit}
            value={20}
            icon={icon}
            level={aqi.components.find((item) => item.metric === key)?.level} />
        );
      })}
    </div>
  )
}

const renderIcon = (icon: string, level?: string) => {
  return <Icon icon={icon} fontSize={24} className={level} />;
}

const renderAlert = (level: string) => {
  switch (level) {
    case AQILevel.GOOD:
      return <Chip className="bg-green-500">Tốt</Chip>
    case AQILevel.MODERATE:
      return <Chip className="bg-yellow-500">Trung bình</Chip>
    case AQILevel.UNHEALTHY_FOR_SENSITIVE_GROUPS:
      return <Chip className="bg-orange-500">Không tốt</Chip>
    case AQILevel.UNHEALTHY:
      return <Chip className="bg-red-500">Không tốt</Chip>
    case AQILevel.VERY_UNHEALTHY:
      return <Chip className="bg-purple-500 text-white">Rất không tốt</Chip>
    case AQILevel.HAZARDOUS:
      return <Chip className="bg-gray-500">Nguy hiểm</Chip>
    default:
      return <Chip className="bg-gray-300">Không xác định</Chip>;
  }
}

const MetricCard: React.FC<MetricCardProps> = (props) => {
  return (
    <Card>
      <CardBody className="p-4">
        <div className="flex items-center justify-between">
          <div className="flex flex-col gap-2">
            {props.icon && renderIcon(props.icon, props.level)}
            <p className="text-sm text-gray-500">{props.title}</p>
          </div>
          <div className="flex flex-col items-center gap-1">
            <h2 className="text-2xl font-bold mt-2">
              {props.value} {props.unit || ""}
            </h2>
            {props.level && renderAlert(props.level)}
          </div>
        </div>
      </CardBody>
    </Card>
  )
}

export default MetricCards;
