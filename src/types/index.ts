export type EggGrade = 'jumbo' | 'grade0' | 'grade1' | 'grade2' | 'grade3' | 'grade4' | 'damaged';

export interface EggGradeDetails {
  jumbo: number;   // > 70g
  grade0: number;  // 70-74g
  grade1: number;  // 65-69g
  grade2: number;  // 60-64g
  grade3: number;  // 55-59g
  grade4: number;  // 50-54g
  damaged: number; // แตกร้าว / ตกเกรด
}

export interface User {
  id: string;
  email: string;
  name: string;
  avatar: string;
  role: 'owner' | 'manager' | 'supervisor' | 'staff';
  farmName: string;
  serverName: string;
  lastLogin: string;
}

export interface PoultryHouse {
  id: string;
  name: string;
  flockCode: string;
  breed: string; // เช่น โรมานน์บราวน์ (Lohmann Brown), ซีพี บราวน์
  initialHenCount: number;
  currentHenCount: number;
  ageWeeks: number;
  housedDate: string;
  status: 'active' | 'molting' | 'clearing' | 'empty';
}

export interface DailyProduction {
  id: string;
  date: string;
  houseId: string;
  houseName: string;
  grades: EggGradeDetails;
  totalCollected: number;
  mortalityCount: number;
  cullCount: number;
  feedConsumedKg: number;
  waterConsumedLiters?: number;
  layingRatePercent: number; // (totalCollected / currentHenCount) * 100
  notes?: string;
  recordedBy: string;
  createdAt: string;
}

export interface Customer {
  id: string;
  name: string;
  contactPerson: string;
  phone: string;
  address: string;
  taxId?: string;
  customerType: 'wholesale' | 'retail' | 'supermarket' | 'restaurant';
}

export interface OrderItem {
  id: string;
  type: 'egg_tray' | 'egg_box' | 'live_chicken' | 'manure_fertilizer' | 'egg_bulk';
  name: string;
  grade?: EggGrade;
  quantity: number; // จำนวนหน่วย (เช่น 50 แผง หรือ 1500 ฟอง)
  unit: string;     // 'แผง (30 ฟอง)', 'ฟอง', 'กล่อง (10 ฟอง)', 'กระสอบ', 'ตัว'
  unitPrice: number;
  totalPrice: number;
}

export interface SalesOrder {
  id: string;
  invoiceNumber: string;
  customerId: string;
  customerName: string;
  customerPhone?: string;
  customerAddress?: string;
  date: string;
  items: OrderItem[];
  subtotal: number;
  discount: number;
  vat: number; // 7% if applicable or 0%
  grandTotal: number;
  paymentMethod: 'cash' | 'transfer' | 'credit' | 'promptpay';
  paymentStatus: 'paid' | 'pending' | 'overdue';
  deliveryStatus: 'delivered' | 'pending' | 'shipping';
  soldBy: string;
  notes?: string;
  createdAt: string;
}

export interface InventoryItem {
  id: string;
  code: string;
  name: string;
  category: 'eggs' | 'feed' | 'packaging' | 'medicine' | 'vaccine';
  grade?: EggGrade;
  currentStock: number;
  unit: string;
  minThreshold: number;
  unitCost: number;
  lastUpdated: string;
}

export interface ExpenseRecord {
  id: string;
  date: string;
  category: 'feed' | 'medicine_vaccine' | 'labor' | 'utility' | 'packaging' | 'maintenance' | 'other';
  title: string;
  amount: number;
  houseId?: string;
  paidTo: string;
  recordedBy: string;
  receiptNumber?: string;
  notes?: string;
}

export interface AriServerConfig {
  serverName: string;
  projectId: string;
  status: 'connected' | 'syncing' | 'offline';
  lastSyncTime: string;
  totalRecordsSynced: number;
  autoSync: boolean;
}
