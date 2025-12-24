import React from 'react';
import { TrendingUp, MousePointer2, Users } from 'lucide-react';

export const StatsBento = () => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
      {/* Total Views */}
      <div className="bg-neutral-900 text-white p-6 rounded-3xl relative overflow-hidden group">
         <div className="absolute top-0 right-0 p-32 bg-neutral-800/50 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2"></div>
         
         <div className="relative z-10 flex justify-between items-start mb-8">
            <div className="p-2 bg-neutral-800 rounded-xl">
                <Users size={20} className="text-brand-500" />
            </div>
            <span className="text-xs font-medium text-neutral-400 bg-neutral-800 px-2 py-1 rounded-lg">+12%</span>
         </div>
         
         <div className="relative z-10">
            <h3 className="text-3xl font-bold tracking-tight mb-1">24.5k</h3>
            <p className="text-sm text-neutral-400">Total Views</p>
         </div>
      </div>

      {/* CTR */}
      <div className="bg-white dark:bg-neutral-900 p-6 rounded-3xl border border-neutral-200 dark:border-neutral-800 shadow-sm hover:shadow-md transition-shadow">
         <div className="flex justify-between items-start mb-8">
            <div className="p-2 bg-brand-50 dark:bg-brand-900/30 rounded-xl">
                <MousePointer2 size={20} className="text-brand-500" />
            </div>
            <span className="text-xs font-medium text-green-600 dark:text-green-400 bg-green-50 dark:bg-green-900/30 px-2 py-1 rounded-lg">+2.4%</span>
         </div>
         <h3 className="text-3xl font-bold text-neutral-900 dark:text-white tracking-tight mb-1">18.2%</h3>
         <p className="text-sm text-neutral-500 dark:text-neutral-400">Click Rate (CTR)</p>
      </div>

      {/* Performance Score */}
      <div className="bg-white dark:bg-neutral-900 p-6 rounded-3xl border border-neutral-200 dark:border-neutral-800 shadow-sm hover:shadow-md transition-shadow relative overflow-hidden">
         <div className="absolute -right-4 -bottom-4 opacity-10 text-brand-500">
             <TrendingUp size={120} />
         </div>
         <div className="flex justify-between items-start mb-8">
            <div className="p-2 bg-neutral-100 dark:bg-neutral-800 rounded-xl">
                <TrendingUp size={20} className="text-neutral-900 dark:text-white" />
            </div>
         </div>
         <h3 className="text-3xl font-bold text-neutral-900 dark:text-white tracking-tight mb-1">A+</h3>
         <p className="text-sm text-neutral-500 dark:text-neutral-400">SEO Score</p>
      </div>
    </div>
  );
};
