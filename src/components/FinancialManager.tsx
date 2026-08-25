import React, { useState } from 'react';
import { ExpenseRecord, SalesOrder, User } from '../types';
import { CircleDollarSign, TrendingUp, TrendingDown, Plus, Trash2, Tag, Calendar, PieChart } from 'lucide-react';

interface FinancialManagerProps {
  expenses: ExpenseRecord[];
  orders: SalesOrder[];
  currentUser: User | null;
  onSaveExpense: (expense: ExpenseRecord) => void;
  onDeleteExpense: (id: string) => void;
}

export const FinancialManager: React.FC<FinancialManagerProps> = ({
  expenses,
  orders,
  currentUser,
  onSaveExpense,
  onDeleteExpense,
}) => {
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [title, setTitle] = useState('');
  const [amount, setAmount] = useState<number>(5000);
  const [category, setCategory] = useState<ExpenseRecord['category']>('feed');
  const [paidTo, setPaidTo] = useState('');
  const [receiptNumber, setReceiptNumber] = useState('');
  const [notes, setNotes] = useState('');
  const [date, setDate] = useState('2026-08-24');

  // Calculations
  const totalRevenue = orders.reduce((sum, o) => sum + o.grandTotal, 0);
  const totalExpenses = expenses.reduce((sum, e) => sum + e.amount, 0);
  const netProfit = totalRevenue - totalExpenses;

  const categoryMap: Record<ExpenseRecord['category'], { label: string; color: string }> = {
    feed: { label: '🌾 ค่าอาหารสัตว์', color: 'bg-amber-100 text-amber-800' },
    medicine_vaccine: { label: '💊 ค่ายาและวัคซีน', color: 'bg-purple-100 text-purple-800' },
    labor: { label: '👷 ค่าจ้างแรงงาน', color: 'bg-blue-100 text-blue-800' },
    utility: { label: '⚡ ค่าไฟและค่าน้ำ', color: 'bg-yellow-100 text-yellow-800' },
    packaging: { label: '📦 ค่าแผงและกล่องบรรจุ', color: 'bg-orange-100 text-orange-800' },
    maintenance: { label: '🔧 ค่าซ่อมบำรุงโรงเรือน', color: 'bg-slate-100 text-slate-800' },
    other: { label: '📌 อื่นๆ', color: 'bg-gray-100 text-gray-800' },
  };

  const handleCreateExpense = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || amount <= 0) return;

    const newExp: ExpenseRecord = {
      id: `exp-${Date.now()}`,
      date,
      category,
      title: title.trim(),
      amount: Number(amount),
      paidTo: paidTo.trim() || '-',
      recordedBy: currentUser ? currentUser.name : 'คุณอริสา ดำริ',
      receiptNumber: receiptNumber.trim() || undefined,
      notes: notes.trim() || undefined,
    };

    onSaveExpense(newExp);
    setIsFormOpen(false);
    setTitle('');
    setAmount(5000);
  };

  return (
    <div className="space-y-5">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-white p-4 rounded-xl border border-slate-200 shadow-xs">
        <div>
          <h1 className="text-sm sm:text-base font-bold text-slate-900 font-mono flex items-center gap-2 uppercase tracking-wide">
            <CircleDollarSign className="w-4 h-4 text-red-600" />
            Financial Management & Profit Ledger
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            คำนวณต้นทุนต่อหน่วย สรุปรายรับจากการขาย และกำไรสุทธิ บริษัท ไก่นำโชค จำกัด
          </p>
        </div>

        <button
          onClick={() => setIsFormOpen(!isFormOpen)}
          className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-900 hover:bg-slate-800 text-white rounded-md text-xs font-semibold shadow-xs transition-colors font-mono"
        >
          <Plus className="w-3.5 h-3.5" />
          {isFormOpen ? 'CLOSE FORM' : '+ RECORD EXPENSE'}
        </button>
      </div>

      {/* Financial Overview KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5">
        
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs flex flex-col justify-between">
          <div className="flex items-center justify-between text-[11px] font-bold text-slate-500 uppercase font-mono">
            <span>TOTAL REVENUE</span>
            <TrendingUp className="w-3.5 h-3.5 text-emerald-600" />
          </div>
          <div className="mt-2 font-mono">
            <span className="text-xl sm:text-2xl font-black text-emerald-600">
              ฿{totalRevenue.toLocaleString()}
            </span>
            <span className="block text-[10px] text-slate-400 mt-0.5">
              From {orders.length} orders
            </span>
          </div>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs flex flex-col justify-between">
          <div className="flex items-center justify-between text-[11px] font-bold text-slate-500 uppercase font-mono">
            <span>TOTAL EXPENSES</span>
            <TrendingDown className="w-3.5 h-3.5 text-red-600" />
          </div>
          <div className="mt-2 font-mono">
            <span className="text-xl sm:text-2xl font-black text-red-600">
              ฿{totalExpenses.toLocaleString()}
            </span>
            <span className="block text-[10px] text-slate-400 mt-0.5">
              Feed, med, power, labor costs
            </span>
          </div>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs flex flex-col justify-between">
          <div className="flex items-center justify-between text-[11px] font-bold text-slate-500 uppercase font-mono">
            <span>NET ESTIMATED PROFIT</span>
            <span className={`px-1.5 py-0.5 rounded text-[9px] font-bold ${netProfit >= 0 ? 'bg-emerald-50 text-emerald-700' : 'bg-red-50 text-red-700'}`}>
              {netProfit >= 0 ? 'PROFIT' : 'LOSS'}
            </span>
          </div>
          <div className="mt-2 font-mono">
            <span className={`text-xl sm:text-2xl font-black ${netProfit >= 0 ? 'text-slate-900' : 'text-red-600'}`}>
              ฿{netProfit.toLocaleString()}
            </span>
            <span className="block text-[10px] text-slate-400 mt-0.5">
              Cumulative farm margin
            </span>
          </div>
        </div>

      </div>

      {/* Add Expense Form */}
      {isFormOpen && (
        <form
          onSubmit={handleCreateExpense}
          className="bg-white rounded-xl border border-slate-300 p-5 shadow-sm space-y-4 animate-in slide-in-from-top-2 duration-150"
        >
          <h2 className="text-xs font-bold text-slate-800 uppercase tracking-wider font-mono">
            Record Farm Expenditure / Cost
          </h2>
          
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div>
              <label className="block text-[11px] font-bold text-slate-600 uppercase font-mono mb-1">Expense Title:</label>
              <input
                type="text"
                required
                placeholder="เช่น สั่งซื้อหัวอาหารไก่ไข่ 50 กระสอบ"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full px-3 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-md font-mono"
              />
            </div>
            <div>
              <label className="block text-[11px] font-bold text-slate-600 uppercase font-mono mb-1">Cost Category:</label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value as ExpenseRecord['category'])}
                className="w-full px-3 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-md font-mono"
              >
                <option value="feed">🌾 ค่าอาหารสัตว์ (Feed)</option>
                <option value="medicine_vaccine">💊 ค่ายาและวัคซีน (Med)</option>
                <option value="utility">⚡ ค่ากระแสไฟฟ้า / ค่าน้ำ (Utility)</option>
                <option value="packaging">📦 ค่าบรรจุภัณฑ์และแผงไข่ (Packaging)</option>
                <option value="labor">👷 ค่าจ้างแรงงาน (Labor)</option>
                <option value="maintenance">🔧 ค่าซ่อมบำรุง (Maintenance)</option>
                <option value="other">📌 อื่นๆ (Other)</option>
              </select>
            </div>
            <div>
              <label className="block text-[11px] font-bold text-slate-600 uppercase font-mono mb-1">Amount (THB):</label>
              <input
                type="number"
                min="1"
                required
                value={amount}
                onChange={(e) => setAmount(Number(e.target.value))}
                className="w-full px-3 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-md font-bold font-mono text-red-600"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div>
              <label className="block text-[11px] font-bold text-slate-600 uppercase font-mono mb-1">Paid To (Vendor):</label>
              <input
                type="text"
                placeholder="เช่น บริษัท อาหารสัตว์สยาม จำกัด"
                value={paidTo}
                onChange={(e) => setPaidTo(e.target.value)}
                className="w-full px-3 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-md font-mono"
              />
            </div>
            <div>
              <label className="block text-[11px] font-bold text-slate-600 uppercase font-mono mb-1">Receipt / Ref No:</label>
              <input
                type="text"
                placeholder="เช่น REC-12345"
                value={receiptNumber}
                onChange={(e) => setReceiptNumber(e.target.value)}
                className="w-full px-3 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-md font-mono"
              />
            </div>
            <div>
              <label className="block text-[11px] font-bold text-slate-600 uppercase font-mono mb-1">Payment Date:</label>
              <input
                type="date"
                required
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="w-full px-3 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-md font-mono"
              />
            </div>
          </div>

          <div className="flex justify-end gap-2 pt-1 font-mono">
            <button
              type="button"
              onClick={() => setIsFormOpen(false)}
              className="px-3 py-1.5 bg-slate-200 hover:bg-slate-300 text-slate-700 text-xs font-medium rounded transition-colors"
            >
              CANCEL
            </button>
            <button
              type="submit"
              className="px-4 py-1.5 bg-red-600 hover:bg-red-700 text-white text-xs font-bold rounded shadow-xs transition-colors"
            >
              SAVE EXPENSE
            </button>
          </div>
        </form>
      )}

      {/* Expenses History Table */}
      <div className="bg-white rounded-xl border border-slate-200 flex flex-col shadow-xs overflow-hidden">
        <div className="px-4 py-3 border-b border-slate-100 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <h2 className="font-bold text-slate-800 text-xs uppercase tracking-wider font-mono">
              Expenditure & Cost History
            </h2>
            <span className="bg-slate-100 text-slate-600 text-[10px] font-mono font-bold px-1.5 py-0.5 rounded">
              {expenses.length} ENTRIES
            </span>
          </div>
          <span className="text-[11px] text-slate-500 font-mono">Sorted by date</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-xs text-left border-collapse">
            <thead className="bg-slate-50 text-[10px] text-slate-400 uppercase font-bold font-mono">
              <tr>
                <th className="px-4 py-2.5 border-b border-slate-100">Date</th>
                <th className="px-4 py-2.5 border-b border-slate-100">Category</th>
                <th className="px-4 py-2.5 border-b border-slate-100">Description</th>
                <th className="px-4 py-2.5 border-b border-slate-100">Vendor / Payee</th>
                <th className="px-4 py-2.5 border-b border-slate-100 text-right">Amount (THB)</th>
                <th className="px-4 py-2.5 border-b border-slate-100 text-center">Del</th>
              </tr>
            </thead>
            <tbody className="font-mono text-[12px]">
              {expenses.map((exp) => (
                <tr key={exp.id} className="border-b border-slate-50 hover:bg-slate-50 transition-colors">
                  <td className="px-4 py-2.5 text-slate-500 whitespace-nowrap">{exp.date}</td>
                  <td className="px-4 py-2.5 whitespace-nowrap">
                    <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${categoryMap[exp.category]?.color || 'bg-slate-100'}`}>
                      {categoryMap[exp.category]?.label || exp.category}
                    </span>
                  </td>
                  <td className="px-4 py-2.5 font-sans font-medium text-slate-900">{exp.title}</td>
                  <td className="px-4 py-2.5 text-slate-600 font-sans text-xs">{exp.paidTo}</td>
                  <td className="px-4 py-2.5 text-right font-extrabold text-red-600 whitespace-nowrap">
                    ฿{exp.amount.toLocaleString()}
                  </td>
                  <td className="px-4 py-2.5 text-center whitespace-nowrap">
                    <button
                      onClick={() => onDeleteExpense(exp.id)}
                      className="p-1 text-slate-400 hover:text-red-600 rounded transition-colors"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
