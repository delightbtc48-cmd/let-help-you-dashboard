import React, { useState } from 'react';
import { User, Transaction } from '../types';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from './ui/dialog';
import { toast } from 'sonner';
import { addTransaction } from '../lib/storage';
import { Landmark, CreditCard, Building2 } from 'lucide-react';

interface AddMoneyModalProps {
  user: User;
  onClose: () => void;
  onUpdate: (user: User) => void;
}

export default function AddMoneyModal({ user, onClose, onUpdate }: AddMoneyModalProps) {
  const [amount, setAmount] = useState('');
  const [method, setMethod] = useState<'card' | 'bank' | 'cash'>('card');

  const handleAdd = () => {
    const amt = parseFloat(amount);
    if (isNaN(amt) || amt <= 0) {
      toast.error('Please enter a valid amount');
      return;
    }

    const updatedUser = { ...user, balance: user.balance + amt };
    const tx: Transaction = {
      id: Math.random().toString(36).substr(2, 9),
      userId: user.id,
      type: 'in',
      amount: amt,
      description: `Added money via ${method}`,
      date: new Date().toISOString(),
    };

    addTransaction(tx);
    onUpdate(updatedUser);
    toast.success(`Successfully added $ ${amt.toFixed(2)} to your account`);
    onClose();
  };

  return (
    <Dialog open={true} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Add Money</DialogTitle>
          <DialogDescription>Top up your LinkPay balance instantly.</DialogDescription>
        </DialogHeader>

        <div className="space-y-6 py-4">
          <div className="space-y-2">
            <Label>Enter Amount (MXN $)</Label>
            <div className="relative">
              <span className="absolute left-3 top-2.5 text-slate-400 font-bold">$</span>
              <Input 
                placeholder="0.00" 
                type="number" 
                className="pl-7 text-xl font-bold h-12" 
                value={amount} 
                onChange={e => setAmount(e.target.value)} 
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label>Payment Method</Label>
            <div className="grid grid-cols-3 gap-3">
              <button 
                className={`p-3 rounded-xl border-2 flex flex-col items-center gap-2 transition-all ${method === 'card' ? 'border-blue-600 bg-blue-50 text-blue-600' : 'border-slate-100 hover:border-slate-200'}`}
                onClick={() => setMethod('card')}
              >
                <CreditCard className="w-6 h-6" />
                <span className="text-[10px] font-bold">Debit Card</span>
              </button>
              <button 
                className={`p-3 rounded-xl border-2 flex flex-col items-center gap-2 transition-all ${method === 'bank' ? 'border-blue-600 bg-blue-50 text-blue-600' : 'border-slate-100 hover:border-slate-200'}`}
                onClick={() => setMethod('bank')}
              >
                <Landmark className="w-6 h-6" />
                <span className="text-[10px] font-bold">Bank Transfer</span>
              </button>
              <button 
                className={`p-3 rounded-xl border-2 flex flex-col items-center gap-2 transition-all ${method === 'cash' ? 'border-blue-600 bg-blue-50 text-blue-600' : 'border-slate-100 hover:border-slate-200'}`}
                onClick={() => setMethod('cash')}
              >
                <Building2 className="w-6 h-6" />
                <span className="text-[10px] font-bold">Cash Point</span>
              </button>
            </div>
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={onClose}>Cancel</Button>
          <Button className="bg-blue-600" onClick={handleAdd}>Confirm Deposit</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}