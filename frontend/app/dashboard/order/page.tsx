"use client";

import { Breadcrumbs } from '@/components/breadcrumbs';
import PageContainer from '@/components/layout/page-container';
import { Heading } from '@/components/ui/heading';
import { DocumentScannerCameraComponent } from '@/components/document-scanner-camera';
import { useRef, useState } from 'react';
import { Button } from "@nextui-org/button";
import FoodCard from '@/components/FoodCard';

const breadcrumbItems = [
  { title: 'Dashboard', link: '/dashboard' },
  { title: 'Order', link: '/dashboard/order' },
];

export default function Page() {
  const resultSectionRef = useRef<HTMLDivElement>(null);
  const [foodItems, setFoodItems] = useState<any[]>([]); // Initially empty array for food items

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
          <Heading title={`Order Now`} description="Quick and Seamless Ordering" />
        </div>
        {/* Pass the scroll function and setFoodItems to DocumentScannerCameraComponent */}
        <DocumentScannerCameraComponent onSuccess={scrollToResults} setFoodItems={setFoodItems} />
      </div>
      {/* Result section to scroll to */}
      <div ref={resultSectionRef} id="resultSection" className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mt-20 justify-items-center">
        {foodItems.map((foodItem) => (
          <div key={foodItem.name} className="mt-3 w-full flex justify-center">
            <FoodCard foodItem={foodItem} />
          </div>
        ))}
      </div>
      {foodItems.length > 0 && <div className="flex justify-end mt-4"><Button>Pay Now</Button></div>}
    </PageContainer>
  );
}
