import React, { useState } from 'react';
import { Logo } from './Logo';
import { AriServerConfig, User } from '../types';
import {
  LayoutDashboard,
  Egg,
  Receipt,
  Package,
  CircleDollarSign,
  Building2,
  Server,
  User as UserIcon,
  LogIn,
  Menu,
  X,
  Sparkles,
  Cloud,
  ChevronDown,
  LogOut,
  ShieldCheck,
  Zap,
  Database,
  Sliders
} from 'lucide-react';

interface NavbarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  currentUser: User | null;
  onOpenAuth: () => void;
  onOpenServerSync: () => void;
  serverConfig: AriServerConfig;
}

export const Navbar: React.FC<NavbarProps> = ({
  activeTab,
  setActiveTab,
  currentUser,
  onOpenAuth,
  onOpenServerSync,
  serverConfig,
}) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const navCategories = [
    {
      category: 'Farm Operations',
      items: [
        { id: 'dashboard', label: 'ภาพรวมฟาร์ม', icon: LayoutDashboard, badge: 'Live' },
        { id: 'production', label: 'บันทึกผลผลิตไข่', icon: Egg },
        { id: 'sales', label: 'การขาย & ออกบิล', icon: Receipt },
        { id: 'inventory', label: 'คลังสินค้า & วัตถุดิบ', icon: Package },
      ]
    },
    {
      category: 'Management & Control',
      items: [
        { id: 'financials', label: 'รายรับ-รายจ่าย', icon: CircleDollarSign },
        { id: 'houses', label: 'จัดการโรงเรือน', icon: Building2 },
      ]
    }
  ];

  const getInitials = (name: string) => {
    if (!name) return 'KN';
    const parts = name.trim().split(' ');
    if (parts.length >= 2) return `${parts[0][0]}${parts[1][0]}`.toUpperCase();
    return name.slice(0, 2).toUpperCase();
  };

  const getActiveTitle = () => {
    switch (activeTab) {
      case 'dashboard': return 'Farm Operations Overview';
      case 'production': return 'Egg Production & Grading';
      case 'sales': return 'Sales Orders & Invoicing';
      case 'inventory': return 'Inventory & Stock Management';
      case 'financials': return 'Financial Records & Profit';
      case 'houses': return 'Poultry Houses Management';
      default: return 'Farm Management';
    }
  };

  return (
    <>
      {/* Desktop High-Density Sidebar */}
      <aside className="hidden lg:flex w-64 bg-[#0f172a] text-slate-400 flex-col shrink-0 border-r border-slate-800 select-none">
        {/* Brand Header */}
        <div className="p-4 flex items-center justify-between text-white border-b border-slate-800/80">
          <div 
            className="flex items-center gap-2.5 cursor-pointer"
            onClick={() => setActiveTab('dashboard')}
          >
            <div className="w-8 h-8 bg-orange-500 rounded flex items-center justify-center font-bold text-white shadow-sm">
              <span className="font-extrabold text-sm">A</span>
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="font-semibold text-sm tracking-tight text-white">Ari Server</span>
                <span className="bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 text-[9px] px-1.5 py-0.2 rounded font-mono font-bold">PRO</span>
              </div>
              <span className="text-[10px] text-slate-400 block -mt-0.5">ไก่นำโชค จำกัด</span>
            </div>
          </div>

          <button
            onClick={onOpenServerSync}
            className="p-1.5 text-slate-400 hover:text-white hover:bg-slate-800 rounded transition-colors"
            title="เซิร์ฟเวอร์ Ari Server"
          >
            <Server className="w-4 h-4 text-emerald-400" />
          </button>
        </div>

        {/* Navigation Categories */}
        <nav className="flex-1 p-3 space-y-4 overflow-y-auto">
          {navCategories.map((group) => (
            <div key={group.category} className="space-y-1">
              <div className="text-[10px] font-bold text-slate-500 uppercase tracking-widest px-2 pb-1">
                {group.category}
              </div>
              {group.items.map((item) => {
                const Icon = item.icon;
                const isActive = activeTab === item.id;
                return (
                  <button
                    key={item.id}
                    onClick={() => setActiveTab(item.id)}
                    className={`w-full flex items-center justify-between px-3 py-2 rounded-md text-xs font-medium transition-colors ${
                      isActive
                        ? 'bg-slate-800 text-white font-semibold shadow-xs'
                        : 'text-slate-400 hover:bg-slate-800/60 hover:text-white'
                    }`}
                  >
                    <div className="flex items-center gap-2.5">
                      <Icon className={`w-4 h-4 ${isActive ? 'text-red-500' : 'text-slate-400 opacity-80'}`} />
                      <span>{item.label}</span>
                    </div>
                    {item.badge && (
                      <span className="bg-red-500/20 text-red-400 text-[9px] px-1.5 py-0.5 rounded font-mono font-bold">
                        {item.badge}
                      </span>
                    )}
                  </button>
                );
              })}
            </div>
          ))}

          {/* Quick Database / Ari Server Info Section */}
          <div className="pt-2 border-t border-slate-800/80 space-y-1">
            <div className="text-[10px] font-bold text-slate-500 uppercase tracking-widest px-2 pb-1">
              System Services
            </div>
            <button
              onClick={onOpenServerSync}
              className="w-full flex items-center justify-between px-3 py-2 rounded-md text-xs text-slate-400 hover:bg-slate-800/60 hover:text-white transition-colors"
            >
              <div className="flex items-center gap-2.5">
                <Database className="w-4 h-4 text-slate-400 opacity-80" />
                <span>Ari Firestore Sync</span>
              </div>
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            </button>
          </div>
        </nav>

        {/* Sidebar Footer */}
        <div className="p-3 border-t border-slate-800 text-[10px] text-slate-500 flex items-center justify-between bg-slate-950/40 font-mono">
          <span>Project: {serverConfig.projectId}</span>
          <span className="text-emerald-400 flex items-center gap-1 font-sans">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
            Synced
          </span>
        </div>
      </aside>

      {/* Top Header Bar for Desktop & Mobile */}
      <header className="h-14 bg-white border-b border-slate-200 flex items-center justify-between px-4 sm:px-6 sticky top-0 z-30 shrink-0">
        {/* Left: Section Breadcrumb & Status */}
        <div className="flex items-center gap-3">
          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="lg:hidden p-1.5 text-slate-600 hover:bg-slate-100 rounded-md"
          >
            {isMobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>

          <div className="flex items-center gap-2.5">
            <h1 className="text-xs sm:text-sm font-semibold text-slate-500 uppercase tracking-wider font-mono">
              {getActiveTitle()}
            </h1>
            <span className="bg-emerald-100 text-emerald-700 text-[10px] px-2 py-0.5 rounded-full font-bold uppercase hidden sm:inline-flex items-center gap-1 font-mono">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-600"></span>
              Connected
            </span>
          </div>
        </div>

        {/* Right: User Profile & Actions */}
        <div className="flex items-center gap-3">
          {currentUser ? (
            <div 
              onClick={onOpenAuth}
              className="flex items-center gap-2.5 cursor-pointer hover:opacity-90 transition-opacity"
            >
              <div className="text-right hidden sm:block">
                <div className="text-xs sm:text-sm font-medium text-slate-900 leading-tight">
                  {currentUser.name}
                </div>
                <div className="text-[10px] text-slate-500 font-mono leading-tight">
                  {currentUser.email}
                </div>
              </div>
              <div className="w-8 h-8 sm:w-9 sm:h-9 bg-slate-200 rounded-full border-2 border-white shadow-xs flex items-center justify-center text-xs font-bold text-slate-600 uppercase font-mono overflow-hidden">
                {currentUser.avatar ? (
                  <img src={currentUser.avatar} alt={currentUser.name} className="w-full h-full object-cover" />
                ) : (
                  getInitials(currentUser.name)
                )}
              </div>
            </div>
          ) : (
            <button
              onClick={onOpenAuth}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-900 hover:bg-slate-800 text-white rounded-md text-xs font-medium transition-colors shadow-xs"
            >
              <LogIn className="w-3.5 h-3.5" />
              <span>เข้าสู่ระบบ Gmail</span>
            </button>
          )}

          {/* Quick Server Status Modal Button */}
          <button
            onClick={onOpenServerSync}
            className="p-1.5 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-md transition-colors"
            title="สถานะ Ari Server"
          >
            <Server className="w-4 h-4 text-slate-600" />
          </button>
        </div>
      </header>

      {/* Mobile Navigation Drawer */}
      {isMobileMenuOpen && (
        <div className="lg:hidden fixed inset-x-0 top-14 bg-[#0f172a] text-slate-400 z-40 border-b border-slate-800 p-4 space-y-4 shadow-xl">
          <div className="space-y-1">
            {navCategories.flatMap((g) => g.items).map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => {
                    setActiveTab(item.id);
                    setIsMobileMenuOpen(false);
                  }}
                  className={`w-full flex items-center justify-between px-3 py-2 rounded-md text-xs font-medium transition-colors ${
                    isActive
                      ? 'bg-slate-800 text-white font-semibold'
                      : 'text-slate-400 hover:bg-slate-800/60 hover:text-white'
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <Icon className="w-4 h-4" />
                    <span>{item.label}</span>
                  </div>
                  {item.badge && (
                    <span className="bg-red-500/20 text-red-400 text-[9px] px-1.5 py-0.5 rounded font-mono font-bold">
                      {item.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </div>

          <div className="pt-3 border-t border-slate-800 flex items-center justify-between text-xs">
            <span className="text-[10px] text-slate-500 font-mono">Ari Server: {serverConfig.projectId}</span>
            <button
              onClick={() => {
                onOpenServerSync();
                setIsMobileMenuOpen(false);
              }}
              className="px-2.5 py-1 bg-slate-800 hover:bg-slate-700 text-white rounded text-[11px]"
            >
              เปิดศูนย์ซิงค์
            </button>
          </div>
        </div>
      )}
    </>
  );
};

