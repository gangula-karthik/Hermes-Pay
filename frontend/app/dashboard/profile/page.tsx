import { Breadcrumbs } from '@/components/breadcrumbs';
import { CreateProfileOne } from '@/components/forms/user-profile-stepper/create-profile';
import PageContainer from '@/components/layout/page-container';
import { Heading } from '@/components/ui/heading';
import UserEditor from '@/hooks/user-editor';

const breadcrumbItems = [
  { title: 'Dashboard', link: '/dashboard' },
  { title: 'PWID Parental Controls', link: '/dashboard/profile' }
];
export default function page() {
  return (
    <PageContainer scrollable={true}>
      <div className="space-y-4">
        <Breadcrumbs items={breadcrumbItems} />
        <div className="flex items-start justify-between space-x-4">
          <Heading title="PWID Parental Controls" description="Set limits and rules on spending" />
        </div>
      <UserEditor/>
      </div>
    </PageContainer>
  );
}
