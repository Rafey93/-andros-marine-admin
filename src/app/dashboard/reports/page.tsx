import { getChartData } from '@/lib/data';
import ReportsClient from './ReportsClient';

export default async function ReportsPage() {
  const chartData = await getChartData();
  return <ReportsClient chartData={chartData} />;
}
