"use client";

import React from "react";
import { Breadcrumbs } from '@/components/breadcrumbs';
import PageContainer from '@/components/layout/page-container';
import { Heading } from '@/components/ui/heading';
import { FamilyManager } from '@/components/family-manager'


// Breadcrumb data
const breadcrumbItems = [
  { title: 'Dashboard', link: '/dashboard' },
  { title: 'PWID User Management', link: '/dashboard/user' }
];

export default function Page() {
  return (
    <PageContainer>
      <div className="space-y-8">
        <Breadcrumbs items={breadcrumbItems} />
        <div className="flex items-start justify-between space-x-4">
          <Heading title="PWID User Management" description="Manage different users in your family" />
        </div>
        <div className="mt-8">
          <FamilyManager/>
        </div>
      </div>
    </PageContainer>
  );
}