import { NavItem } from '@/types';

export const navItems: NavItem[] = [
  {
    title: 'Dashboard',
    href: '/dashboard',
    icon: 'dashboard',
    label: 'Dashboard'
  },
  {
    title: 'PWID Users',
    href: '/dashboard/user',
    icon: 'user',
    label: 'user'
  },
  {
    title: 'Login',
    href: '/',
    icon: 'login',
    label: 'login'
  }
];


export const PwidNavItems: NavItem[] = [
  {
    title: 'Orders',
    href: '/dashboard/order',
    icon: 'utensils',
    label: 'Order'
  },
  {
    title: 'Login',
    href: '/',
    icon: 'login',
    label: 'login'
  }
];
