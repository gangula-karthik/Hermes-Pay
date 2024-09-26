"use client";

import React from "react";
import { Breadcrumbs } from '@/components/breadcrumbs';
import PageContainer from '@/components/layout/page-container';
import { Heading } from '@/components/ui/heading';
import FoodCard from '@/components/FoodCard';

// Breadcrumb data
const breadcrumbItems = [
  { title: 'Dashboard', link: '/dashboard' },
  { title: 'Kanban', link: '/dashboard/kanban' }
];

// Example food item data
const foodItems = [
  {
    name: "Cheeseburger",
    image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTENYnRh013tE7LrJCY-j0pTDFoJzJZtAx8qw&s",
    price: "$5.99",
  },
  {
    name: "Pizza",
    image: "https://cdn.shopify.com/s/files/1/0274/9503/9079/files/20220211142754-margherita-9920_5a73220e-4a1a-4d33-b38f-26e98e3cd986.jpg?v=1723650067",
    price: "$7.99",
  },
  {
    name: "Salad",
    image: "https://cdn.shopify.com/s/files/1/0274/9503/9079/files/20220211142754-margherita-9920_5a73220e-4a1a-4d33-b38f-26e98e3cd986.jpg?v=1723650067",
    price: "$4.99",
  },
  {
    name: "Fries",
    image: "https://cdn.shopify.com/s/files/1/0274/9503/9079/files/20220211142754-margherita-9920_5a73220e-4a1a-4d33-b38f-26e98e3cd986.jpg?v=1723650067",
    price: "$2.99",
  }
];

export default function Page() {
  return (
    <PageContainer>
      <div className="space-y-6">
        <Breadcrumbs items={breadcrumbItems} />
        <div className="flex items-start justify-between">
          <Heading title="Kanban" description="Manage tasks by drag and drop" />
        </div>

        {/* Map over foodItems and render FoodCard for each */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {foodItems.map((foodItem) => (
            <div key={foodItem.name} className="w-full">
              <FoodCard foodItem={foodItem} />
            </div>
          ))}
        </div>
      </div>
    </PageContainer>
  );
}