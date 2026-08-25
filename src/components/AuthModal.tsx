import React, { useState } from 'react';
import { User } from '../types';
import { Logo } from './Logo';
import { CheckCircle2, ShieldCheck, Mail, Sparkles, UserCheck, LogIn, Lock } from 'lucide-react';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentUser: User | null;
  onLogin: (user: User) => void;
  onLogout: () => void;
}

export const AuthModal: React.FC<AuthModalProps> = ({
  isOpen,
  onClose,
  currentUser,
  onLogin,
  onLogout,
}) => {
  const [emailInput, setEmailInput] = useState('arisadumri@gmail.com');
  const [nameInput, setNameInput] = useState('คุณอริสา ดำริ (Arisa Damri)');
  const [roleInput, setRoleInput] = useState<User['role']>('owner');
  const [isLoading, setIsLoading] = useState(false);
  const [useCustomEmail, setUseCustomEmail] = useState(false);

  if (!isOpen) return null;

  const handleQuickLogin = (email: string, name: string, role: User['role']) => {
    setIsLoading(true);
    setTimeout(() => {
      const user: User = {
        id: `usr_${email.replace(/[@.]/g, '_')}`,
        email,
        name,
        avatar: email.includes('arisa')
          ? 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80'
          : 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80',
        role,
        farmName: 'ฟาร์มไก่นำโชค สำนักงานใหญ่ (ชลบุรี)',
        serverName: 'Ari Server',
        lastLogin: new Date().toISOString(),
      };
      onLogin(user);
      setIsLoading(false);
      onClose();
    }, 600);
  };

  const handleCustomSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!emailInput.trim()) return;
    handleQuickLogin(
      emailInput.trim(),
      nameInput.trim() || emailInput.split('@')[0],
      roleInput
    );
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="relative w-full max-w-md bg-white rounded-2xl shadow-2xl border border-slate-100 overflow-hidden">
        
        {/* Top Header with Brand */}
        <div className="bg-gradient-to-br from-red-600 via-red-700 to-amber-600 p-6 text-white text-center relative">
          <div className="inline-flex p-3 bg-white rounded-2xl shadow-lg mb-2">
            <Logo size="sm" showText={false} />
          </div>
          <h2 className="text-xl font-bold font-['Prompt',sans-serif]">
            เข้าสู่ระบบด้วย Google / Gmail
          </h2>
          <p className="text-red-100 text-xs mt-1">
            เชื่อมต่อกับฐานข้อมูล Ari Server & ระบบจัดการฟาร์มไก่นำโชค
          </p>

          <button
            onClick={onClose}
            className="absolute top-4 right-4 text-white/80 hover:text-white bg-white/10 hover:bg-white/20 rounded-full w-8 h-8 flex items-center justify-center transition-colors text-sm"
          >
            ✕
          </button>
        </div>

        <div className="p-6">
          {currentUser ? (
            <div className="space-y-4">
              <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-xl flex items-center gap-3">
                <img
                  src={currentUser.avatar}
                  alt={currentUser.name}
                  className="w-12 h-12 rounded-full border-2 border-emerald-500 object-cover"
                />
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-1.5">
                    <p className="text-sm font-bold text-slate-900 truncate">
                      {currentUser.name}
                    </p>
                    <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
                  </div>
                  <p className="text-xs text-slate-600 truncate">{currentUser.email}</p>
                  <span className="inline-block mt-1 px-2 py-0.5 bg-emerald-600 text-white text-[10px] font-semibold rounded-full">
                    {currentUser.role === 'owner' ? '👑 เจ้าของกิจการ / ผู้ดูแลสูงสุด' : 'เจ้าหน้าที่ฟาร์ม'}
                  </span>
                </div>
              </div>

              <div className="bg-slate-50 p-3 rounded-lg border border-slate-200 text-xs text-slate-600 space-y-1">
                <div className="flex justify-between">
                  <span className="text-slate-500">สถานะเซิร์ฟเวอร์:</span>
                  <span className="font-semibold text-emerald-700 flex items-center gap-1">
                    <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                    Ari Server (เชื่อมต่อแล้ว)
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">สาขาฟาร์ม:</span>
                  <span className="font-medium">{currentUser.farmName}</span>
                </div>
              </div>

              <div className="flex gap-2 pt-2">
                <button
                  type="button"
                  onClick={onLogout}
                  className="flex-1 px-4 py-2.5 bg-slate-100 hover:bg-red-50 hover:text-red-700 text-slate-700 rounded-xl text-sm font-medium transition-colors border border-slate-200"
                >
                  ออกจากระบบ
                </button>
                <button
                  type="button"
                  onClick={onClose}
                  className="flex-1 px-4 py-2.5 bg-red-600 hover:bg-red-700 text-white rounded-xl text-sm font-medium shadow-md shadow-red-200 transition-colors"
                >
                  เข้าใช้งานต่อ
                </button>
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              {/* Primary 1-Click Sign in with Gmail */}
              <button
                type="button"
                disabled={isLoading}
                onClick={() => handleQuickLogin('arisadumri@gmail.com', 'คุณอริสา ดำริ (Arisa Damri)', 'owner')}
                className="w-full flex items-center justify-between p-3.5 border-2 border-red-500 bg-red-50/50 hover:bg-red-50 rounded-xl text-left transition-all hover:scale-[1.01] shadow-sm group"
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center shadow-sm border border-red-200 text-red-600 font-bold">
                    <svg className="w-5 h-5" viewBox="0 0 24 24">
                      <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                      <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                      <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"/>
                      <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"/>
                    </svg>
                  </div>
                  <div>
                    <div className="flex items-center gap-1.5">
                      <span className="text-sm font-bold text-slate-900">arisadumri@gmail.com</span>
                      <span className="px-1.5 py-0.5 bg-red-600 text-white text-[10px] font-bold rounded">เจ้าของ</span>
                    </div>
                    <span className="text-xs text-slate-500">คุณอริสา ดำริ (บัญชีหลัก Ari Server)</span>
                  </div>
                </div>
                <div className="text-red-600 font-semibold text-xs flex items-center gap-1 group-hover:translate-x-1 transition-transform">
                  เข้าทันที →
                </div>
              </button>

              <div className="relative my-3 text-center">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-slate-200"></div>
                </div>
                <span className="relative bg-white px-3 text-xs text-slate-400">หรือระบุ Gmail อื่น</span>
              </div>

              {!useCustomEmail ? (
                <button
                  type="button"
                  onClick={() => setUseCustomEmail(true)}
                  className="w-full py-2 px-3 text-xs text-slate-600 bg-slate-50 hover:bg-slate-100 border border-slate-200 rounded-lg flex items-center justify-center gap-2 font-medium"
                >
                  <Mail className="w-3.5 h-3.5 text-slate-500" />
                  เข้าสู่ระบบด้วยอีเมล Gmail อื่นของฟาร์ม
                </button>
              ) : (
                <form onSubmit={handleCustomSubmit} className="space-y-3 bg-slate-50 p-3.5 rounded-xl border border-slate-200">
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      Gmail Address:
                    </label>
                    <input
                      type="email"
                      required
                      placeholder="example@gmail.com"
                      value={emailInput}
                      onChange={(e) => setEmailInput(e.target.value)}
                      className="w-full px-3 py-2 text-xs bg-white border border-slate-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      ชื่อ-นามสกุล / ชื่อผู้ใช้:
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="เช่น สมชาย ใจดี"
                      value={nameInput}
                      onChange={(e) => setNameInput(e.target.value)}
                      className="w-full px-3 py-2 text-xs bg-white border border-slate-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      สิทธิ์การใช้งาน (Role):
                    </label>
                    <select
                      value={roleInput}
                      onChange={(e) => setRoleInput(e.target.value as User['role'])}
                      className="w-full px-3 py-2 text-xs bg-white border border-slate-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:outline-none"
                    >
                      <option value="owner">👑 เจ้าของกิจการ (Owner / Full Access)</option>
                      <option value="manager">👔 ผู้จัดการฟาร์ม (Farm Manager)</option>
                      <option value="supervisor">🔬 สัตวบาล / หัวหน้างาน (Supervisor)</option>
                      <option value="staff">📋 พนักงานบันทึกข้อมูล (Staff)</option>
                    </select>
                  </div>

                  <div className="flex gap-2 pt-1">
                    <button
                      type="button"
                      onClick={() => setUseCustomEmail(false)}
                      className="px-3 py-1.5 text-xs text-slate-600 bg-white border border-slate-300 rounded-lg"
                    >
                      ยกเลิก
                    </button>
                    <button
                      type="submit"
                      disabled={isLoading}
                      className="flex-1 py-1.5 bg-red-600 hover:bg-red-700 text-white text-xs font-semibold rounded-lg shadow"
                    >
                      {isLoading ? 'กำลังเข้าสู่ระบบ...' : 'เข้าสู่ระบบ Gmail'}
                    </button>
                  </div>
                </form>
              )}

              <div className="bg-amber-50 border border-amber-200 rounded-xl p-3 flex items-start gap-2.5 text-[11px] text-amber-800">
                <Sparkles className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                <p>
                  ระบบบันทึกและซิงค์ข้อมูลกับโครงการ <strong>Ari Server</strong> โดยอัตโนมัติ ข้อมูลผลผลิต การขาย และคลังสินค้าจะปลอดภัยในทุกอุปกรณ์
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
