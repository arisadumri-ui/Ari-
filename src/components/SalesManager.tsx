import React, { useState } from 'react';
import { Customer, EggGrade, OrderItem, SalesOrder, User } from '../types';
import { InvoiceModal } from './InvoiceModal';
import confetti from 'canvas-confetti';
import { Receipt, Plus, Trash2, Printer, CheckCircle, FileText, UserPlus, ShoppingCart, Percent } from 'lucide-react';

interface SalesManagerProps {
  orders: SalesOrder[];
  customers: Customer[];
  currentUser: User | null;
  onSaveOrder: (order: SalesOrder) => void;
  onDeleteOrder: (id: string) => void;
  onSaveCustomer: (cust: Customer) => void;
}

export const SalesManager: React.FC<SalesManagerProps> = ({
  orders,
  customers,
  currentUser,
  onSaveOrder,
  onDeleteOrder,
  onSaveCustomer,
}) => {
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [selectedCustomer, setSelectedCustomer] = useState(customers[0]?.id || 'cust-1');
  const [customCustomerName, setCustomCustomerName] = useState('');
  const [customCustomerPhone, setCustomCustomerPhone] = useState('');
  const [paymentMethod, setPaymentMethod] = useState<SalesOrder['paymentMethod']>('transfer');
  const [paymentStatus, setPaymentStatus] = useState<SalesOrder['paymentStatus']>('paid');
  const [deliveryStatus, setDeliveryStatus] = useState<SalesOrder['deliveryStatus']>('delivered');
  const [discount, setDiscount] = useState(0);
  const [notes, setNotes] = useState('');

  // Selected Order for Invoice modal
  const [activeInvoiceOrder, setActiveInvoiceOrder] = useState<SalesOrder | null>(null);

  // Line items for current new order
  const [items, setItems] = useState<OrderItem[]>([
    {
      id: 'it-1',
      type: 'egg_tray',
      name: 'ไข่ไก่สดคละเกรด คัดพิเศษ เบอร์ 0',
      grade: 'grade0',
      quantity: 50,
      unit: 'แผง (30 ฟอง)',
      unitPrice: 135,
      totalPrice: 6750,
    },
    {
      id: 'it-2',
      type: 'egg_tray',
      name: 'ไข่ไก่สดคละเกรด คัดพิเศษ เบอร์ 1',
      grade: 'grade1',
      quantity: 50,
      unit: 'แผง (30 ฟอง)',
      unitPrice: 126,
      totalPrice: 6300,
    }
  ]);

  const presetProducts = [
    { name: 'ไข่ไก่สด จัมโบ้ (>70g)', grade: 'jumbo' as EggGrade, price: 145, unit: 'แผง (30 ฟอง)' },
    { name: 'ไข่ไก่สด เบอร์ 0 (70-74g)', grade: 'grade0' as EggGrade, price: 135, unit: 'แผง (30 ฟอง)' },
    { name: 'ไข่ไก่สด เบอร์ 1 (65-69g)', grade: 'grade1' as EggGrade, price: 126, unit: 'แผง (30 ฟอง)' },
    { name: 'ไข่ไก่สด เบอร์ 2 (60-64g)', grade: 'grade2' as EggGrade, price: 117, unit: 'แผง (30 ฟอง)' },
    { name: 'ไข่ไก่สด เบอร์ 3 (55-59g)', grade: 'grade3' as EggGrade, price: 108, unit: 'แผง (30 ฟอง)' },
    { name: 'ไข่ไก่สด เบอร์ 4 (50-54g)', grade: 'grade4' as EggGrade, price: 98, unit: 'แผง (30 ฟอง)' },
    { name: 'มูลไก่อัดเม็ด/ตากแห้ง (ปุ๋ยอินทรีย์)', grade: undefined, price: 65, unit: 'กระสอบ (25 กก.)' },
    { name: 'แม่ไก่ปลดระวาง (ไก่เนื้อ)', grade: undefined, price: 85, unit: 'ตัว' },
  ];

  const subtotal = items.reduce((sum, it) => sum + it.totalPrice, 0);
  const grandTotal = Math.max(0, subtotal - discount);

  const handleAddItem = (preset: typeof presetProducts[0]) => {
    const newItem: OrderItem = {
      id: `it-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`,
      type: preset.name.includes('มูลไก่') ? 'manure_fertilizer' : preset.name.includes('แม่ไก่') ? 'live_chicken' : 'egg_tray',
      name: preset.name,
      grade: preset.grade,
      quantity: 10,
      unit: preset.unit,
      unitPrice: preset.price,
      totalPrice: 10 * preset.price,
    };
    setItems((prev) => [...prev, newItem]);
  };

  const handleUpdateItem = (id: string, qty: number, price: number) => {
    setItems((prev) =>
      prev.map((it) =>
        it.id === id
          ? {
              ...it,
              quantity: Math.max(1, qty),
              unitPrice: Math.max(0, price),
              totalPrice: Math.max(1, qty) * Math.max(0, price),
            }
          : it
      )
    );
  };

  const handleRemoveItem = (id: string) => {
    setItems((prev) => prev.filter((it) => it.id !== id));
  };

  const handleSubmitOrder = (e: React.FormEvent) => {
    e.preventDefault();
    if (items.length === 0) return;

    let custName = customCustomerName;
    let custPhone = customCustomerPhone;
    let custAddress = '';

    if (selectedCustomer !== 'new') {
      const found = customers.find((c) => c.id === selectedCustomer);
      if (found) {
        custName = found.name;
        custPhone = found.phone;
        custAddress = found.address;
      }
    }

    const orderNum = `KNC-INV-${new Date().toISOString().slice(0, 10).replace(/-/g, '')}-${String(orders.length + 1).padStart(3, '0')}`;

    const newOrder: SalesOrder = {
      id: `ord-${Date.now()}`,
      invoiceNumber: orderNum,
      customerId: selectedCustomer,
      customerName: custName || 'ลูกค้าทั่วไป (หน้าร้าน)',
      customerPhone: custPhone,
      customerAddress: custAddress,
      date: new Date().toISOString().slice(0, 10),
      items: [...items],
      subtotal,
      discount: Number(discount),
      vat: 0,
      grandTotal,
      paymentMethod,
      paymentStatus,
      deliveryStatus,
      soldBy: currentUser ? currentUser.name : 'คุณอริสา ดำริ',
      notes,
      createdAt: new Date().toISOString(),
    };

    onSaveOrder(newOrder);
    setIsFormOpen(false);

    // Fire celebratory confetti
    try {
      confetti({
        particleCount: 80,
        spread: 60,
        origin: { y: 0.7 },
      });
    } catch {}

    // Auto open invoice preview
    setActiveInvoiceOrder(newOrder);
  };

  return (
    <div className="space-y-5">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-white p-4 rounded-xl border border-slate-200 shadow-xs">
        <div>
          <h1 className="text-sm sm:text-base font-bold text-slate-900 font-mono flex items-center gap-2 uppercase tracking-wide">
            <Receipt className="w-4 h-4 text-red-600" />
            Sales Orders & Invoicing System
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            สร้างใบกำกับสินค้า ใบเสร็จรับเงิน และใบส่งของ บริษัท ไก่นำโชค จำกัด
          </p>
        </div>

        <button
          onClick={() => setIsFormOpen(!isFormOpen)}
          className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-900 hover:bg-slate-800 text-white rounded-md text-xs font-semibold shadow-xs transition-colors font-mono"
        >
          <Plus className="w-3.5 h-3.5" />
          {isFormOpen ? 'CLOSE FORM' : '+ NEW SALES INVOICE'}
        </button>
      </div>

      {/* New Order Builder Form */}
      {isFormOpen && (
        <form
          onSubmit={handleSubmitOrder}
          className="bg-white rounded-xl border border-slate-300 p-5 shadow-sm space-y-4 animate-in slide-in-from-top-2 duration-150"
        >
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <h2 className="text-xs font-bold text-slate-800 uppercase tracking-wider font-mono flex items-center gap-2">
              <ShoppingCart className="w-4 h-4 text-red-600" />
              Create Sales Order & Dispatch Slip
            </h2>
            <span className="text-[11px] text-slate-500 font-mono">
              Seller: <strong className="text-slate-800">{currentUser ? currentUser.name : 'คุณอริสา ดำริ'}</strong>
            </span>
          </div>

          {/* Customer Selection */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
            <div>
              <label className="block text-[11px] font-bold text-slate-600 uppercase font-mono mb-1">
                Select Customer / Partner:
              </label>
              <select
                value={selectedCustomer}
                onChange={(e) => setSelectedCustomer(e.target.value)}
                className="w-full px-3 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-md focus:ring-1 focus:ring-slate-900 focus:outline-none font-mono"
              >
                {customers.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.name} ({c.phone})
                  </option>
                ))}
                <option value="new">+ ลูกค้าใหม่ / ซื้อหน้าร้าน</option>
              </select>
            </div>

            {selectedCustomer === 'new' ? (
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-[11px] font-bold text-slate-600 uppercase font-mono mb-1">
                    Customer Name:
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="เช่น ร้านสมบูรณ์โภชนา"
                    value={customCustomerName}
                    onChange={(e) => setCustomCustomerName(e.target.value)}
                    className="w-full px-3 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-md font-mono"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-bold text-slate-600 uppercase font-mono mb-1">
                    Phone:
                  </label>
                  <input
                    type="text"
                    placeholder="08X-XXX-XXXX"
                    value={customCustomerPhone}
                    onChange={(e) => setCustomCustomerPhone(e.target.value)}
                    className="w-full px-3 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-md font-mono"
                  />
                </div>
              </div>
            ) : (
              <div>
                <label className="block text-[11px] font-bold text-slate-600 uppercase font-mono mb-1">
                  Payment Method:
                </label>
                <select
                  value={paymentMethod}
                  onChange={(e) => setPaymentMethod(e.target.value as SalesOrder['paymentMethod'])}
                  className="w-full px-3 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-md focus:ring-1 focus:ring-slate-900 focus:outline-none font-mono"
                >
                  <option value="transfer">โอนเงินผ่านธนาคาร (KBANK 123-4-56789-0)</option>
                  <option value="promptpay">พร้อมเพย์ (PromptPay)</option>
                  <option value="cash">เงินสด (Cash)</option>
                  <option value="credit">เครดิตเทอม (Credit Term)</option>
                </select>
              </div>
            )}
          </div>

          {/* Preset Quick Product Buttons */}
          <div>
            <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider font-mono mb-1.5">
              Quick Add Presets:
            </label>
            <div className="flex flex-wrap gap-1.5">
              {presetProducts.map((p, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => handleAddItem(p)}
                  className="px-2.5 py-1 bg-slate-50 hover:bg-slate-100 hover:text-slate-900 text-slate-600 text-xs font-mono rounded border border-slate-200 transition-colors flex items-center gap-1"
                >
                  <Plus className="w-3 h-3 text-slate-400" />
                  {p.name.split(' ')[1] || p.name} (฿{p.price})
                </button>
              ))}
            </div>
          </div>

          {/* Line Items Table */}
          <div className="border border-slate-200 rounded-lg overflow-hidden">
            <table className="w-full text-xs text-left border-collapse font-mono">
              <thead className="bg-slate-50 text-[10px] text-slate-400 font-bold uppercase border-b border-slate-200">
                <tr>
                  <th className="py-2 px-3 font-sans">Product Item</th>
                  <th className="py-2 px-3 text-center w-24">Qty</th>
                  <th className="py-2 px-3 font-sans">Unit</th>
                  <th className="py-2 px-3 text-right w-28">Unit Price</th>
                  <th className="py-2 px-3 text-right w-28">Total</th>
                  <th className="py-2 px-3 text-center w-12">Del</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-xs">
                {items.map((item) => (
                  <tr key={item.id}>
                    <td className="py-2 px-3 font-sans font-semibold text-slate-900">{item.name}</td>
                    <td className="py-2 px-3 text-center">
                      <input
                        type="number"
                        min="1"
                        value={item.quantity}
                        onChange={(e) => handleUpdateItem(item.id, Number(e.target.value), item.unitPrice)}
                        className="w-16 px-1.5 py-0.5 text-center font-bold text-slate-900 border border-slate-200 rounded bg-white text-xs"
                      />
                    </td>
                    <td className="py-2 px-3 text-slate-500 font-sans text-[11px]">{item.unit}</td>
                    <td className="py-2 px-3 text-right">
                      <input
                        type="number"
                        min="0"
                        value={item.unitPrice}
                        onChange={(e) => handleUpdateItem(item.id, item.quantity, Number(e.target.value))}
                        className="w-20 px-1.5 py-0.5 text-right font-bold text-slate-900 border border-slate-200 rounded bg-white text-xs"
                      />
                    </td>
                    <td className="py-2 px-3 text-right font-extrabold text-slate-900">
                      ฿{item.totalPrice.toLocaleString()}
                    </td>
                    <td className="py-2 px-3 text-center">
                      <button
                        type="button"
                        onClick={() => handleRemoveItem(item.id)}
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

          {/* Calculations & Order Confirmation */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 bg-slate-50 p-3.5 rounded-lg border border-slate-200">
            <div className="space-y-2.5">
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-[10px] font-bold text-slate-600 uppercase font-mono mb-1">
                    Payment Status:
                  </label>
                  <select
                    value={paymentStatus}
                    onChange={(e) => setPaymentStatus(e.target.value as SalesOrder['paymentStatus'])}
                    className="w-full px-2 py-1 text-xs bg-white border border-slate-200 rounded font-mono"
                  >
                    <option value="paid">✓ PAID</option>
                    <option value="pending">PENDING (CREDIT)</option>
                  </select>
                </div>
                <div>
                  <label className="block text-[10px] font-bold text-slate-600 uppercase font-mono mb-1">
                    Delivery Status:
                  </label>
                  <select
                    value={deliveryStatus}
                    onChange={(e) => setDeliveryStatus(e.target.value as SalesOrder['deliveryStatus'])}
                    className="w-full px-2 py-1 text-xs bg-white border border-slate-200 rounded font-mono"
                  >
                    <option value="delivered">DELIVERED</option>
                    <option value="shipping">SHIPPING</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-[10px] font-bold text-slate-600 uppercase font-mono mb-1">
                  Notes / Vehicle Plate:
                </label>
                <input
                  type="text"
                  placeholder="เช่น ส่งรอบเช้า รถกระบะ KNC-01"
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  className="w-full px-2.5 py-1 text-xs bg-white border border-slate-200 rounded"
                />
              </div>
            </div>

            <div className="space-y-1.5 text-xs text-right font-mono">
              <div className="flex justify-between py-0.5">
                <span className="text-slate-500 font-sans">Subtotal:</span>
                <span className="font-bold text-slate-900">฿{subtotal.toLocaleString()}</span>
              </div>
              <div className="flex justify-between items-center py-0.5">
                <span className="text-slate-500 font-sans">Discount (THB):</span>
                <input
                  type="number"
                  min="0"
                  value={discount}
                  onChange={(e) => setDiscount(Number(e.target.value))}
                  className="w-24 px-2 py-0.5 text-right font-bold text-red-600 border border-slate-200 rounded bg-white text-xs"
                />
              </div>
              <div className="flex justify-between py-1.5 border-t border-slate-200 text-sm font-extrabold text-slate-900">
                <span className="font-sans">Grand Total:</span>
                <span className="text-base text-red-600">฿{grandTotal.toLocaleString()}</span>
              </div>

              <div className="flex justify-end gap-2 pt-1">
                <button
                  type="button"
                  onClick={() => setIsFormOpen(false)}
                  className="px-3 py-1.5 text-xs bg-slate-200 hover:bg-slate-300 text-slate-700 rounded font-medium transition-colors"
                >
                  CANCEL
                </button>
                <button
                  type="submit"
                  disabled={items.length === 0}
                  className="px-4 py-1.5 bg-red-600 hover:bg-red-700 text-white text-xs font-bold rounded shadow-xs transition-colors"
                >
                  GENERATE INVOICE
                </button>
              </div>
            </div>
          </div>
        </form>
      )}

      {/* Orders Table */}
      <div className="bg-white rounded-xl border border-slate-200 flex flex-col shadow-xs overflow-hidden">
        <div className="px-4 py-3 border-b border-slate-100 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <h2 className="font-bold text-slate-800 text-xs uppercase tracking-wider font-mono">
              Invoices & Delivery Slips
            </h2>
            <span className="bg-slate-100 text-slate-600 text-[10px] font-mono font-bold px-1.5 py-0.5 rounded">
              {orders.length} ORDERS
            </span>
          </div>
          <span className="text-[11px] text-slate-500 font-mono">Synced with Ari Server</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-xs text-left border-collapse">
            <thead className="bg-slate-50 text-[10px] text-slate-400 uppercase font-bold font-mono">
              <tr>
                <th className="px-4 py-2.5 border-b border-slate-100">Invoice No</th>
                <th className="px-4 py-2.5 border-b border-slate-100">Date</th>
                <th className="px-4 py-2.5 border-b border-slate-100">Customer / Phone</th>
                <th className="px-4 py-2.5 border-b border-slate-100">Items</th>
                <th className="px-4 py-2.5 border-b border-slate-100 text-right">Grand Total</th>
                <th className="px-4 py-2.5 border-b border-slate-100 text-center">Status</th>
                <th className="px-4 py-2.5 border-b border-slate-100 text-center">Invoice</th>
                <th className="px-4 py-2.5 border-b border-slate-100 text-center">Del</th>
              </tr>
            </thead>
            <tbody className="font-mono text-[12px]">
              {orders.map((order) => (
                <tr key={order.id} className="border-b border-slate-50 hover:bg-slate-50 transition-colors">
                  <td className="px-4 py-2.5 font-bold text-slate-900 whitespace-nowrap">
                    {order.invoiceNumber}
                  </td>
                  <td className="px-4 py-2.5 text-slate-500 whitespace-nowrap">{order.date}</td>
                  <td className="px-4 py-2.5">
                    <span className="font-sans font-semibold text-slate-900 block text-xs">{order.customerName}</span>
                    <span className="text-[10px] text-slate-400">{order.customerPhone}</span>
                  </td>
                  <td className="px-4 py-2.5 text-slate-600 font-sans text-xs max-w-xs truncate">
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
                  <td className="px-4 py-2.5 text-center whitespace-nowrap">
                    <button
                      onClick={() => setActiveInvoiceOrder(order)}
                      className="inline-flex items-center gap-1 px-2 py-1 bg-slate-100 hover:bg-slate-200 text-slate-800 font-semibold rounded text-[11px] transition-colors"
                    >
                      <Printer className="w-3 h-3 text-slate-500" />
                      PRINT
                    </button>
                  </td>
                  <td className="px-4 py-2.5 text-center whitespace-nowrap">
                    <button
                      onClick={() => onDeleteOrder(order.id)}
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

      {/* Invoice Modal */}
      <InvoiceModal
        isOpen={Boolean(activeInvoiceOrder)}
        order={activeInvoiceOrder}
        onClose={() => setActiveInvoiceOrder(null)}
      />
    </div>
  );
};
