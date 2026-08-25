import React from 'react';
import { DailyProduction, ExpenseRecord, InventoryItem, PoultryHouse, SalesOrder, User } from '../types';
import { Logo } from './Logo';
import {
  Egg,
  TrendingUp,
  BadgeDollarSign,
  Package,
  Layers,
  ArrowUpRight,
  Plus,
  CheckCircle,
  AlertTriangle,
  FileText,
  ChevronRight,
  Percent,
  Calendar,
  Sparkles,
  RefreshCw,
  Building,
  Server,
  Shield,
  Activity,
  ArrowRight
} from 'lucide-react';

interface DashboardProps {
  productions: DailyProduction[];
  orders: SalesOrder[];
  inventory: InventoryItem[];
  expenses: ExpenseRecord[];
  houses: PoultryHouse[];
  currentUser: User | null;
  onNavigate: (tab: string) => void;
  onOpenNewProduction: () => void;
  onOpenNewSale: () => void;
  onOpenServerSync: () => void;
}

export const Dashboard: React.FC<DashboardProps> = ({
  productions,
  orders,
  inventory,
  expenses,
  houses,
  currentUser,
  onNavigate,
  onOpenNewProduction,
  onOpenNewSale,
  onOpenServerSync,
}) => {
  // Calculations
  const todayStr = '2026-08-24';
  const todayProductions = productions.filter((p) => p.date === todayStr);
  const todayEggTotal = todayProductions.reduce((sum, p) => sum + p.totalCollected, 0);

  const todayOrders = orders.filter((o) => o.date === todayStr);
  const todaySalesTotal = todayOrders.reduce((sum, o) => sum + o.grandTotal, 0);

  const totalHenCount = houses.reduce((sum, h) => sum + h.currentHenCount, 0);
  const averageLayingRate =
    todayProductions.length > 0
      ? (todayEggTotal / (totalHenCount || 1)) * 100
      : 94.2;

  const totalEggStock = inventory
    .filter((i) => i.category === 'eggs')
    .reduce((sum, i) => sum + i.currentStock, 0);

  // Grade Breakdown summary
  const gradeTotals = todayProductions.reduce(
    (acc, p) => {
      acc.jumbo += p.grades.jumbo;
      acc.grade0 += p.grades.grade0;
      acc.grade1 += p.grades.grade1;
      acc.grade2 += p.grades.grade2;
      acc.grade3 += p.grades.grade3;
      acc.grade4 += p.grades.grade4;
      acc.damaged += p.grades.damaged;
      return acc;
    },
    { jumbo: 0, grade0: 0, grade1: 0, grade2: 0, grade3: 0, grade4: 0, damaged: 0 }
  );

  const gradeConfigs = [
    { key: 'jumbo', label: 'จัมโบ้ (>70g)', count: gradeTotals.jumbo, color: 'bg-amber-500', bar: 'bg-amber-500' },
    { key: 'grade0', label: 'เบอร์ 0 (70-74g)', count: gradeTotals.grade0, color: 'bg-red-500', bar: 'bg-red-600' },
    { key: 'grade1', label: 'เบอร์ 1 (65-69g)', count: gradeTotals.grade1, color: 'bg-orange-500', bar: 'bg-orange-500' },
    { key: 'grade2', label: 'เบอร์ 2 (60-64g)', count: gradeTotals.grade2, color: 'bg-yellow-500', bar: 'bg-yellow-500' },
    { key: 'grade3', label: 'เบอร์ 3 (55-59g)', count: gradeTotals.grade3, color: 'bg-emerald-500', bar: 'bg-emerald-500' },
    { key: 'grade4', label: 'เบอร์ 4 (50-54g)', count: gradeTotals.grade4, color: 'bg-blue-500', bar: 'bg-blue-500' },
    { key: 'damaged', label: 'แตกร้าว/ตกเกรด', count: gradeTotals.damaged, color: 'bg-slate-400', bar: 'bg-slate-400' },
  ];

  return (
    <div className="space-y-5">
      
      {/* High Density Metric Cards (4-col grid) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        
        {/* Total Egg Collected Today */}
        <div className="bg-white p-4 rounded-lg border border-slate-200 shadow-xs flex flex-col justify-between">
          <div>
            <div className="text-xs text-slate-500 mb-1 uppercase font-bold tracking-wider font-mono flex items-center justify-between">
              <span>ยอดเก็บไข่วันนี้</span>
              <Egg className="w-3.5 h-3.5 text-slate-400" />
            </div>
            <div className="text-2xl sm:text-3xl font-mono font-semibold text-slate-900">
              {todayEggTotal.toLocaleString()} <span className="text-xs font-sans text-slate-400 font-normal">ฟอง</span>
            </div>
          </div>
          <div className="text-[10px] text-emerald-600 font-bold font-mono mt-2 flex items-center gap-1">
            <span>↑ {(todayEggTotal / 30).toFixed(0)} แผง</span>
            <span className="text-slate-400 font-normal">• 3 โรงเรือน</span>
          </div>
        </div>

        {/* Laying Rate % */}
        <div className="bg-white p-4 rounded-lg border border-slate-200 shadow-xs flex flex-col justify-between">
          <div>
            <div className="text-xs text-slate-500 mb-1 uppercase font-bold tracking-wider font-mono flex items-center justify-between">
              <span>อัตราการไข่ (Laying Rate)</span>
              <Percent className="w-3.5 h-3.5 text-slate-400" />
            </div>
            <div className="text-2xl sm:text-3xl font-mono font-semibold text-slate-900">
              {averageLayingRate.toFixed(1)}%
            </div>
          </div>
          <div className="text-[10px] text-emerald-600 font-bold font-mono mt-2 flex items-center gap-1">
            <span>↑ 1.4% จากเมื่อวาน</span>
            <span className="text-slate-400 font-normal">• ฝูง {totalHenCount.toLocaleString()} ตัว</span>
          </div>
        </div>

        {/* Today's Sales Revenue */}
        <div className="bg-white p-4 rounded-lg border border-slate-200 shadow-xs flex flex-col justify-between">
          <div>
            <div className="text-xs text-slate-500 mb-1 uppercase font-bold tracking-wider font-mono flex items-center justify-between">
              <span>ยอดขายวันนี้ (Revenue)</span>
              <BadgeDollarSign className="w-3.5 h-3.5 text-slate-400" />
            </div>
            <div className="text-2xl sm:text-3xl font-mono font-semibold text-slate-900">
              ฿{todaySalesTotal.toLocaleString()}
            </div>
          </div>
          <div className="text-[10px] text-emerald-600 font-bold font-mono mt-2 flex items-center gap-1">
            <span>↑ {todayOrders.length} บิลสั่งซื้อ</span>
            <span className="text-slate-400 font-normal">• ส่งมอบแล้ว</span>
          </div>
        </div>

        {/* Ready Stock in Inventory */}
        <div className="bg-white p-4 rounded-lg border border-slate-200 shadow-xs flex flex-col justify-between">
          <div>
            <div className="text-xs text-slate-500 mb-1 uppercase font-bold tracking-wider font-mono flex items-center justify-between">
              <span>สต็อกไข่ในคลังห้องเย็น</span>
              <Package className="w-3.5 h-3.5 text-slate-400" />
            </div>
            <div className="text-2xl sm:text-3xl font-mono font-semibold text-slate-900">
              {totalEggStock.toLocaleString()} <span className="text-xs font-sans text-slate-400 font-normal">ฟอง</span>
            </div>
          </div>
          <div className="text-[10px] text-slate-500 font-medium font-mono mt-2 flex items-center gap-1">
            <span>{(totalEggStock / 30).toFixed(0)} แผง พร้อมส่งมอบ</span>
          </div>
        </div>

      </div>

      {/* Main High Density 12-col Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
        
        {/* Left 8-col Section: Recent Auth & Sales Events Table + Grade Breakdown */}
        <section className="lg:col-span-8 space-y-5">
          
          {/* Recent Orders & Delivery Events Table */}
          <div className="bg-white border border-slate-200 rounded-xl flex flex-col shadow-xs overflow-hidden">
            <div className="px-4 py-3.5 border-b border-slate-100 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <h2 className="font-bold text-slate-800 text-xs uppercase tracking-wider font-mono">
                  Recent Sales & Dispatch Events
                </h2>
                <span className="bg-slate-100 text-slate-600 text-[10px] font-mono font-bold px-1.5 py-0.5 rounded">
                  {orders.length} TOTAL
                </span>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={onOpenNewSale}
                  className="px-2.5 py-1 bg-slate-900 hover:bg-slate-800 text-white rounded text-xs font-medium transition-colors flex items-center gap-1 shadow-xs"
                >
                  <Plus className="w-3 h-3" />
                  + ออกบิลใหม่
                </button>
                <button
                  onClick={() => onNavigate('sales')}
                  className="text-slate-600 hover:text-slate-900 text-xs font-medium px-2 py-1"
                >
                  ดูทั้งหมด →
                </button>
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs border-collapse">
                <thead className="bg-slate-50 text-[10px] text-slate-400 uppercase font-bold font-mono">
                  <tr>
                    <th className="px-4 py-2.5 border-b border-slate-100">Invoice ID</th>
                    <th className="px-4 py-2.5 border-b border-slate-100">Customer</th>
                    <th className="px-4 py-2.5 border-b border-slate-100">Items / Trays</th>
                    <th className="px-4 py-2.5 border-b border-slate-100 text-right">Amount</th>
                    <th className="px-4 py-2.5 border-b border-slate-100 text-center">Status</th>
                  </tr>
                </thead>
                <tbody className="font-mono text-[12px]">
                  {orders.slice(0, 5).map((order) => (
                    <tr key={order.id} className="border-b border-slate-50 hover:bg-slate-50/80 transition-colors">
                      <td className="px-4 py-2.5 font-bold text-slate-900 whitespace-nowrap">
                        {order.invoiceNumber}
                      </td>
                      <td className="px-4 py-2.5 font-sans">
                        <span className="font-semibold text-slate-800 block text-xs">{order.customerName}</span>
                        <span className="text-[10px] text-slate-400 font-mono">{order.date}</span>
                      </td>
                      <td className="px-4 py-2.5 text-slate-600 font-sans text-xs">
                        {order.items.map((it) => `${it.name} (${it.quantity} ${it.unit})`).join(', ')}
                      </td>
                      <td className="px-4 py-2.5 text-right font-extrabold text-slate-900 whitespace-nowrap">
                        ฿{order.grandTotal.toLocaleString()}
                      </td>
                      <td className="px-4 py-2.5 text-center whitespace-nowrap">
                        <span
                          className={`inline-block px-2 py-0.5 rounded text-[10px] font-bold ${
                            order.paymentStatus === 'paid'
                              ? 'bg-emerald-50 text-emerald-700'
                              : 'bg-amber-50 text-amber-700'
                          }`}
                        >
                          {order.paymentStatus === 'paid' ? '● PAID' : '○ PENDING'}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="p-3 border-t border-slate-100 bg-slate-50 flex items-center justify-between text-xs text-slate-500 font-mono">
              <span>Showing {Math.min(5, orders.length)} of {orders.length} orders</span>
              <button
                onClick={() => onNavigate('sales')}
                className="text-slate-700 hover:text-slate-900 font-semibold flex items-center gap-1 font-sans"
              >
                ดูระบบการขาย & พิมพ์ใบส่งของ <ChevronRight className="w-3 h-3" />
              </button>
            </div>
          </div>

          {/* Grade Breakdown Visual Card */}
          <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-xs">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h2 className="text-xs font-bold text-slate-800 uppercase tracking-wider font-mono">
                  Egg Production Grading Metrics (Today)
                </h2>
                <p className="text-xs text-slate-500 mt-0.5">
                  คัดแยกเกรดมาตรฐาน บริษัท ไก่นำโชค จำกัด
                </p>
              </div>
              <button
                onClick={onOpenNewProduction}
                className="px-2.5 py-1 bg-red-600 hover:bg-red-700 text-white rounded text-xs font-medium transition-colors shadow-xs"
              >
                + บันทึกเก็บไข่
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
              {gradeConfigs.map((grade) => {
                const percentage = todayEggTotal > 0 ? (grade.count / todayEggTotal) * 100 : 0;
                const trayCount = (grade.count / 30).toFixed(0);
                return (
                  <div key={grade.key} className="p-3 bg-slate-50 border border-slate-100 rounded-lg space-y-1.5">
                    <div className="flex items-center justify-between text-xs">
                      <span className="font-semibold text-slate-800 flex items-center gap-2">
                        <span className={`w-2 h-2 rounded-full ${grade.color}`} />
                        {grade.label}
                      </span>
                      <span className="font-mono text-slate-700 font-bold">
                        {percentage.toFixed(1)}%
                      </span>
                    </div>
                    <div className="w-full h-1.5 bg-slate-200 rounded-full overflow-hidden">
                      <div
                        className={`h-full ${grade.bar} transition-all duration-300 rounded-full`}
                        style={{ width: `${Math.max(percentage, 2)}%` }}
                      />
                    </div>
                    <div className="flex justify-between text-[11px] text-slate-500 font-mono">
                      <span>{grade.count.toLocaleString()} ฟอง</span>
                      <span>{trayCount} แผง</span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

        </section>

        {/* Right 4-col Section: Security & System Config + Realtime Status Panel */}
        <section className="lg:col-span-4 space-y-5">
          
          {/* Security / Server Config Card */}
          <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-xs">
            <div className="flex items-center justify-between pb-3 mb-3 border-b border-slate-100">
              <h2 className="font-bold text-slate-800 text-xs uppercase tracking-wider font-mono flex items-center gap-1.5">
                <Shield className="w-3.5 h-3.5 text-slate-500" />
                Security & Server Config
              </h2>
              <span className="text-[10px] text-slate-400 font-mono">v4.9</span>
            </div>

            <div className="space-y-2.5 font-mono text-xs">
              <div className="flex justify-between items-center py-1 border-b border-slate-50">
                <span className="text-slate-600 font-sans text-xs">Gmail OAuth</span>
                <span className="text-[10px] text-emerald-600 font-bold bg-emerald-50 px-2 py-0.5 rounded">ENABLED</span>
              </div>
              <div className="flex justify-between items-center py-1 border-b border-slate-50">
                <span className="text-slate-600 font-sans text-xs">Ari Server DB</span>
                <span className="text-[10px] text-emerald-600 font-bold bg-emerald-50 px-2 py-0.5 rounded">CONNECTED</span>
              </div>
              <div className="flex justify-between items-center py-1 border-b border-slate-50">
                <span className="text-slate-600 font-sans text-xs">Evap Automation</span>
                <span className="text-[10px] text-emerald-600 font-bold bg-emerald-50 px-2 py-0.5 rounded">ACTIVE</span>
              </div>
              <div className="flex justify-between items-center py-1">
                <span className="text-slate-600 font-sans text-xs">Auto Backup (JSON)</span>
                <span className="text-[10px] text-slate-600 font-bold bg-slate-100 px-2 py-0.5 rounded">HOURLY</span>
              </div>
            </div>

            <button
              onClick={onOpenServerSync}
              className="w-full mt-3.5 bg-slate-900 hover:bg-slate-800 text-white text-xs py-2 rounded font-medium transition-colors shadow-xs font-mono flex items-center justify-center gap-1.5"
            >
              <Server className="w-3.5 h-3.5 text-emerald-400" />
              Configure Ari Server
            </button>
          </div>

          {/* High Density Realtime Status Widget */}
          <div className="bg-[#0f172a] rounded-xl p-5 text-white shadow-xl relative overflow-hidden border border-slate-800">
            <div className="relative z-10 space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider font-mono flex items-center gap-1.5">
                  <Activity className="w-3.5 h-3.5 text-emerald-400" />
                  Realtime Farm Status
                </h3>
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
              </div>

              <div>
                <div className="flex items-baseline gap-2">
                  <span className="text-3xl font-mono font-bold text-white">
                    {totalHenCount.toLocaleString()}
                  </span>
                  <span className="text-xs text-slate-400 font-sans">แม่ไก่ในระบบ</span>
                </div>
                <p className="text-[10px] text-slate-400 font-mono mt-0.5">
                  Avg Temperature: 25.4°C • RH 68%
                </p>
              </div>

              {/* Dynamic Telemetry Waveform Bars */}
              <div className="flex gap-1 items-end h-14 pt-2">
                <div className="flex-1 bg-red-500 rounded-xs" style={{ height: '70%' }}></div>
                <div className="flex-1 bg-orange-400 rounded-xs" style={{ height: '85%' }}></div>
                <div className="flex-1 bg-amber-400 rounded-xs" style={{ height: '95%' }}></div>
                <div className="flex-1 bg-emerald-500 rounded-xs" style={{ height: '90%' }}></div>
                <div className="flex-1 bg-blue-500 rounded-xs" style={{ height: '60%' }}></div>
                <div className="flex-1 bg-indigo-400 rounded-xs" style={{ height: '80%' }}></div>
                <div className="flex-1 bg-red-500 rounded-xs" style={{ height: '92%' }}></div>
                <div className="flex-1 bg-emerald-400 rounded-xs" style={{ height: '75%' }}></div>
                <div className="flex-1 bg-amber-400 rounded-xs" style={{ height: '65%' }}></div>
                <div className="flex-1 bg-blue-400 rounded-xs" style={{ height: '88%' }}></div>
              </div>

              {/* Houses Mini Status */}
              <div className="pt-2 border-t border-slate-800/80 space-y-1.5">
                {houses.slice(0, 3).map((h) => (
                  <div key={h.id} className="flex justify-between text-[11px] text-slate-300">
                    <span className="truncate">{h.name}</span>
                    <span className="font-mono text-emerald-400">{h.currentHenCount.toLocaleString()} ตัว</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Glowing background accent */}
            <div className="absolute top-[-20px] right-[-20px] w-32 h-32 bg-blue-500/10 rounded-full blur-3xl pointer-events-none"></div>
          </div>

        </section>

      </div>

    </div>
  );
};

