/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import {
  AriServerConfig,
  Customer,
  DailyProduction,
  ExpenseRecord,
  InventoryItem,
  PoultryHouse,
  SalesOrder,
  User,
} from './types';
import { AppStorage } from './utils/storage';
import { Navbar } from './components/Navbar';
import { Dashboard } from './components/Dashboard';
import { ProductionManager } from './components/ProductionManager';
import { SalesManager } from './components/SalesManager';
import { InventoryManager } from './components/InventoryManager';
import { FinancialManager } from './components/FinancialManager';
import { HousesManager } from './components/HousesManager';
import { AuthModal } from './components/AuthModal';
import { AriServerSyncModal } from './components/AriServerSyncModal';
import { Logo } from './components/Logo';
import { Server, ShieldCheck, Heart } from 'lucide-react';

export default function App() {
  // App States
  const [activeTab, setActiveTab] = useState<string>('dashboard');
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [serverConfig, setServerConfig] = useState<AriServerConfig>(AppStorage.getServerConfig());

  // Data Collections
  const [houses, setHouses] = useState<PoultryHouse[]>([]);
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [productions, setProductions] = useState<DailyProduction[]>([]);
  const [orders, setOrders] = useState<SalesOrder[]>([]);
  const [inventory, setInventory] = useState<InventoryItem[]>([]);
  const [expenses, setExpenses] = useState<ExpenseRecord[]>([]);

  // Modals
  const [isAuthOpen, setIsAuthOpen] = useState(false);
  const [isServerSyncOpen, setIsServerSyncOpen] = useState(false);

  // Initialize data on mount
  useEffect(() => {
    loadAllData();
  }, []);

  const loadAllData = () => {
    setCurrentUser(AppStorage.getUser());
    setHouses(AppStorage.getHouses());
    setCustomers(AppStorage.getCustomers());
    setProductions(AppStorage.getProductions());
    setOrders(AppStorage.getOrders());
    setInventory(AppStorage.getInventory());
    setExpenses(AppStorage.getExpenses());
    setServerConfig(AppStorage.getServerConfig());
  };

  // Handlers for Production
  const handleSaveProduction = (prod: DailyProduction) => {
    const updated = [prod, ...productions];
    setProductions(updated);
    AppStorage.saveProductions(updated);

    // Also update egg inventory automatically!
    const updatedInventory = [...inventory];
    const gradeMap: Record<string, number> = {
      'inv-egg-jumbo': prod.grades.jumbo,
      'inv-egg-0': prod.grades.grade0,
      'inv-egg-1': prod.grades.grade1,
      'inv-egg-2': prod.grades.grade2,
    };

    updatedInventory.forEach((inv) => {
      if (gradeMap[inv.id]) {
        inv.currentStock += gradeMap[inv.id];
        inv.lastUpdated = new Date().toISOString();
      }
    });

    setInventory(updatedInventory);
    AppStorage.saveInventory(updatedInventory);
  };

  const handleDeleteProduction = (id: string) => {
    const updated = productions.filter((p) => p.id !== id);
    setProductions(updated);
    AppStorage.saveProductions(updated);
  };

  // Handlers for Orders
  const handleSaveOrder = (order: SalesOrder) => {
    const updated = [order, ...orders];
    setOrders(updated);
    AppStorage.saveOrders(updated);

    // Deduct stock if egg trays were sold
    const updatedInventory = [...inventory];
    order.items.forEach((item) => {
      if (item.type === 'egg_tray') {
        const eggsSold = item.quantity * 30; // 30 eggs per tray
        if (item.grade === 'grade0') {
          const egg0 = updatedInventory.find((i) => i.id === 'inv-egg-0');
          if (egg0) egg0.currentStock = Math.max(0, egg0.currentStock - eggsSold);
        } else if (item.grade === 'grade1') {
          const egg1 = updatedInventory.find((i) => i.id === 'inv-egg-1');
          if (egg1) egg1.currentStock = Math.max(0, egg1.currentStock - eggsSold);
        } else if (item.grade === 'grade2') {
          const egg2 = updatedInventory.find((i) => i.id === 'inv-egg-2');
          if (egg2) egg2.currentStock = Math.max(0, egg2.currentStock - eggsSold);
        } else if (item.grade === 'jumbo') {
          const eggJb = updatedInventory.find((i) => i.id === 'inv-egg-jumbo');
          if (eggJb) eggJb.currentStock = Math.max(0, eggJb.currentStock - eggsSold);
        }
      }
    });
    setInventory(updatedInventory);
    AppStorage.saveInventory(updatedInventory);
  };

  const handleDeleteOrder = (id: string) => {
    const updated = orders.filter((o) => o.id !== id);
    setOrders(updated);
    AppStorage.saveOrders(updated);
  };

  // Handlers for Inventory
  const handleSaveInventoryItem = (item: InventoryItem) => {
    const updated = [item, ...inventory];
    setInventory(updated);
    AppStorage.saveInventory(updated);
  };

  const handleUpdateStock = (id: string, newStock: number) => {
    const updated = inventory.map((i) =>
      i.id === id ? { ...i, currentStock: newStock, lastUpdated: new Date().toISOString() } : i
    );
    setInventory(updated);
    AppStorage.saveInventory(updated);
  };

  // Handlers for Expenses
  const handleSaveExpense = (exp: ExpenseRecord) => {
    const updated = [exp, ...expenses];
    setExpenses(updated);
    AppStorage.saveExpenses(updated);
  };

  const handleDeleteExpense = (id: string) => {
    const updated = expenses.filter((e) => e.id !== id);
    setExpenses(updated);
    AppStorage.saveExpenses(updated);
  };

  // Handlers for Houses
  const handleSaveHouse = (house: PoultryHouse) => {
    const updated = [...houses, house];
    setHouses(updated);
    AppStorage.saveHouses(updated);
  };

  // Auth Handlers
  const handleLogin = (user: User) => {
    setCurrentUser(user);
    AppStorage.setUser(user);
  };

  const handleLogout = () => {
    setCurrentUser(null);
    AppStorage.setUser(null);
    setIsAuthOpen(false);
  };

  return (
    <div className="flex h-screen w-full bg-[#f1f5f9] font-sans text-slate-800 overflow-hidden selection:bg-red-500 selection:text-white">
      
      {/* Desktop High-Density Sidebar */}
      <Navbar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        currentUser={currentUser}
        onOpenAuth={() => setIsAuthOpen(true)}
        onOpenServerSync={() => setIsServerSyncOpen(true)}
        serverConfig={serverConfig}
      />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 overflow-y-auto bg-[#f1f5f9]">
        <main className="p-4 sm:p-6 space-y-6 max-w-[1440px] w-full mx-auto">
          {activeTab === 'dashboard' && (
            <Dashboard
              productions={productions}
              orders={orders}
              inventory={inventory}
              expenses={expenses}
              houses={houses}
              currentUser={currentUser}
              onNavigate={(tab) => setActiveTab(tab)}
              onOpenNewProduction={() => setActiveTab('production')}
              onOpenNewSale={() => setActiveTab('sales')}
              onOpenServerSync={() => setIsServerSyncOpen(true)}
            />
          )}

          {activeTab === 'production' && (
            <ProductionManager
              productions={productions}
              houses={houses}
              currentUser={currentUser}
              onSaveProduction={handleSaveProduction}
              onDeleteProduction={handleDeleteProduction}
            />
          )}

          {activeTab === 'sales' && (
            <SalesManager
              orders={orders}
              customers={customers}
              currentUser={currentUser}
              onSaveOrder={handleSaveOrder}
              onDeleteOrder={handleDeleteOrder}
              onSaveCustomer={(c) => {
                const u = [...customers, c];
                setCustomers(u);
                AppStorage.saveCustomers(u);
              }}
            />
          )}

          {activeTab === 'inventory' && (
            <InventoryManager
              inventory={inventory}
              onSaveItem={handleSaveInventoryItem}
              onUpdateStock={handleUpdateStock}
            />
          )}

          {activeTab === 'financials' && (
            <FinancialManager
              expenses={expenses}
              orders={orders}
              currentUser={currentUser}
              onSaveExpense={handleSaveExpense}
              onDeleteExpense={handleDeleteExpense}
            />
          )}

          {activeTab === 'houses' && (
            <HousesManager
              houses={houses}
              onSaveHouse={handleSaveHouse}
            />
          )}
        </main>

        {/* High Density Footer */}
        <footer className="mt-auto border-t border-slate-200 bg-white py-3 px-6 text-[11px] text-slate-500 shrink-0">
          <div className="max-w-[1440px] mx-auto flex flex-col sm:flex-row items-center justify-between gap-2 font-mono">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
              <span>KAI NAM CHOK CO., LTD. • ARI SERVER DB v4.9</span>
            </div>
            <div className="text-slate-400">
              User: <span className="text-slate-700">{currentUser ? currentUser.email : 'guest@kai.farm'}</span> • High Density Engine
            </div>
          </div>
        </footer>
      </div>

      {/* Google / Gmail Auth Modal */}
      <AuthModal
        isOpen={isAuthOpen}
        onClose={() => setIsAuthOpen(false)}
        currentUser={currentUser}
        onLogin={handleLogin}
        onLogout={handleLogout}
      />

      {/* Ari Server Management Modal */}
      <AriServerSyncModal
        isOpen={isServerSyncOpen}
        onClose={() => setIsServerSyncOpen(false)}
        serverConfig={serverConfig}
        onUpdateConfig={(cfg) => setServerConfig(cfg)}
        onDataImported={loadAllData}
      />
    </div>
  );
}
