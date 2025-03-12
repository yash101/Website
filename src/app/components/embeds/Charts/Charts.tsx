'use client';

import { ChartData, ChartTypeRegistry } from 'chart.js';
import dynamic from 'next/dynamic';

const Chart = dynamic(
  async () => (await import('react-chartjs-2')).Chart,
  { ssr: false }
);

export interface ChartEmbedProps {
  type: keyof ChartTypeRegistry;
  data: ChartData;
  options: object;
  enableEditor?: boolean;
  source?: string;
  sourceUrl?: string;
}

const ChartEmbed: React.FC<ChartEmbedProps> = ({
  type,
  data,
}) => {
  return (
    <Chart type={type} data={data} />
  );
}

export default ChartEmbed;
