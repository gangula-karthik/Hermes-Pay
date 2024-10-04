'use client';
import React from 'react';
import { DashboardNav } from '@/components/dashboard-nav';
import { navItems, PwidNavItems } from '@/constants/data';
import { cn } from '@/lib/utils';
import { ChevronLeft } from 'lucide-react';
import { useSidebar } from '@/hooks/useSidebar';
import Link from 'next/link';
import { GiLibertyWing } from "react-icons/gi";
import { Bird } from 'lucide-react';
import { signOut, useSession } from 'next-auth/react';

type SidebarProps = {
  className?: string;
};

export default function Sidebar({ className }: SidebarProps) {
  const { isMinimized, toggle } = useSidebar();
  const { data: session } = useSession();

  if (!session) return null; // Only render the sidebar if there is a session

  const handleToggle = () => {
    toggle();
  };

  const navItemsToDisplay = session.user?.email === 'demo@gmail.com' ? PwidNavItems : navItems;

  return (
    <aside
      className={cn(
        `relative  hidden h-screen flex-none border-r bg-card transition-[width] duration-500 md:block`,
        !isMinimized ? 'w-72' : 'w-[72px]',
        className
      )}
    >
      <div className="hidden p-5 pt-10 lg:block">
        <Link
          href={'https://github.com/gangula-karthik/Ideatecomm'}
          target="_blank"
        >
          {/* <GiLibertyWing className="text-4xl" /> */}
          <Bird className="text-4xl"/>
        </Link>
      </div>
      <ChevronLeft
        className={cn(
          'absolute -right-3 top-10 z-50  cursor-pointer rounded-full border bg-background text-3xl text-foreground',
          isMinimized && 'rotate-180'
        )}
        onClick={handleToggle}
      />
      <div className="space-y-4 py-4">
        <div className="px-3 py-2">
          <div className="mt-3 space-y-1">
            <DashboardNav items={navItemsToDisplay} />
          </div>
        </div>
      </div>
    </aside>
  );
}
