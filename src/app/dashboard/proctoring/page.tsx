import { getExamSessions } from '@/lib/data';
import ProctoringClient from './ProctoringClient';

export default async function ProctoringPage() {
  const sessions = await getExamSessions();
  return <ProctoringClient initialSessions={sessions} />;
}
