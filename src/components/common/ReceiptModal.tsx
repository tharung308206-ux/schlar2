import React from 'react';
import { useApp } from '../../context/AppContext';
import { Check, Download, Printer, X, ShieldCheck } from 'lucide-react';

export const ReceiptModal: React.FC = () => {
  const { activeReceipt, setActiveReceipt, addToast } = useApp();

  if (!activeReceipt) return null;

  const handlePrint = () => {
    window.print();
  };

  const handleDownload = () => {
    addToast({
      type: 'success',
      title: 'Receipt Downloaded',
      message: `Receipt ${activeReceipt.receiptNumber} saved as PDF format.`
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-sm animate-in fade-in">
      <div className="relative w-full max-w-lg bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden text-slate-800">
        {/* Header bar */}
        <div className="bg-theme-primary text-white p-5 sm:p-6 relative">
          <button
            onClick={() => setActiveReceipt(null)}
            className="absolute top-4 right-4 text-white/80 hover:text-white p-1 rounded-lg transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
          
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl bg-white/10 border border-white/20 flex items-center justify-center text-white font-black text-xl shadow-inner">
              GIS
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base sm:text-lg font-bold tracking-tight">Greenfield International School</h3>
                <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-white/90 bg-white/20 px-2 py-0.5 rounded">
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-300" />
                  Verified
                </span>
              </div>
              <p className="text-xs text-white/80 mt-0.5">
                Official Tuition & Academic Services Receipt
              </p>
            </div>
          </div>
        </div>

        {/* Receipt Content */}
        <div className="p-6 space-y-5">
          {/* Top metadata */}
          <div className="flex justify-between items-start border-b border-slate-100 pb-4">
            <div>
              <span className="text-xs text-slate-400 block font-medium">RECEIPT NUMBER</span>
              <span className="text-sm font-mono font-bold text-slate-900">{activeReceipt.receiptNumber}</span>
            </div>
            <div className="text-right">
              <span className="text-xs text-slate-400 block font-medium">DATE ISSUED</span>
              <span className="text-sm font-semibold text-slate-800">{activeReceipt.date}</span>
            </div>
          </div>

          {/* Student Info */}
          <div className="grid grid-cols-2 gap-4 bg-slate-50 p-4 rounded-xl border border-slate-100">
            <div>
              <span className="text-xs text-slate-400 block">Student Name</span>
              <span className="text-sm font-semibold text-slate-900">{activeReceipt.studentName}</span>
            </div>
            <div>
              <span className="text-xs text-slate-400 block">Class / Division</span>
              <span className="text-sm font-semibold text-slate-900">{activeReceipt.className}</span>
            </div>
            <div>
              <span className="text-xs text-slate-400 block">Payment Mode</span>
              <span className="text-sm font-semibold text-emerald-700">{activeReceipt.paymentMethod}</span>
            </div>
            <div>
              <span className="text-xs text-slate-400 block">Transaction Reference</span>
              <span className="text-xs font-mono font-medium text-slate-600">{activeReceipt.referenceNumber}</span>
            </div>
          </div>

          {/* Amount Paid Callout */}
          <div className="flex items-center justify-between p-4 bg-emerald-50 rounded-xl border border-emerald-100">
            <div>
              <span className="text-xs font-semibold text-emerald-800 uppercase tracking-wider block">Total Amount Paid</span>
              <span className="text-xs text-emerald-600">{activeReceipt.notes || 'School fee settlement'}</span>
            </div>
            <div className="text-right">
              <span className="text-3xl font-extrabold text-emerald-900 font-mono tracking-tight">
                ${activeReceipt.amount.toLocaleString()}
              </span>
            </div>
          </div>

          {/* Footer Auth */}
          <div className="flex items-center justify-between text-xs text-slate-400 pt-2 border-t border-slate-100">
            <div>
              <span>Processed by: </span>
              <span className="text-slate-700 font-medium">{activeReceipt.receivedBy}</span>
            </div>
            <div className="flex items-center gap-1.5 text-emerald-700 font-medium">
              <Check className="w-4 h-4 text-emerald-600" />
              <span>Payment Cleared</span>
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="flex items-center justify-end gap-3 p-4 bg-slate-50 border-t border-slate-100">
          <button
            onClick={handlePrint}
            className="flex items-center gap-2 px-4 py-2 text-xs font-medium text-slate-700 bg-white border border-slate-200 rounded-lg hover:bg-slate-100 transition-colors shadow-sm"
          >
            <Printer className="w-3.5 h-3.5" />
            Print Receipt
          </button>
          <button
            onClick={handleDownload}
            className="flex items-center gap-2 px-4 py-2 text-xs font-medium text-slate-700 bg-white border border-slate-200 rounded-lg hover:bg-slate-100 transition-colors shadow-sm"
          >
            <Download className="w-3.5 h-3.5" />
            Download PDF
          </button>
          <button
            onClick={() => setActiveReceipt(null)}
            className="px-5 py-2 text-xs font-semibold text-white bg-theme-primary hover:opacity-90 rounded-lg transition-all shadow-sm"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
};
