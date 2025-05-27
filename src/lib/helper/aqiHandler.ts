export enum AQILevel {
  GOOD = "GOOD",
  MODERATE = "MODERATE",
  UNHEALTHY_FOR_SENSITIVE_GROUPS = "UNHEALTHY_FOR_SENSITIVE_GROUPS",
  UNHEALTHY = "UNHEALTHY",
  VERY_UNHEALTHY = "VERY_UNHEALTHY",
  HAZARDOUS = "HAZARDOUS",
}

export type Metrics = {
  NO2: number,
  SO2: number,
  CO: number,
  "PM2.5": number,
  PM10: number,
  T: number,
  H: number,
};

export type AQIBreakpoint = {
  concentrationLow: number,
  concentrationHigh: number,
  indexLow: number,
  indexHigh: number
}

export type AQIResult = {
  metric: string,
  value: number,
  aqi: number,
  level: AQILevel
};

const PM25_BREAKPOINTS: AQIBreakpoint[] = [
  { concentrationLow: 0.0, concentrationHigh: 12.0, indexLow: 0, indexHigh: 50 },
  { concentrationLow: 12.1, concentrationHigh: 35.4, indexLow: 51, indexHigh: 100 },
  { concentrationLow: 35.5, concentrationHigh: 55.4, indexLow: 101, indexHigh: 150 },
  { concentrationLow: 55.5, concentrationHigh: 150.4, indexLow: 151, indexHigh: 200 },
  { concentrationLow: 150.5, concentrationHigh: 250.4, indexLow: 201, indexHigh: 300 },
  { concentrationLow: 250.5, concentrationHigh: 500.4, indexLow: 301, indexHigh: 500 }
];

const PM10_BREAKPOINTS: AQIBreakpoint[] = [
  { concentrationLow: 0, concentrationHigh: 54, indexLow: 0, indexHigh: 50 },
  { concentrationLow: 55, concentrationHigh: 154, indexLow: 51, indexHigh: 100 },
  { concentrationLow: 155, concentrationHigh: 254, indexLow: 101, indexHigh: 150 },
  { concentrationLow: 255, concentrationHigh: 354, indexLow: 151, indexHigh: 200 },
  { concentrationLow: 355, concentrationHigh: 424, indexLow: 201, indexHigh: 300 },
  { concentrationLow: 425, concentrationHigh: 604, indexLow: 301, indexHigh: 500 }
];

const CO_BREAKPOINTS: AQIBreakpoint[] = [
  { concentrationLow: 0.0, concentrationHigh: 4.4, indexLow: 0, indexHigh: 50 },
  { concentrationLow: 4.5, concentrationHigh: 9.4, indexLow: 51, indexHigh: 100 },
  { concentrationLow: 9.5, concentrationHigh: 12.4, indexLow: 101, indexHigh: 150 },
  { concentrationLow: 12.5, concentrationHigh: 15.4, indexLow: 151, indexHigh: 200 },
  { concentrationLow: 15.5, concentrationHigh: 30.4, indexLow: 201, indexHigh: 300 },
  { concentrationLow: 30.5, concentrationHigh: 50.4, indexLow: 301, indexHigh: 500 }
];

const SO2_BREAKPOINTS: AQIBreakpoint[] = [
  { concentrationLow: 0, concentrationHigh: 35, indexLow: 0, indexHigh: 50 },
  { concentrationLow: 36, concentrationHigh: 75, indexLow: 51, indexHigh: 100 },
  { concentrationLow: 76, concentrationHigh: 185, indexLow: 101, indexHigh: 150 },
  { concentrationLow: 186, concentrationHigh: 304, indexLow: 151, indexHigh: 200 },
  { concentrationLow: 305, concentrationHigh: 604, indexLow: 201, indexHigh: 300 },
  { concentrationLow: 605, concentrationHigh: 1004, indexLow: 301, indexHigh: 500 }
];

const NO2_BREAKPOINTS: AQIBreakpoint[] = [
  { concentrationLow: 0, concentrationHigh: 53, indexLow: 0, indexHigh: 50 },
  { concentrationLow: 54, concentrationHigh: 100, indexLow: 51, indexHigh: 100 },
  { concentrationLow: 101, concentrationHigh: 360, indexLow: 101, indexHigh: 150 },
  { concentrationLow: 361, concentrationHigh: 649, indexLow: 151, indexHigh: 200 },
  { concentrationLow: 650, concentrationHigh: 1249, indexLow: 201, indexHigh: 300 },
  { concentrationLow: 1250, concentrationHigh: 2049, indexLow: 301, indexHigh: 500 }
];

export function calculateAQIComponent(value: number, breakpoints: AQIBreakpoint[]): number {
  for (const bp of breakpoints) {
    if (value >= bp.concentrationLow && value <= bp.concentrationHigh) {
      return (
        ((bp.indexHigh - bp.indexLow) / (bp.concentrationHigh - bp.concentrationLow)) *
          (value - bp.concentrationLow) +
        bp.indexLow
      );
    }
  }
  return -1;
}

function getAQILevel(aqi: number): AQILevel {
  if (aqi <= 50) return AQILevel.GOOD;
  if (aqi <= 100) return AQILevel.MODERATE;
  if (aqi <= 150) return AQILevel.UNHEALTHY_FOR_SENSITIVE_GROUPS;
  if (aqi <= 200) return AQILevel.UNHEALTHY;
  if (aqi <= 300) return AQILevel.VERY_UNHEALTHY;
  return AQILevel.HAZARDOUS;
}

export function getOverallAQI(metrics: Metrics) {
  const results: AQIResult[] = [];

  const pollutants = [
    { key: "PM2.5", value: metrics["PM2.5"], breakpoints: PM25_BREAKPOINTS },
    { key: "PM10", value: metrics.PM10, breakpoints: PM10_BREAKPOINTS },
    { key: "CO", value: metrics.CO, breakpoints: CO_BREAKPOINTS },
    { key: "SO2", value: metrics.SO2, breakpoints: SO2_BREAKPOINTS },
    { key: "NO2", value: metrics.NO2, breakpoints: NO2_BREAKPOINTS }
  ];

  for (const { key, value, breakpoints } of pollutants) {
    const aqi = calculateAQIComponent(value, breakpoints);
    if (aqi >= 0) {
      results.push({
        metric: key,
        value,
        aqi,
        level: getAQILevel(aqi)
      });
    }
  }

  const dominant = results.reduce((max, cur) => (cur.aqi > max.aqi ? cur : max));

  return {
    overallAQI: Math.round(dominant.aqi),
    dominantMetric: dominant.metric,
    level: dominant.level,
    components: results
  };
}
