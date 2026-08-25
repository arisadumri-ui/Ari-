import React, { useState } from 'react';
import { PoultryHouse } from '../types';
import { Building2, Plus, Edit3, Trash2, CheckCircle2, ShieldCheck } from 'lucide-react';

interface HousesManagerProps {
  houses: PoultryHouse[];
  onSaveHouse: (house: PoultryHouse) => void;
}

export const HousesManager: React.FC<HousesManagerProps> = ({ houses, onSaveHouse }) => {
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [name, setName] = useState('');
  const [breed, setBreed] = useState('โรมานน์บราวน์ (Lohmann Brown)');
  const [henCount, setHenCount] = useState(10000);
  const [ageWeeks, setAgeWeeks] = useState(25);

  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    const house: PoultryHouse = {
      id: `house-${Date.now()}`,
      name: name.trim(),
      flockCode: `FLOCK-2026-${Date.now().toString().slice(-3)}`,
      breed,
      initialHenCount: Number(henCount),
      currentHenCount: Number(henCount),
      ageWeeks: Number(ageWeeks),
      housedDate: new Date().toISOString().slice(0, 10),
      status: 'active',
    };

    onSaveHouse(house);
    setIsAddOpen(false);
    setName('');
  };

  return (
    <div className="space-y-5">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-white p-4 rounded-xl border border-slate-200 shadow-xs">
        <div>
          <h1 className="text-sm sm:text-base font-bold text-slate-900 font-mono flex items-center gap-2 uppercase tracking-wide">
            <Building2 className="w-4 h-4 text-red-600" />
            Poultry Houses & Flock Configuration
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            โรงเรือนระบบปิด Evaporative Cooling System ควบคุมอุณหภูมิและความชื้นมาตรฐาน
          </p>
        </div>

        <button
          onClick={() => setIsAddOpen(!isAddOpen)}
          className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-900 hover:bg-slate-800 text-white rounded-md text-xs font-semibold shadow-xs transition-colors font-mono"
        >
          <Plus className="w-3.5 h-3.5" />
          {isAddOpen ? 'CLOSE FORM' : '+ NEW POULTRY HOUSE'}
        </button>
      </div>

      {/* Add House Form */}
      {isAddOpen && (
        <form
          onSubmit={handleCreate}
          className="bg-white rounded-xl border border-slate-300 p-5 shadow-sm space-y-4 animate-in slide-in-from-top-2 duration-150"
        >
          <h2 className="text-xs font-bold text-slate-800 uppercase tracking-wider font-mono">
            Register New Poultry House & Flock
          </h2>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
            <div>
              <label className="block text-[11px] font-bold text-slate-600 uppercase font-mono mb-1">House Name:</label>
              <input
                type="text"
                required
                placeholder="เช่น โรงเรือน A3 (ปิด Evap)"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full px-3 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-md font-mono"
              />
            </div>
            <div>
              <label className="block text-[11px] font-bold text-slate-600 uppercase font-mono mb-1">Breed:</label>
              <select
                value={breed}
                onChange={(e) => setBreed(e.target.value)}
                className="w-full px-3 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-md font-mono"
              >
                <option value="โรมานน์บราวน์ (Lohmann Brown)">โรมานน์บราวน์ (Lohmann Brown)</option>
                <option value="ซีพี บราวน์ (CP Brown)">ซีพี บราวน์ (CP Brown)</option>
                <option value="ไฮไลน์บราวน์ (Hy-Line Brown)">ไฮไลน์บราวน์ (Hy-Line Brown)</option>
                <option value="โนโวเจน (Novogen Brown)">โนโวเจน (Novogen Brown)</option>
              </select>
            </div>
            <div>
              <label className="block text-[11px] font-bold text-slate-600 uppercase font-mono mb-1">Hen Population:</label>
              <input
                type="number"
                min="100"
                value={henCount}
                onChange={(e) => setHenCount(Number(e.target.value))}
                className="w-full px-3 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-md font-mono font-bold"
              />
            </div>
            <div>
              <label className="block text-[11px] font-bold text-slate-600 uppercase font-mono mb-1">Hen Age (Weeks):</label>
              <input
                type="number"
                min="16"
                max="100"
                value={ageWeeks}
                onChange={(e) => setAgeWeeks(Number(e.target.value))}
                className="w-full px-3 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-md font-mono font-bold"
              />
            </div>
          </div>

          <div className="flex justify-end gap-2 pt-1 font-mono">
            <button
              type="button"
              onClick={() => setIsAddOpen(false)}
              className="px-3 py-1.5 bg-slate-200 hover:bg-slate-300 text-slate-700 text-xs font-medium rounded transition-colors"
            >
              CANCEL
            </button>
            <button
              type="submit"
              className="px-4 py-1.5 bg-red-600 hover:bg-red-700 text-white text-xs font-bold rounded shadow-xs transition-colors"
            >
              SAVE HOUSE
            </button>
          </div>
        </form>
      )}

      {/* Houses List */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {houses.map((h) => (
          <div
            key={h.id}
            className="bg-white rounded-xl border border-slate-200 p-4 shadow-xs hover:border-slate-300 transition-colors space-y-3"
          >
            <div className="flex items-center justify-between border-b border-slate-100 pb-2.5">
              <div>
                <h3 className="font-bold text-slate-900 text-xs font-sans">
                  {h.name}
                </h3>
                <span className="text-[10px] font-mono text-slate-400 font-bold">{h.flockCode}</span>
              </div>
              <span className="px-2 py-0.5 bg-emerald-50 text-emerald-700 text-[9px] font-mono font-bold rounded">
                ACTIVE
              </span>
            </div>

            <div className="space-y-1.5 text-xs font-mono">
              <div className="flex justify-between text-slate-600">
                <span className="text-slate-400 text-[11px]">Breed:</span>
                <span className="font-bold text-slate-900 font-sans text-xs">{h.breed}</span>
              </div>
              <div className="flex justify-between text-slate-600">
                <span className="text-slate-400 text-[11px]">Flock Age:</span>
                <span className="font-bold text-slate-900">{h.ageWeeks} wks</span>
              </div>
              <div className="flex justify-between text-slate-600">
                <span className="text-slate-400 text-[11px]">Live Population:</span>
                <span className="font-black text-red-600">
                  {h.currentHenCount.toLocaleString()} birds
                </span>
              </div>
              <div className="flex justify-between text-slate-600">
                <span className="text-slate-400 text-[11px]">Housed Date:</span>
                <span className="text-slate-700">{h.housedDate}</span>
              </div>
            </div>

            <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-[10px] font-mono text-slate-500">
              <span>Cooling: Evap Auto</span>
              <span className="text-emerald-700 font-bold bg-emerald-50 px-1.5 py-0.5 rounded">25.4°C / 65% RH</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
