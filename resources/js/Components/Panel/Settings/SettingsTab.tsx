import { Button } from '@/Components/ui/Button';
import { Card, CardBody, CardHeader } from '@/Components/ui/Card';
import { Input } from '@/Components/ui/Input';
import { Label } from '@/Components/ui/Label';
import { Textarea } from '@/Components/ui/Textarea';
import { UserProfile } from '../types';
import { Globe, Search, BarChart3, Lock, Check, AtSign } from 'lucide-react';
import React from 'react';

interface SettingsTabProps {
  user: UserProfile;
  onUpdateUser: (updates: Partial<UserProfile>) => void;
}

export const SettingsTab: React.FC<SettingsTabProps> = ({ user, onUpdateUser }) => {
  const handleName = user.handle.startsWith('@') ? user.handle.substring(1) : user.handle;

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500 pb-32">
      
      {/* URL / Handle Configuration */}
      <Card padding="none">
        <CardHeader
          icon={<AtSign size={24} />}
          iconBg="bg-orange-50 dark:bg-orange-900/30"
          iconColor="text-orange-600 dark:text-orange-400"
          title="My Linkea Name"
          subtitle="Claim your unique URL handle."
        />
        <CardBody className="space-y-6">
            <div className="space-y-2">
                <Label htmlFor="username">Username</Label>
                <div className="relative">
                    {/* Validation icon inside input */}
                    <div className="absolute top-1/2 -translate-y-1/2 left-4 text-green-500">
                        <Check size={18} strokeWidth={3} />
                    </div>
                    <input 
                        id="username"
                        type="text" 
                        value={handleName}
                        onChange={(e) => onUpdateUser({ handle: `@${e.target.value}` })}
                        className="w-full bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-700 rounded-xl pl-11 pr-4 py-3 font-bold text-neutral-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 transition-all placeholder-neutral-300 dark:placeholder-neutral-600"
                        placeholder="username"
                    />
                </div>
                {/* Helper Text */}
                <div className="flex justify-between px-1">
                     <p className="text-xs text-neutral-400 dark:text-neutral-500">linkea.ar/<span className="font-bold text-neutral-600 dark:text-neutral-300">{handleName}</span></p>
                     <p className="text-xs font-bold text-green-600 dark:text-green-400 flex items-center gap-1">
                        Available
                     </p>
                </div>
            </div>
        </CardBody>
      </Card>

      {/* General Settings */}
      <Card padding="none">
          <CardHeader
            icon={<Globe size={24} />}
            iconBg="bg-blue-50 dark:bg-blue-900/30"
            iconColor="text-blue-600 dark:text-blue-400"
            title="General Options"
            subtitle="Manage how your page appears in browsers."
          />
          
          <CardBody className="space-y-6">
            <div className="space-y-2">
                <Label htmlFor="seo-title" hint="(SEO)">Landing Page Title</Label>
                <div className="relative">
                    <Search className="absolute top-1/2 -translate-y-1/2 left-4 text-neutral-400" size={18} />
                    <input 
                        id="seo-title"
                        type="text" 
                        value={user.seoTitle || ''}
                        onChange={(e) => onUpdateUser({ seoTitle: e.target.value })}
                        className="w-full bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-700 rounded-xl pl-11 pr-4 py-3 font-medium text-neutral-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 transition-all placeholder:text-neutral-400"
                        placeholder="e.g. My Official Links"
                    />
                </div>
                <p className="text-xs text-neutral-400 dark:text-neutral-500">This is what appears on the Google search tab.</p>
            </div>

            <Textarea 
                id="seo-description"
                label="Meta Description"
                value={user.seoDescription || ''}
                onChange={(e) => onUpdateUser({ seoDescription: e.target.value })}
                rows={2}
                placeholder="A brief description of your page for search engines..."
            />
          </CardBody>
      </Card>

      {/* Analytics & Integrations */}
      <Card padding="none">
          <CardHeader
            icon={<BarChart3 size={24} />}
            iconBg="bg-green-50 dark:bg-green-900/30"
            iconColor="text-green-600 dark:text-green-400"
            title="Analytics & Pixels"
            subtitle="Track your visitors with external tools."
          />

          <CardBody className="space-y-6">
            <div className="grid md:grid-cols-2 gap-6">
                <Input 
                    id="ga-id"
                    type="text" 
                    label="Google Analytics ID"
                    value={user.googleAnalyticsId || ''}
                    onChange={(e) => onUpdateUser({ googleAnalyticsId: e.target.value })}
                    className="font-mono text-sm"
                    placeholder="UA-XXXXXXXX-X"
                />
                <Input 
                    id="fb-pixel"
                    type="text" 
                    label="Facebook Pixel ID"
                    value={user.facebookPixelId || ''}
                    onChange={(e) => onUpdateUser({ facebookPixelId: e.target.value })}
                    className="font-mono text-sm"
                    placeholder="123456789012345"
                />
            </div>
          </CardBody>
      </Card>
      
      {/* Danger Zone */}
      <div className="border border-red-100 dark:border-red-900/50 bg-red-50/30 dark:bg-red-900/10 rounded-[32px] p-6 flex items-center justify-between">
            <div className="flex items-center gap-4">
                <div className="p-3 bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400 rounded-full">
                    <Lock size={20} />
                </div>
                <div>
                    <h3 className="font-bold text-red-900 dark:text-red-300">Private Profile</h3>
                    <p className="text-xs text-red-700/60 dark:text-red-400/60">Hide your profile from search engines.</p>
                </div>
            </div>
            <Button variant="outline" size="sm" className="border-red-200 dark:border-red-800 text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20">
                Configure
            </Button>
      </div>

    </div>
  );
};