import React, { useMemo } from 'react';
import { User } from '../types';
import { Button } from './ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from './ui/dialog';
import { getTransactions } from '../lib/storage';
import { ArrowUpRight, ArrowDownLeft, Calendar } from 'lucide-react';

interface HistoryModalProps {
  user: User;
  onClose: () => void;
}

export default function HistoryModal({ user, onClose }: HistoryModalProps) {
  const transactions = useMemo(() => getTransactions(user.id), [user.id]);

  return (
    <Dialog open={true} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md max-h-[80vh] flex flex-col">
        <DialogHeader>
          <DialogTitle>Transaction History</DialogTitle>
          <DialogDescription>Your recent account activity.</DialogDescription>
        </DialogHeader>

        <div className="flex-1 overflow-y-auto pr-2 space-y-4 py-4">
          {transactions.length === 0 ? (
            <div className="text-center py-12 space-y-2">
              <div className="w-12 h-12 bg-slate-100 rounded-full flex items-center justify-center mx-auto text-slate-300">
                <Calendar className="w-6 h-6" />
              </div>
              <p className="text-slate-500 font-medium">No transactions yet</p>
              <p className="text-xs text-slate-400">Your history will appear here once you make a move.</p>
            </div>
          ) : (
            transactions.map((tx) => (
              <div key={tx.id} className="flex items-center justify-between p-3 rounded-xl border border-slate-100 bg-slate-50/50">
                <div className="flex items-center gap-3">
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                    tx.type === 'in' ? 'bg-green-100 text-green-600' : 'bg-red-100 text-red-600'
                  }`}>
                    {tx.type === 'in' ? <ArrowDownLeft className="w-5 h-5" /> : <ArrowUpRight className="w-5 h-5" />}
                  </div>
                  <div>
                    <p className="text-sm font-bold text-slate-800">{tx.description}</p>
                    <p className="text-[10px] text-slate-500">{new Date(tx.date).toLocaleString('es-MX')}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className={`font-bold ${tx.type === 'in' ? 'text-green-600' : 'text-slate-900'}`}>
                    {tx.type === 'in' ? '+' : '-'}${tx.amount.toFixed(2)}
                  </p>
                  <p className="text-[10px] text-slate-400 uppercase">MXN</p>
                </div>
              </div>
            ))
          )}
        </div>

        <div className="pt-4 border-t">
          <Button className="w-full" variant="outline" onClick={onClose}>Close</Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}