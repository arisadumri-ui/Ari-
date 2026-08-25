import React from 'react';
import { SalesOrder } from '../types';
import { Logo } from './Logo';
import { Printer, Download, Check, X, Building, Phone, Mail, FileText } from 'lucide-react';

interface InvoiceModalProps {
  order: SalesOrder | null;
  isOpen: boolean;
  onClose: () => void;
}

export const InvoiceModal: React.FC<InvoiceModalProps> = ({ order, isOpen, onClose }) => {
  if (!isOpen || !order) return null;

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/70 backdrop-blur-xs overflow-y-auto print:p-0 print:bg-white print:static">
      <div className="relative w-full max-w-3xl bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden my-8 print:border-none print:shadow-none print:m-0">
        
        {/* Top Control Bar (Hidden on Print) */}
        <div className="bg-slate-900 text-white px-6 py-3.5 flex items-center justify-between print:hidden">
          <div className="flex items-center gap-2">
            <FileText className="w-4 h-4 text-amber-400" />
            <span className="text-xs font-bold font-['Prompt',sans-serif]">
              ใบเสร็จรับเงิน / ใบส่งสินค้า (Official Delivery Slip)
            </span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handlePrint}
              className="flex items-center gap-1.5 px-3.5 py-1.5 bg-red-600 hover:bg-red-700 text-white rounded-lg text-xs font-semibold shadow transition-colors"
            >
              <Printer className="w-3.5 h-3.5" />
              พิมพ์เอกสาร (Print / PDF)
            </button>
            <button
              onClick={onClose}
              className="w-8 h-8 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white flex items-center justify-center transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Printable Document Body */}
        <div className="p-8 sm:p-10 bg-white font-['Sarabun',sans-serif] text-slate-800 space-y-6">
          
          {/* Company Official Header */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between border-b-2 border-red-600 pb-6 gap-4">
            <div className="flex items-center gap-4">
              <Logo size="md" showText={false} />
              <div>
                <h1 className="text-xl font-extrabold text-slate-950 font-['Prompt',sans-serif]">
                  KAI NAM CHOK CO., LTD.
                </h1>
                <h2 className="text-base font-bold text-red-700 font-['Prompt',sans-serif]">
                  บริษัท ไก่นำโชค จำกัด
                </h2>
                <p className="text-xs text-slate-600 mt-1">
                  สำนักงานใหญ่ & ฟาร์มผลิต: 99/9 หมู่ 3 ต.หนองรี อ.เมือง จ.ชลบุรี 20000
                </p>
                <p className="text-xs text-slate-500">
                  โทร: 038-123-456, 089-999-8888 • อีเมล: arisadumri@gmail.com
                </p>
              </div>
            </div>

            <div className="text-right sm:self-center">
              <div className="inline-block px-3 py-1 bg-red-50 border border-red-200 text-red-800 font-bold text-sm rounded-lg font-['Prompt',sans-serif]">
                ใบเสร็จรับเงิน / ใบส่งสินค้า
              </div>
              <p className="text-xs font-mono font-bold text-slate-900 mt-2">
                เลขที่: {order.invoiceNumber}
              </p>
              <p className="text-xs text-slate-600">วันที่: {order.date}</p>
            </div>
          </div>

          {/* Customer & Invoice Meta */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 bg-slate-50 p-4 rounded-xl border border-slate-200 text-xs">
            <div>
              <span className="text-slate-500 font-semibold block mb-1">ข้อมูลลูกค้า / ผู้รับสินค้า:</span>
              <p className="font-bold text-slate-900 text-sm">{order.customerName}</p>
              <p className="text-slate-600 mt-0.5">{order.customerAddress || '-'}</p>
              <p className="text-slate-600 mt-0.5">โทรศัพท์: {order.customerPhone || '-'}</p>
            </div>

            <div className="sm:text-right">
              <span className="text-slate-500 font-semibold block mb-1">รายละเอียดการจัดส่งและการชำระ:</span>
              <p className="text-slate-800">
                วิธีการชำระเงิน: <strong className="text-slate-950 capitalize">{order.paymentMethod}</strong>
              </p>
              <p className="text-slate-800">
                สถานะการชำระ:{' '}
                <strong className={order.paymentStatus === 'paid' ? 'text-emerald-700' : 'text-amber-700'}>
                  {order.paymentStatus === 'paid' ? 'ชำระเงินเรียบร้อยแล้ว' : 'รอชำระ (เครดิตเทอม)'}
                </strong>
              </p>
              <p className="text-slate-600 mt-0.5">พนักงานขาย: {order.soldBy}</p>
            </div>
          </div>

          {/* Itemized Table */}
          <div className="border border-slate-200 rounded-xl overflow-hidden">
            <table className="w-full text-xs text-left">
              <thead className="bg-slate-100 text-slate-700 font-bold border-b border-slate-200">
                <tr>
                  <th className="py-2.5 px-3 text-center w-12">ลำดับ</th>
                  <th className="py-2.5 px-4">รายการสินค้า</th>
                  <th className="py-2.5 px-3 text-right">จำนวน</th>
                  <th className="py-2.5 px-3 text-right">หน่วย</th>
                  <th className="py-2.5 px-3 text-right">ราคาต่อหน่วย</th>
                  <th className="py-2.5 px-4 text-right">จำนวนเงิน (บาท)</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {order.items.map((item, idx) => (
                  <tr key={item.id}>
                    <td className="py-3 px-3 text-center text-slate-500">{idx + 1}</td>
                    <td className="py-3 px-4 font-semibold text-slate-900">{item.name}</td>
                    <td className="py-3 px-3 text-right font-bold text-slate-900">{item.quantity.toLocaleString()}</td>
                    <td className="py-3 px-3 text-right text-slate-600">{item.unit}</td>
                    <td className="py-3 px-3 text-right text-slate-700">฿{item.unitPrice.toLocaleString()}</td>
                    <td className="py-3 px-4 text-right font-bold text-slate-950">฿{item.totalPrice.toLocaleString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Totals & Signatures */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 pt-2">
            
            {/* Notes & Bank Details */}
            <div className="text-xs text-slate-600 space-y-2 bg-red-50/40 p-3.5 rounded-xl border border-red-100">
              <p className="font-bold text-red-900">หมายเหตุ / ข้อมูลการโอนเงิน:</p>
              <p>ธนาคารกสิกรไทย (KBANK) • เลขที่บัญชี: <strong>123-4-56789-0</strong></p>
              <p>ชื่อบัญชี: <strong>บริษัท ไก่นำโชค จำกัด (Kai Nam Chok Co., Ltd.)</strong></p>
              {order.notes && <p className="text-slate-500 italic">บันทึกช่วยจำ: {order.notes}</p>}
            </div>

            {/* Price Calculations */}
            <div className="space-y-2 text-xs text-slate-700">
              <div className="flex justify-between py-1 border-b border-slate-100">
                <span>ยอดรวมสินค้า (Subtotal):</span>
                <span className="font-semibold text-slate-900">฿{order.subtotal.toLocaleString()}</span>
              </div>
              {order.discount > 0 && (
                <div className="flex justify-between py-1 border-b border-slate-100 text-red-600">
                  <span>ส่วนลดพิเศษ:</span>
                  <span className="font-semibold">-฿{order.discount.toLocaleString()}</span>
                </div>
              )}
              <div className="flex justify-between py-2 border-t-2 border-slate-900 text-sm font-extrabold text-slate-950">
                <span>ยอดชำระสุทธิ (Grand Total):</span>
                <span className="text-base text-red-600">฿{order.grandTotal.toLocaleString()}</span>
              </div>
            </div>
          </div>

          {/* Signatures Field */}
          <div className="grid grid-cols-2 gap-8 pt-8 text-center text-xs text-slate-600">
            <div className="space-y-8">
              <div className="border-b border-slate-300 w-48 mx-auto"></div>
              <p>(........................................................)<br />ผู้รับสินค้า / ลูกค้า<br />วันที่ ......./......./.......</p>
            </div>

            <div className="space-y-8">
              <div className="border-b border-slate-300 w-48 mx-auto"></div>
              <p>( {order.soldBy} )<br />ผู้ส่งมอบสินค้า / บริษัท ไก่นำโชค จำกัด<br />วันที่ ......./......./.......</p>
            </div>
          </div>

        </div>

      </div>
    </div>
  );
};
