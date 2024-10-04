"use client";

import { Breadcrumbs } from '@/components/breadcrumbs';
import PageContainer from '@/components/layout/page-container';
import { Heading } from '@/components/ui/heading';
import { DocumentScannerCameraComponent } from '@/components/document-scanner-camera';
import { useRef, useState } from 'react';
import FoodCard from '@/components/FoodCard';
import { FoodOrderAccessibleAi } from '@/components/food-order-accessible-ai';

const breadcrumbItems = [
  { title: 'Dashboard', link: '/dashboard' },
  { title: 'Order', link: '/dashboard/order' },
];

type FoodItem = {
  name: string;
  image: string;
  price: string;
};

export default function Page() {
  const resultSectionRef = useRef<HTMLDivElement>(null);
  const [foodItems, setFoodItems] = useState<FoodItem[]>([]);
  const [selectedItems, setSelectedItems] = useState<FoodItem[]>([]);

  const scrollToResults = () => {
    if (resultSectionRef.current) {
      resultSectionRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  const handleFoodItemSelection = (item: FoodItem, isSelected: boolean) => {
    if (isSelected) {
      setSelectedItems(prev => [...prev, item]);
    } else {
      setSelectedItems(prev => prev.filter(i => i.name !== item.name));
    }
  };

  return (
    <PageContainer>
      <div className="space-y-4 overflow-auto">
        <Breadcrumbs items={breadcrumbItems} />
        <div className="flex items-start justify-between">
          <Heading title={`Order Now`} description="Quick and Seamless Ordering" />
        </div>
        <DocumentScannerCameraComponent onSuccess={scrollToResults} setFoodItems={setFoodItems} />
      </div>
      <div ref={resultSectionRef} id="resultSection" className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mt-20 justify-items-center">
        {foodItems.map((foodItem, index) => (
          <div key={index} className="mt-3 w-full flex justify-center">
            <FoodCard foodItem={foodItem} onSelect={handleFoodItemSelection} />
          </div>
        ))}
      </div>
      <div className="flex flex-col items-end mt-4">
        {selectedItems.length > 0 && <FoodOrderAccessibleAi foodOrder={selectedItems} menu={foodItems} />}
      </div>
    </PageContainer>
  );
}