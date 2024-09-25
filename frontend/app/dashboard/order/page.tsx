import { Breadcrumbs } from '@/components/breadcrumbs';
import PageContainer from '@/components/layout/page-container';
import { Heading } from '@/components/ui/heading';
import { DocumentScannerCameraComponent } from '@/components/document-scanner-camera';

const breadcrumbItems = [
  { title: 'Dashboard', link: '/dashboard' },
  { title: 'Order', link: '/dashboard/order' }
];

export default function page() {
  return (
    <PageContainer>
      <div className="space-y-4">
        <Breadcrumbs items={breadcrumbItems} />
        <div className="flex items-start justify-between">
          <Heading title={`Order Now`} description="Manage tasks by dnd" />
        </div>
        <DocumentScannerCameraComponent/>
      </div>
    </PageContainer>
  );
}
