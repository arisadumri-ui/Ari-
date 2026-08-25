import {
  AriServerConfig,
  Customer,
  DailyProduction,
  ExpenseRecord,
  InventoryItem,
  PoultryHouse,
  SalesOrder,
  User,
} from '../types';
import {
  DEFAULT_USER,
  INITIAL_CUSTOMERS,
  INITIAL_EXPENSES,
  INITIAL_HOUSES,
  INITIAL_INVENTORY,
  INITIAL_ORDERS,
  INITIAL_PRODUCTIONS,
} from './mockData';

const STORAGE_KEYS = {
  USER: 'knc_user_auth',
  HOUSES: 'knc_poultry_houses',
  CUSTOMERS: 'knc_customers',
  PRODUCTIONS: 'knc_productions',
  ORDERS: 'knc_orders',
  INVENTORY: 'knc_inventory',
  EXPENSES: 'knc_expenses',
  SERVER_CONFIG: 'knc_ari_server_config',
};

export const DEFAULT_SERVER_CONFIG: AriServerConfig = {
  serverName: 'Ari Server (Cloud Firestore Simulation)',
  projectId: 'ari-server-poultry-knc',
  status: 'connected',
  lastSyncTime: new Date().toLocaleTimeString('th-TH', { hour: '2-digit', minute: '2-digit' }),
  totalRecordsSynced: 24,
  autoSync: true,
};

export class AppStorage {
  static getUser(): User | null {
    const data = localStorage.getItem(STORAGE_KEYS.USER);
    if (data) {
      try {
        return JSON.parse(data);
      } catch (e) {
        console.error('Failed to parse user', e);
      }
    }
    return DEFAULT_USER; // Default logged in as Arisa Damri
  }

  static setUser(user: User | null): void {
    if (user) {
      localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(user));
    } else {
      localStorage.removeItem(STORAGE_KEYS.USER);
    }
  }

  static getHouses(): PoultryHouse[] {
    const data = localStorage.getItem(STORAGE_KEYS.HOUSES);
    if (data) {
      try { return JSON.parse(data); } catch {}
    }
    return INITIAL_HOUSES;
  }

  static saveHouses(houses: PoultryHouse[]): void {
    localStorage.setItem(STORAGE_KEYS.HOUSES, JSON.stringify(houses));
  }

  static getCustomers(): Customer[] {
    const data = localStorage.getItem(STORAGE_KEYS.CUSTOMERS);
    if (data) {
      try { return JSON.parse(data); } catch {}
    }
    return INITIAL_CUSTOMERS;
  }

  static saveCustomers(customers: Customer[]): void {
    localStorage.setItem(STORAGE_KEYS.CUSTOMERS, JSON.stringify(customers));
  }

  static getProductions(): DailyProduction[] {
    const data = localStorage.getItem(STORAGE_KEYS.PRODUCTIONS);
    if (data) {
      try { return JSON.parse(data); } catch {}
    }
    return INITIAL_PRODUCTIONS;
  }

  static saveProductions(productions: DailyProduction[]): void {
    localStorage.setItem(STORAGE_KEYS.PRODUCTIONS, JSON.stringify(productions));
  }

  static getOrders(): SalesOrder[] {
    const data = localStorage.getItem(STORAGE_KEYS.ORDERS);
    if (data) {
      try { return JSON.parse(data); } catch {}
    }
    return INITIAL_ORDERS;
  }

  static saveOrders(orders: SalesOrder[]): void {
    localStorage.setItem(STORAGE_KEYS.ORDERS, JSON.stringify(orders));
  }

  static getInventory(): InventoryItem[] {
    const data = localStorage.getItem(STORAGE_KEYS.INVENTORY);
    if (data) {
      try { return JSON.parse(data); } catch {}
    }
    return INITIAL_INVENTORY;
  }

  static saveInventory(inventory: InventoryItem[]): void {
    localStorage.setItem(STORAGE_KEYS.INVENTORY, JSON.stringify(inventory));
  }

  static getExpenses(): ExpenseRecord[] {
    const data = localStorage.getItem(STORAGE_KEYS.EXPENSES);
    if (data) {
      try { return JSON.parse(data); } catch {}
    }
    return INITIAL_EXPENSES;
  }

  static saveExpenses(expenses: ExpenseRecord[]): void {
    localStorage.setItem(STORAGE_KEYS.EXPENSES, JSON.stringify(expenses));
  }

  static getServerConfig(): AriServerConfig {
    const data = localStorage.getItem(STORAGE_KEYS.SERVER_CONFIG);
    if (data) {
      try { return JSON.parse(data); } catch {}
    }
    return DEFAULT_SERVER_CONFIG;
  }

  static saveServerConfig(config: AriServerConfig): void {
    localStorage.setItem(STORAGE_KEYS.SERVER_CONFIG, JSON.stringify(config));
  }

  static exportFullBackupJSON(): string {
    const backup = {
      version: '1.0.0',
      timestamp: new Date().toISOString(),
      company: 'KAI NAM CHOK CO., LTD.',
      companyTh: 'บริษัท ไก่นำโชค จำกัด',
      server: 'Ari Server',
      data: {
        houses: this.getHouses(),
        customers: this.getCustomers(),
        productions: this.getProductions(),
        orders: this.getOrders(),
        inventory: this.getInventory(),
        expenses: this.getExpenses(),
      }
    };
    return JSON.stringify(backup, null, 2);
  }

  static importBackupJSON(jsonStr: string): boolean {
    try {
      const parsed = JSON.parse(jsonStr);
      if (parsed.data) {
        if (parsed.data.houses) this.saveHouses(parsed.data.houses);
        if (parsed.data.customers) this.saveCustomers(parsed.data.customers);
        if (parsed.data.productions) this.saveProductions(parsed.data.productions);
        if (parsed.data.orders) this.saveOrders(parsed.data.orders);
        if (parsed.data.inventory) this.saveInventory(parsed.data.inventory);
        if (parsed.data.expenses) this.saveExpenses(parsed.data.expenses);
        return true;
      }
      return false;
    } catch (e) {
      console.error('Import failed', e);
      return false;
    }
  }

  static resetToDefault(): void {
    localStorage.clear();
  }
}
