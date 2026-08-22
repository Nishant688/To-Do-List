import React from 'react';
import { Outlet } from 'react-router-dom';
import { Sidebar } from './Sidebar';
import { MobileNav } from './MobileNav';

export const AppLayout = () => {
  return (
    <div className="min-h-screen bg-[#FAFAFC] dark:bg-[#0F172A] flex flex-col lg:flex-row">

      <div className="hidden lg:block sticky top-0 h-screen">
        <Sidebar />
      </div>

      <MobileNav />

      <main className="flex-1 max-w-5xl w-full mx-auto px-4 sm:px-6 lg:px-10 py-8 lg:py-10">
        <Outlet />
      </main>
    </div>
  );
};
