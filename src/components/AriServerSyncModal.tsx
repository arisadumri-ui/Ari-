import React, { useState } from 'react';
import { AriServerConfig } from '../types';
import { AppStorage } from '../utils/storage';
import {
  Database,
  Cloud,
  RefreshCw,
  Download,
  Upload,
  CheckCircle2,
  AlertCircle,
  HardDrive,
  Server,
  Layers,
  ShieldCheck,
  FileJson
} from 'lucide-react';

interface AriServerSyncModalProps {
  isOpen: boolean;
  onClose: () => void;
  serverConfig: AriServerConfig;
  onUpdateConfig: (config: AriServerConfig) => void;
  onDataImported: () => void;
}

export const AriServerSyncModal: React.FC<AriServerSyncModalProps> = ({
  isOpen,
  onClose,
  serverConfig,
  onUpdateConfig,
  onDataImported,
}) => {
  const [isSyncing, setIsSyncing] = useState(false);
  const [importStatus, setImportStatus] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleSyncNow = () => {
    setIsSyncing(true);
    setTimeout(() => {
      setIsSyncing(false);
      const updated: AriServerConfig = {
        ...serverConfig,
        status: 'connected',
        lastSyncTime: new Date().toLocaleTimeString('th-TH', { hour: '2-digit', minute: '2-digit', second: '2-digit' }),
        totalRecordsSynced:
          AppStorage.getProductions().length +
          AppStorage.getOrders().length +
          AppStorage.getInventory().length +
          AppStorage.getExpenses().length +
          AppStorage.getHouses().length,
      };
      onUpdateConfig(updated);
      AppStorage.saveServerConfig(updated);
    }, 800);
  };

  const handleExportJSON = () => {
    const jsonString = AppStorage.exportFullBackupJSON();
    const blob = new Blob([jsonString], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `AriServer_KaiNamChok_Backup_${new Date().toISOString().slice(0, 10)}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const handleImportJSON = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const content = event.target?.result as string;
      const success = AppStorage.importBackupJSON(content);
      if (success) {
        setImportStatus('นำเข้าข้อมูลสำเร็จแล้ว!');
        onDataImported();
        setTimeout(() => setImportStatus(null), 3000);
      } else {
        setImportStatus('ไฟล์ไม่ถูกต้อง กรุณาใช้ไฟล์สำรองจาก Ari Server');
        setTimeout(() => setImportStatus(null), 4000);
      }
    };
    reader.readAsText(file);
  };

  const collections = [
    { name: 'daily_productions (บันทึกผลผลิตไข่)', count: AppStorage.getProductions().length, icon: Layers },
    { name: 'sales_orders (บิลขาย & ใบส่งของ)', count: AppStorage.getOrders().length, icon: Layers },
    { name: 'inventory_items (คลังสินค้าและอาหาร)', count: AppStorage.getInventory().length, icon: Layers },
    { name: 'expense_records (บันทึกต้นทุน/รายจ่าย)', count: AppStorage.getExpenses().length, icon: Layers },
    { name: 'poultry_houses (โรงเรือนไก่ไข่)', count: AppStorage.getHouses().length, icon: Layers },
    { name: 'customers (รายชื่อลูกค้า/คู่ค้า)', count: AppStorage.getCustomers().length, icon: Layers },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="relative w-full max-w-2xl bg-white rounded-2xl shadow-2xl border border-slate-100 overflow-hidden flex flex-col max-h-[90vh]">
        
        {/* Header */}
        <div className="bg-slate-900 text-white p-5 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-red-600 to-amber-500 flex items-center justify-center text-white shadow-md">
              <Server className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-bold font-['Prompt',sans-serif] flex items-center gap-2">
                โครงการ Ari Server
                <span className="px-2 py-0.5 bg-emerald-500/20 text-emerald-300 text-xs font-normal border border-emerald-500/30 rounded-full flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
                  Active / Connected
                </span>
              </h2>
              <p className="text-xs text-slate-400">
                ระบบจัดการฐานข้อมูลและสำรองข้อมูลสำหรับ บริษัท ไก่นำโชค จำกัด
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white flex items-center justify-center transition-colors"
          >
            ✕
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6 overflow-y-auto">
          
          {/* Server Info Card */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div className="bg-slate-50 border border-slate-200 rounded-xl p-3.5">
              <span className="text-xs text-slate-500 block">ชื่อโปรเจกต์เซิร์ฟเวอร์</span>
              <span className="text-sm font-bold text-slate-900 mt-1 block">Ari Server</span>
              <span className="text-[11px] text-slate-400">ID: ari-server-poultry-knc</span>
            </div>

            <div className="bg-slate-50 border border-slate-200 rounded-xl p-3.5">
              <span className="text-xs text-slate-500 block">ซิงค์ล่าสุดเมื่อ</span>
              <span className="text-sm font-bold text-slate-900 mt-1 block">
                วันนี้ {serverConfig.lastSyncTime} น.
              </span>
              <span className="text-[11px] text-emerald-600 font-medium">สถานะ: สมบูรณ์ 100%</span>
            </div>

            <div className="bg-slate-50 border border-slate-200 rounded-xl p-3.5">
              <span className="text-xs text-slate-500 block">รายการข้อมูลที่บันทึก</span>
              <span className="text-sm font-bold text-slate-900 mt-1 block">
                {collections.reduce((acc, c) => acc + c.count, 0)} เรคคอร์ด
              </span>
              <span className="text-[11px] text-slate-400">ครอบคลุม 6 ตารางข้อมูล</span>
            </div>
          </div>

          {/* Sync Trigger Action */}
          <div className="bg-gradient-to-r from-red-50 to-amber-50 border border-red-100 rounded-xl p-4 flex flex-col sm:flex-row items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-red-100 text-red-600 flex items-center justify-center shrink-0">
                <RefreshCw className={`w-5 h-5 ${isSyncing ? 'animate-spin' : ''}`} />
              </div>
              <div>
                <h4 className="text-sm font-bold text-slate-900">ซิงค์ข้อมูลกับ Ari Server ทันที</h4>
                <p className="text-xs text-slate-600">
                  อัปเดตยอดขาย ผลผลิตไข่ และสต็อกล่าสุดเข้าระบบคลาวด์
                </p>
              </div>
            </div>

            <button
              onClick={handleSyncNow}
              disabled={isSyncing}
              className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg text-xs font-semibold shadow-md shadow-red-200 flex items-center gap-1.5 transition-all whitespace-nowrap"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${isSyncing ? 'animate-spin' : ''}`} />
              {isSyncing ? 'กำลังซิงค์...' : 'กดซิงค์ข้อมูลเดี๋ยวนี้'}
            </button>
          </div>

          {/* Collections List */}
          <div>
            <h4 className="text-xs font-bold text-slate-700 uppercase tracking-wider mb-2.5 flex items-center gap-1.5">
              <Database className="w-4 h-4 text-slate-500" />
              โครงสร้างตารางข้อมูลใน Ari Server (Collections)
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {collections.map((col, idx) => (
                <div
                  key={idx}
                  className="flex items-center justify-between p-2.5 bg-slate-50 border border-slate-200 rounded-lg text-xs"
                >
                  <span className="text-slate-700 font-medium truncate">{col.name}</span>
                  <span className="px-2 py-0.5 bg-white border border-slate-300 rounded font-bold text-slate-900">
                    {col.count} รายการ
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Export & Import Backup */}
          <div className="pt-2 border-t border-slate-200">
            <h4 className="text-xs font-bold text-slate-700 uppercase tracking-wider mb-3 flex items-center gap-1.5">
              <HardDrive className="w-4 h-4 text-slate-500" />
              การสำรองและกู้คืนข้อมูล (Backup & Restore)
            </h4>
            
            {importStatus && (
              <div className="mb-3 p-3 bg-emerald-50 text-emerald-800 border border-emerald-200 rounded-lg text-xs flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                {importStatus}
              </div>
            )}

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <button
                onClick={handleExportJSON}
                className="flex items-center justify-center gap-2 p-3 bg-white border border-slate-300 hover:border-slate-400 hover:bg-slate-50 rounded-xl text-xs font-semibold text-slate-700 transition-colors shadow-sm"
              >
                <Download className="w-4 h-4 text-red-600" />
                ดาวน์โหลดไฟล์สำรองข้อมูล (.json)
              </button>

              <label className="flex items-center justify-center gap-2 p-3 bg-white border border-slate-300 hover:border-slate-400 hover:bg-slate-50 rounded-xl text-xs font-semibold text-slate-700 transition-colors shadow-sm cursor-pointer">
                <Upload className="w-4 h-4 text-amber-600" />
                นำเข้าข้อมูลจากไฟล์สำรอง (.json)
                <input
                  type="file"
                  accept=".json"
                  onChange={handleImportJSON}
                  className="hidden"
                />
              </label>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 bg-slate-50 border-t border-slate-200 flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-lg text-xs font-semibold transition-colors"
          >
            ปิดหน้าต่าง
          </button>
        </div>
      </div>
    </div>
  );
};
