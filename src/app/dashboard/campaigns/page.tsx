import { getCampaigns } from '@/lib/data';
import CampaignsClient from './CampaignsClient';

export default async function CampaignsPage() {
  const campaigns = await getCampaigns();
  return <CampaignsClient campaigns={campaigns} />;
}
