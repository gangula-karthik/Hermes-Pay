"use client";

import { Breadcrumbs } from '@/components/breadcrumbs';
import PageContainer from '@/components/layout/page-container';
import { Heading } from '@/components/ui/heading';
import { DocumentScannerCameraComponent } from '@/components/document-scanner-camera';
import { useRef } from 'react';
import {Button, ButtonGroup} from "@nextui-org/button";

const breadcrumbItems = [
  { title: 'Dashboard', link: '/dashboard' },
  { title: 'Order', link: '/dashboard/order' },
];

export default function Page() {
  const resultSectionRef = useRef<HTMLDivElement>(null); // Reference to the result section

  const scrollToResults = () => {
    if (resultSectionRef.current) {
      // Scroll to the results section smoothly
      resultSectionRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  return (
    <PageContainer>
      <div className="space-y-4 overflow-auto">
        <Breadcrumbs items={breadcrumbItems} />
        <div className="flex items-start justify-between">
          <Heading title={`Order Now`} description="Manage tasks by drag and drop" />
        </div>
        {/* Pass the scroll function as a prop */}
        <DocumentScannerCameraComponent onSuccess={scrollToResults} />
        {/* Scroll down to the result section when button is clicked */}
        <Button
          color="primary"
          variant="ghost"
          size="md"
          className="mt-4"
          onClick={() => {
            document.getElementById("resultSection")?.scrollIntoView({
              behavior: "smooth",
            });
          }}
        >
          Scroll to Results
        </Button>
      </div>
      {/* Result section to scroll to */}
      <div ref={resultSectionRef} id="resultSection" className="mt-6">
        <p>Results will be displayed here after successful upload...</p>
      </div>
    </PageContainer>
  );
}
