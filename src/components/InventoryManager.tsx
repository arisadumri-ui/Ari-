import React, { useState } from 'react';
import { InventoryItem } from '../types';
import { Package, Plus, AlertTriangle, ArrowUpDown, Layers, CheckCircle2, ShieldAlert } from 'lucide-react';

interface InventoryManagerProps {
  inventory: InventoryItem[];
  onSaveItem: (item: InventoryItem) => void;
  onUpdateStock: (id: string, newStock: number) => void;
}

export const InventoryManager: React.FC<InventoryManagerProps> = ({
  inventory,
  onSaveItem,
  onUpdateStock,
}) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [adjustItemId, setAdjustItemId] = useState<string | null>(null);
  const [adjustAmount, setAdjustAmount] = useState<number>(0);
  const [isAddItemOpen, setIsAddItemOpen] = useState(false);

  // New Item form state
  const [newItemName, setNewItemName] = useState('');
  const [newItemCode, setNewItemCode] = useState('');
  const [newItemCategory, setNewItemCategory] = useState<InventoryItem['category']>('feed');
  const [newItemStock, setNewItemStock] = useState(100);
  const [newItemUnit, setNewItemUnit] = useState('กระสอบ');
  const [newItemMin, setNewItemMin] = useState(20);
  const [newItemCost, setNewItemCost] = useState(450);

  const filteredItems = selectedCategory === 'all'
    ? inventory
    : inventory.filter((i) => i.category === selectedCategory);

  const handleAdjustStock = (item: InventoryItem, delta: number) => {
    const newStock = Math.max(0, item.currentStock + delta);
    onUpdateStock(item.id, newStock);
  };

  const handleCreateItem = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newItemName.trim()) return;

    const item: InventoryItem = {
      id: `inv-${Date.now()}`,
      code: newItemCode.trim() || `ITM-${Date.now().toString().slice(-4)}`,
      name: newItemName.trim(),
      category: newItemCategory,
      currentStock: Number(newItemStock),
      unit: newItemUnit,
      minThreshold: Number(newItemMin),
      unitCost: Number(newItemCost),
      lastUpdated: new Date().toISOString(),
    };

    onSaveItem(item);
    setIsAddItemOpen(false);
    setNewItemName('');
  };

  return (
    <div className="space-y-5">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-white p-4 rounded-xl border border-slate-200 shadow-xs">
        <div>
          <h1 className="text-sm sm:text-base font-bold text-slate-900 font-mono flex items-center gap-2 uppercase tracking-wide">
            <Package className="w-4 h-4 text-red-600" />
            Inventory & Feed Stock Records
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            ตรวจนับสต็อกไข่ไก่แยกเกรด หัวอาหารสัตว์ แผงบรรจุภัณฑ์ และเวชภัณฑ์ (บริษัท ไก่นำโชค จำกัด)
          </p>
        </div>

        <button
          onClick={() => setIsAddItemOpen(!isAddItemOpen)}
          className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-900 hover:bg-slate-800 text-white rounded-md text-xs font-semibold shadow-xs transition-colors font-mono"
        >
          <Plus className="w-3.5 h-3.5" />
          {isAddItemOpen ? 'CLOSE FORM' : '+ NEW INVENTORY ITEM'}
        </button>
      </div>

      {/* Add Item Form */}
      {isAddItemOpen && (
        <form
          onSubmit={handleCreateItem}
          className="bg-white rounded-xl border border-slate-300 p-5 shadow-sm space-y-4 animate-in slide-in-from-top-2 duration-150"
        >
          <h2 className="text-xs font-bold text-slate-800 uppercase tracking-wider font-mono">
            Add New Item to Inventory Register
          </h2>
          
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div>
              <label className="block text-[11px] font-bold text-slate-600 uppercase font-mono mb-1">Item Name:</label>
              <input
                type="text"
                required
                placeholder="เช่น หัวอาหารไก่ไข่ เบอร์ 3"
                value={newItemName}
                onChange={(e) => setNewItemName(e.target.value)}
                className="w-full px-3 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-md font-mono"
              />
            </div>
            <div>
              <label className="block text-[11px] font-bold text-slate-600 uppercase font-mono mb-1">Category:</label>
              <select
                value={newItemCategory}
                onChange={(e) => setNewItemCategory(e.target.value as InventoryItem['category'])}
                className="w-full px-3 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-md font-mono"
              >
                <option value="eggs">🥚 ไข่ไก่ (Eggs)</option>
                <option value="feed">🌾 อาหารสัตว์ (Feed)</option>
                <option value="packaging">📦 บรรจุภัณฑ์ (Packaging)</option>
                <option value="medicine">💊 เวชภัณฑ์ / ยา (Medicine)</option>
                <option value="vaccine">💉 วัคซีน (Vaccine)</option>
              </select>
            </div>
            <div>
              <label className="block text-[11px] font-bold text-slate-600 uppercase font-mono mb-1">Unit of Measurement:</label>
              <input
                type="text"
                required
                placeholder="เช่น กระสอบ, แผง, ซอง"
                value={newItemUnit}
                onChange={(e) => setNewItemUnit(e.target.value)}
                className="w-full px-3 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-md font-mono"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div>
              <label className="block text-[11px] font-bold text-slate-600 uppercase font-mono mb-1">Initial Stock:</label>
              <input
                type="number"
                min="0"
                value={newItemStock}
                onChange={(e) => setNewItemStock(Number(e.target.value))}
                className="w-full px-3 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-md font-mono"
              />
            </div>
            <div>
              <label className="block text-[11px] font-bold text-slate-600 uppercase font-mono mb-1">Min Threshold Alert:</label>
              <input
                type="number"
                min="0"
                value={newItemMin}
                onChange={(e) => setNewItemMin(Number(e.target.value))}
                className="w-full px-3 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-md font-mono"
              />
            </div>
            <div>
              <label className="block text-[11px] font-bold text-slate-600 uppercase font-mono mb-1">Unit Cost (THB):</label>
              <input
                type="number"
                min="0"
                value={newItemCost}
                onChange={(e) => setNewItemCost(Number(e.target.value))}
                className="w-full px-3 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-md font-mono"
              />
            </div>
          </div>

          <div className="flex justify-end gap-2 pt-1 font-mono">
            <button
              type="button"
              onClick={() => setIsAddItemOpen(false)}
              className="px-3 py-1.5 bg-slate-200 hover:bg-slate-300 text-slate-700 text-xs font-medium rounded transition-colors"
            >
              CANCEL
            </button>
            <button
              type="submit"
              className="px-4 py-1.5 bg-red-600 hover:bg-red-700 text-white text-xs font-bold rounded shadow-xs transition-colors"
            >
              SAVE ITEM
            </button>
          </div>
        </form>
      )}

      {/* Filter Tabs */}
      <div className="flex flex-wrap gap-1.5 font-mono text-xs">
        {[
          { id: 'all', label: 'ALL ITEMS' },
          { id: 'eggs', label: '🥚 EGGS' },
          { id: 'feed', label: '🌾 FEED' },
          { id: 'packaging', label: '📦 PACKAGING' },
          { id: 'medicine', label: '💊 MED / VACCINE' },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setSelectedCategory(tab.id)}
            className={`px-3 py-1 rounded text-xs font-bold transition-colors ${
              selectedCategory === tab.id
                ? 'bg-slate-900 text-white'
                : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Items Cards / Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3.5">
        {filteredItems.map((item) => {
          const isLowStock = item.currentStock <= item.minThreshold;
          return (
            <div
              key={item.id}
              className={`bg-white rounded-xl border p-4 shadow-xs flex flex-col justify-between transition-colors ${
                isLowStock ? 'border-amber-300 bg-amber-50/10' : 'border-slate-200'
              }`}
            >
              <div>
                <div className="flex items-center justify-between">
                  <span className="px-2 py-0.5 bg-slate-100 text-slate-700 text-[10px] font-mono font-bold rounded">
                    {item.code}
                  </span>
                  {isLowStock && (
                    <span className="px-2 py-0.5 bg-amber-100 text-amber-900 text-[10px] font-bold font-mono rounded flex items-center gap-1">
                      <AlertTriangle className="w-3 h-3 text-amber-700" />
                      LOW STOCK
                    </span>
                  )}
                </div>

                <h3 className="text-xs font-bold text-slate-900 mt-2 font-sans">
                  {item.name}
                </h3>
                <p className="text-[11px] text-slate-500 mt-0.5 font-mono">
                  Est. Cost: ฿{item.unitCost} / {item.unit}
                </p>

                <div className="mt-3 p-2.5 bg-slate-50 rounded-lg border border-slate-100 flex items-baseline justify-between font-mono">
                  <div>
                    <span className="text-[9px] text-slate-400 block uppercase font-bold">CURRENT BALANCE</span>
                    <div className="flex items-baseline gap-1 mt-0.5">
                      <span className="text-xl font-black text-slate-900">
                        {item.currentStock.toLocaleString()}
                      </span>
                      <span className="text-[11px] font-normal text-slate-500 font-sans">{item.unit}</span>
                    </div>
                  </div>
                  <div className="text-right text-[10px] text-slate-500">
                    Threshold: {item.minThreshold.toLocaleString()}
                  </div>
                </div>
              </div>

              {/* Quick Adjust Buttons */}
              <div className="mt-3 pt-2.5 border-t border-slate-100 flex items-center justify-between gap-2 font-mono">
                <span className="text-[10px] text-slate-400 font-bold uppercase">Adjust:</span>
                <div className="flex items-center gap-1">
                  <button
                    onClick={() => handleAdjustStock(item, item.category === 'eggs' ? -300 : -10)}
                    className="px-2 py-0.5 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold rounded"
                    title="เบิกออก / ลดสต็อก"
                  >
                    -{item.category === 'eggs' ? '300' : '10'}
                  </button>
                  <button
                    onClick={() => handleAdjustStock(item, item.category === 'eggs' ? 300 : 10)}
                    className="px-2 py-0.5 bg-red-50 hover:bg-red-100 text-red-700 text-xs font-bold rounded border border-red-200"
                    title="รับเข้า / เพิ่มสต็อก"
                  >
                    +{item.category === 'eggs' ? '300' : '10'}
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
