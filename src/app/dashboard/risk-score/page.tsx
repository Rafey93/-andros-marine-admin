import { getSmartGroups, getStudents, riskTrendData } from '@/lib/data';
import RiskScoreClient from './RiskScoreClient';

export default async function RiskScorePage() {
  const [students, smartGroups] = await Promise.all([getStudents(), getSmartGroups()]);
  return <RiskScoreClient students={students} smartGroups={smartGroups} riskTrendData={riskTrendData} />;
}
