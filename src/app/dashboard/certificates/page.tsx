import { getCertificates } from '@/lib/data';
import CertificatesClient from './CertificatesClient';

export default async function CertificatesPage() {
  const certificates = await getCertificates();
  return <CertificatesClient certificates={certificates} />;
}
