import React, { useState } from 'react';
import { DailyProduction, EggGradeDetails, PoultryHouse, User } from '../types';
import { Egg, Plus, Trash2, Calendar, FileSpreadsheet, Check, Sparkles, Filter, Building } from 'lucide-react';

interface ProductionManagerProps {
  productions: DailyProduction[];
  houses: PoultryHouse[];
  currentUser: User | null;
  onSaveProduction: (prod: DailyProduction) => void;
  onDeleteProduction: (id: string) => void;
}

export const ProductionManager: React.FC<ProductionManagerProps> = ({
  productions,
  houses,
  currentUser,
  onSaveProduction,
  onDeleteProduction,
}) => {
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [selectedHouseId, setSelectedHouseId] = useState(houses[0]?.id || 'house-a1');
  const [date, setDate] = useState('2026-08-24');
  const [mortality, setMortality] = useState(2);
  const [cull, setCull] = useState(0);
  const [feedKg, setFeedKg] = useState(1200);
  const [waterLiters, setWaterLiters] = useState(2800);
  const [notes, setNotes] = useState('ผลผลิตไข่เปลือกหนา สมบูรณ์ดี');

  // Grades count
  const [grades, setGrades] = useState<EggGradeDetails>({
    jumbo: 500,
    grade0: 2000,
    grade1: 3500,
    grade2: 2500,
    grade3: 1000,
    grade4: 200,
    damaged: 40,
  });

  const totalCollected =
    Number(grades.jumbo || 0) +
    Number(grades.grade0 || 0) +
    Number(grades.grade1 || 0) +
    Number(grades.grade2 || 0) +
    Number(grades.grade3 || 0) +
    Number(grades.grade4 || 0) +
    Number(grades.damaged || 0);

  const currentHouse = houses.find((h) => h.id === selectedHouseId) || houses[0];
  const layingRate = currentHouse ? (totalCollected / (currentHouse.currentHenCount || 1)) * 100 : 0;

  const handleGradeChange = (gradeKey: keyof EggGradeDetails, val: number) => {
    setGrades((prev) => ({
      ...prev,
      [gradeKey]: Math.max(0, val),
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentHouse) return;

    const newProd: DailyProduction = {
      id: `prod-${Date.now()}`,
      date,
      houseId: currentHouse.id,
      houseName: currentHouse.name,
      grades: { ...grades },
      totalCollected,
      mortalityCount: Number(mortality),
      cullCount: Number(cull),
      feedConsumedKg: Number(feedKg),
      waterConsumedLiters: Number(waterLiters),
      layingRatePercent: Number(layingRate.toFixed(2)),
      notes,
      recordedBy: currentUser ? currentUser.name : 'คุณอริสา ดำริ',
      createdAt: new Date().toISOString(),
    };

    onSaveProduction(newProd);
    setIsFormOpen(false);
  };

  return (
    <div className="space-y-5">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-white p-4 rounded-xl border border-slate-200 shadow-xs">
        <div>
          <h1 className="text-sm sm:text-base font-bold text-slate-900 font-mono flex items-center gap-2 uppercase tracking-wide">
            <Egg className="w-4 h-4 text-red-600" />
            Egg Production & Daily Grading Record
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            บันทึกผลผลิตไข่ไก่ คัดแยกเกรด คำนวณ Laying Rate % อัตโนมัติ (บริษัท ไก่นำโชค จำกัด)
          </p>
        </div>

        <button
          onClick={() => setIsFormOpen(!isFormOpen)}
          className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-900 hover:bg-slate-800 text-white rounded-md text-xs font-semibold shadow-xs transition-colors font-mono"
        >
          <Plus className="w-3.5 h-3.5" />
          {isFormOpen ? 'CLOSE FORM' : '+ NEW PRODUCTION ENTRY'}
        </button>
      </div>

      {/* Recording Form */}
      {isFormOpen && (
        <form
          onSubmit={handleSubmit}
          className="bg-white rounded-xl border border-slate-300 p-5 shadow-sm space-y-5 animate-in slide-in-from-top-2 duration-150"
        >
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <h2 className="text-xs font-bold text-slate-800 uppercase tracking-wider font-mono flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-red-600 animate-pulse"></span>
              Enter Batch Harvesting & Grading Data
            </h2>
            <span className="text-[11px] text-slate-500 font-mono">
              Recorder: <strong className="text-slate-800">{currentUser ? currentUser.name : 'คุณอริสา ดำริ'}</strong>
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5">
            <div>
              <label className="block text-[11px] font-bold text-slate-600 uppercase font-mono mb-1">
                Poultry House:
              </label>
              <select
                value={selectedHouseId}
                onChange={(e) => setSelectedHouseId(e.target.value)}
                className="w-full px-3 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-md focus:ring-1 focus:ring-slate-900 focus:outline-none font-mono"
              >
                {houses.map((h) => (
                  <option key={h.id} value={h.id}>
                    {h.name} ({h.currentHenCount.toLocaleString()} hens - {h.ageWeeks} wks)
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-[11px] font-bold text-slate-600 uppercase font-mono mb-1">
                Harvest Date:
              </label>
              <input
                type="date"
                required
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="w-full px-3 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-md focus:ring-1 focus:ring-slate-900 focus:outline-none font-mono"
              />
            </div>

            <div>
              <label className="block text-[11px] font-bold text-slate-600 uppercase font-mono mb-1">
                Feed Consumed (kg):
              </label>
              <input
                type="number"
                min="0"
                value={feedKg}
                onChange={(e) => setFeedKg(Number(e.target.value))}
                className="w-full px-3 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-md focus:ring-1 focus:ring-slate-900 focus:outline-none font-mono"
              />
            </div>
          </div>

          {/* Grades Inputs Grid */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="text-[11px] font-bold text-slate-700 uppercase tracking-wider font-mono">
                Grading Counts (Pieces) • 30 Pieces / Tray
              </label>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-2.5">
              
              <div className="bg-slate-50 p-2.5 rounded-lg border border-slate-200">
                <span className="text-[10px] font-bold text-amber-800 uppercase font-mono block">Jumbo (&gt;70g)</span>
                <input
                  type="number"
                  min="0"
                  value={grades.jumbo}
                  onChange={(e) => handleGradeChange('jumbo', Number(e.target.value))}
                  className="w-full mt-1 px-2 py-1 text-xs font-bold font-mono text-slate-900 bg-white border border-slate-200 rounded text-center"
                />
                <span className="text-[9px] text-slate-500 font-mono block text-center mt-1">
                  {(grades.jumbo / 30).toFixed(0)} trays
                </span>
              </div>

              <div className="bg-slate-50 p-2.5 rounded-lg border border-slate-200">
                <span className="text-[10px] font-bold text-red-800 uppercase font-mono block">Grade 0 (70-74g)</span>
                <input
                  type="number"
                  min="0"
                  value={grades.grade0}
                  onChange={(e) => handleGradeChange('grade0', Number(e.target.value))}
                  className="w-full mt-1 px-2 py-1 text-xs font-bold font-mono text-slate-900 bg-white border border-slate-200 rounded text-center"
                />
                <span className="text-[9px] text-slate-500 font-mono block text-center mt-1">
                  {(grades.grade0 / 30).toFixed(0)} trays
                </span>
              </div>

              <div className="bg-slate-50 p-2.5 rounded-lg border border-slate-200">
                <span className="text-[10px] font-bold text-orange-800 uppercase font-mono block">Grade 1 (65-69g)</span>
                <input
                  type="number"
                  min="0"
                  value={grades.grade1}
                  onChange={(e) => handleGradeChange('grade1', Number(e.target.value))}
                  className="w-full mt-1 px-2 py-1 text-xs font-bold font-mono text-slate-900 bg-white border border-slate-200 rounded text-center"
                />
                <span className="text-[9px] text-slate-500 font-mono block text-center mt-1">
                  {(grades.grade1 / 30).toFixed(0)} trays
                </span>
              </div>

              <div className="bg-slate-50 p-2.5 rounded-lg border border-slate-200">
                <span className="text-[10px] font-bold text-yellow-800 uppercase font-mono block">Grade 2 (60-64g)</span>
                <input
                  type="number"
                  min="0"
                  value={grades.grade2}
                  onChange={(e) => handleGradeChange('grade2', Number(e.target.value))}
                  className="w-full mt-1 px-2 py-1 text-xs font-bold font-mono text-slate-900 bg-white border border-slate-200 rounded text-center"
                />
                <span className="text-[9px] text-slate-500 font-mono block text-center mt-1">
                  {(grades.grade2 / 30).toFixed(0)} trays
                </span>
              </div>

              <div className="bg-slate-50 p-2.5 rounded-lg border border-slate-200">
                <span className="text-[10px] font-bold text-emerald-800 uppercase font-mono block">Grade 3 (55-59g)</span>
                <input
                  type="number"
                  min="0"
                  value={grades.grade3}
                  onChange={(e) => handleGradeChange('grade3', Number(e.target.value))}
                  className="w-full mt-1 px-2 py-1 text-xs font-bold font-mono text-slate-900 bg-white border border-slate-200 rounded text-center"
                />
                <span className="text-[9px] text-slate-500 font-mono block text-center mt-1">
                  {(grades.grade3 / 30).toFixed(0)} trays
                </span>
              </div>

              <div className="bg-slate-50 p-2.5 rounded-lg border border-slate-200">
                <span className="text-[10px] font-bold text-blue-800 uppercase font-mono block">Grade 4 (50-54g)</span>
                <input
                  type="number"
                  min="0"
                  value={grades.grade4}
                  onChange={(e) => handleGradeChange('grade4', Number(e.target.value))}
                  className="w-full mt-1 px-2 py-1 text-xs font-bold font-mono text-slate-900 bg-white border border-slate-200 rounded text-center"
                />
                <span className="text-[9px] text-slate-500 font-mono block text-center mt-1">
                  {(grades.grade4 / 30).toFixed(0)} trays
                </span>
              </div>

              <div className="bg-slate-50 p-2.5 rounded-lg border border-slate-200">
                <span className="text-[10px] font-bold text-slate-600 uppercase font-mono block">Damaged / Crack</span>
                <input
                  type="number"
                  min="0"
                  value={grades.damaged}
                  onChange={(e) => handleGradeChange('damaged', Number(e.target.value))}
                  className="w-full mt-1 px-2 py-1 text-xs font-bold font-mono text-slate-900 bg-white border border-slate-200 rounded text-center"
                />
                <span className="text-[9px] text-slate-500 font-mono block text-center mt-1">
                  {(grades.damaged / 30).toFixed(0)} trays
                </span>
              </div>

            </div>
          </div>

          {/* Automatic Calculation Summary Bar */}
          <div className="p-3.5 bg-slate-900 text-white rounded-lg flex flex-col sm:flex-row items-center justify-between gap-3 font-mono">
            <div className="flex flex-wrap items-center gap-5 text-xs">
              <div>
                <span className="text-slate-400 block text-[10px]">TOTAL COLLECTED:</span>
                <span className="text-base font-bold text-amber-400">
                  {totalCollected.toLocaleString()} pcs ({(totalCollected / 30).toFixed(0)} trays)
                </span>
              </div>

              <div>
                <span className="text-slate-400 block text-[10px]">LAYING RATE:</span>
                <span className="text-base font-bold text-emerald-400">
                  {layingRate.toFixed(2)}%
                </span>
              </div>

              <div>
                <span className="text-slate-400 block text-[10px]">FEED RATIO:</span>
                <span className="text-base font-bold text-blue-300">
                  {currentHouse ? ((feedKg * 1000) / currentHouse.currentHenCount).toFixed(1) : '0'} g/hen/day
                </span>
              </div>
            </div>

            <div className="flex gap-2 w-full sm:w-auto">
              <button
                type="button"
                onClick={() => setIsFormOpen(false)}
                className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-medium rounded transition-colors"
              >
                CANCEL
              </button>
              <button
                type="submit"
                className="flex-1 sm:flex-none px-4 py-1.5 bg-red-600 hover:bg-red-700 text-white text-xs font-bold rounded shadow-xs transition-colors"
              >
                SAVE TO ARI SERVER
              </button>
            </div>
          </div>
        </form>
      )}

      {/* Production History Table */}
      <div className="bg-white rounded-xl border border-slate-200 flex flex-col shadow-xs overflow-hidden">
        <div className="px-4 py-3 border-b border-slate-100 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <h2 className="font-bold text-slate-800 text-xs uppercase tracking-wider font-mono">
              Production History & Batch Logs
            </h2>
            <span className="bg-slate-100 text-slate-600 text-[10px] font-mono font-bold px-1.5 py-0.5 rounded">
              {productions.length} LOGS
            </span>
          </div>
          <span className="text-[11px] text-slate-500 font-mono">Sorted by latest date</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-xs text-left border-collapse">
            <thead className="bg-slate-50 text-[10px] text-slate-400 uppercase font-bold font-mono">
              <tr>
                <th className="px-4 py-2.5 border-b border-slate-100">Date / Time</th>
                <th className="px-4 py-2.5 border-b border-slate-100">House</th>
                <th className="px-4 py-2.5 border-b border-slate-100 text-right">Total (Pcs)</th>
                <th className="px-4 py-2.5 border-b border-slate-100 text-center">Laying %</th>
                <th className="px-4 py-2.5 border-b border-slate-100 text-center">Grades (JB / 0 / 1 / 2 / 3 / 4)</th>
                <th className="px-4 py-2.5 border-b border-slate-100">Feed (kg)</th>
                <th className="px-4 py-2.5 border-b border-slate-100">Recorder</th>
                <th className="px-4 py-2.5 border-b border-slate-100 text-center">Action</th>
              </tr>
            </thead>
            <tbody className="font-mono text-[12px]">
              {productions.map((prod) => (
                <tr key={prod.id} className="border-b border-slate-50 hover:bg-slate-50 transition-colors">
                  <td className="px-4 py-2.5 font-bold text-slate-900 whitespace-nowrap">
                    {prod.date}
                  </td>
                  <td className="px-4 py-2.5 font-sans font-medium text-slate-800 whitespace-nowrap">
                    {prod.houseName}
                  </td>
                  <td className="px-4 py-2.5 text-right font-extrabold text-slate-900 whitespace-nowrap">
                    {prod.totalCollected.toLocaleString()}
                    <span className="text-[10px] text-slate-400 font-normal block font-sans">
                      ({(prod.totalCollected / 30).toFixed(0)} trays)
                    </span>
                  </td>
                  <td className="px-4 py-2.5 text-center whitespace-nowrap">
                    <span className="inline-block px-2 py-0.5 bg-emerald-50 text-emerald-700 font-bold rounded text-[10px]">
                      {prod.layingRatePercent.toFixed(1)}%
                    </span>
                  </td>
                  <td className="px-4 py-2.5 text-center">
                    <div className="inline-flex gap-1 text-[10px] font-mono">
                      <span className="px-1.5 py-0.5 bg-slate-100 text-amber-800 rounded font-bold" title="Jumbo">JB:{prod.grades.jumbo}</span>
                      <span className="px-1.5 py-0.5 bg-slate-100 text-red-800 rounded font-bold" title="Grade 0">0:{prod.grades.grade0}</span>
                      <span className="px-1.5 py-0.5 bg-slate-100 text-orange-800 rounded font-bold" title="Grade 1">1:{prod.grades.grade1}</span>
                      <span className="px-1.5 py-0.5 bg-slate-100 text-yellow-800 rounded font-bold" title="Grade 2">2:{prod.grades.grade2}</span>
                      <span className="px-1.5 py-0.5 bg-slate-100 text-emerald-800 rounded font-bold" title="Grade 3">3:{prod.grades.grade3}</span>
                    </div>
                  </td>
                  <td className="px-4 py-2.5 text-slate-700 whitespace-nowrap">
                    {prod.feedConsumedKg} kg
                  </td>
                  <td className="px-4 py-2.5 text-slate-600 font-sans text-xs whitespace-nowrap">
                    {prod.recordedBy}
                  </td>
                  <td className="px-4 py-2.5 text-center">
                    <button
                      onClick={() => onDeleteProduction(prod.id)}
                      className="p-1 text-slate-400 hover:text-red-600 rounded transition-colors"
                      title="ลบรายการ"
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
