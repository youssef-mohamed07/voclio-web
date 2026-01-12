import Link from 'next/link';
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import { ROUTES } from '@/lib/constants';

export default function AdminNotFound() {
  return (
    <div className="flex items-center justify-center min-h-[400px]">
      <Card className="max-w-md text-center">
        <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <svg className="w-6 h-6 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        </div>
        <h2 className="text-lg font-semibold text-gray-900 mb-2">Page Not Found</h2>
        <p className="text-gray-500 mb-4">The page you&apos;re looking for doesn&apos;t exist or has been moved.</p>
        <Link href={ROUTES.DASHBOARD}>
          <Button>Back to Dashboard</Button>
        </Link>
      </Card>
    </div>
  );
}
