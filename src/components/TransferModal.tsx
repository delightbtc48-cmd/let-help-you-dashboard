import React, { useState } from 'react';
import { User, Transaction } from '../types';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from './ui/dialog';
import { toast } from 'sonner';
import { addTransaction, getStoredUsers, saveUsers } from '../lib/storage';
import { ShieldCheck, User as UserIcon, CreditCard, Send, CheckCircle2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface TransferModalProps {
  user: User;
  onClose: () => void;
  onUpdate: (user: User) => void;
}

export default function TransferModal({ user, onClose, onUpdate }: TransferModalProps) {
  const [step, setStep] = useState(1);
  const [recipientName, setRecipientName] = useState('');
  const [recipientEmail, setRecipientEmail] = useState('');
  const [cardNumber, setCardNumber] = useState('');
  const [amount, setAmount] = useState('');
  const [pin, setPin] = useState('');

  const handleNext = () => {
    if (step === 1) {
      if (!recipientName || !recipientEmail) {
        toast.error('Please enter recipient details');
        return;
      }
      setStep(2);
    } else if (step === 2) {
      const amt = parseFloat(amount);
      if (!cardNumber || isNaN(amt) || amt <= 0) {
        toast.error('Please enter valid card number and amount');
        return;
      }
      if (amt > user.balance) {
        toast.error('Insufficient balance');
        return;
      }
      setStep(3);
    }
  };

  const handleConfirm = () => {
    if (pin !== '1245') {
      toast.error('Incorrect PIN. Please try again.');
      setPin('');
      return;
    }

    const amt = parseFloat(amount);
    
    // Process transfer
    const updatedUser = { ...user, balance: user.balance - amt };
    
    // Simulate finding the recipient
    const users = getStoredUsers();
    const recipient = users.find(u => u.email === recipientEmail);
    
    if (recipient) {
      recipient.balance += amt;
      saveUsers(users);
      
      // Record transaction for recipient
      const recTx: Transaction = {
        id: Math.random().toString(36).substr(2, 9),
        userId: recipient.id,
        type: 'in',
        amount: amt,
        description: `Received from ${user.name}`,
        date: new Date().toISOString(),
      };
      addTransaction(recTx);
    }

    // Record transaction for sender
    const tx: Transaction = {
      id: Math.random().toString(36).substr(2, 9),
      userId: user.id,
      type: 'out',
      amount: amt,
      description: `Transfer to ${recipientName}`,
      date: new Date().toISOString(),
      recipientEmail
    };
    addTransaction(tx);

    onUpdate(updatedUser);
    setStep(4);
    toast.success('Transfer successful!');
  };

  return (
    <Dialog open={true} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Transfer Money</DialogTitle>
          <DialogDescription>Send funds to another registered Link user.</DialogDescription>
        </DialogHeader>

        <div className="py-4">
          <AnimatePresence mode="wait">
            {step === 1 && (
              <motion.div 
                key="step1"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="space-y-4"
              >
                <div className="space-y-2">
                  <Label>Recipient Name</Label>
                  <div className="relative">
                    <UserIcon className="absolute left-3 top-3 w-4 h-4 text-slate-400" />
                    <Input 
                      placeholder="John Doe" 
                      className="pl-10" 
                      value={recipientName} 
                      onChange={e => setRecipientName(e.target.value)} 
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label>Recipient Email</Label>
                  <Input 
                    placeholder="john@example.com" 
                    type="email" 
                    value={recipientEmail} 
                    onChange={e => setRecipientEmail(e.target.value)} 
                  />
                </div>
                <Button className="w-full bg-blue-600" onClick={handleNext}>Continue</Button>
              </motion.div>
            )}

            {step === 2 && (
              <motion.div 
                key="step2"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="space-y-4"
              >
                <div className="space-y-2">
                  <Label>Recipient Card Number</Label>
                  <div className="relative">
                    <CreditCard className="absolute left-3 top-3 w-4 h-4 text-slate-400" />
                    <Input 
                      placeholder="XXXX XXXX XXXX XXXX" 
                      className="pl-10" 
                      value={cardNumber} 
                      onChange={e => setCardNumber(e.target.value)} 
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label>Amount (MXN $)</Label>
                  <div className="relative">
                    <span className="absolute left-3 top-2.5 text-slate-400 font-bold">$</span>
                    <Input 
                      placeholder="0.00" 
                      type="number" 
                      className="pl-7 text-lg font-bold" 
                      value={amount} 
                      onChange={e => setAmount(e.target.value)} 
                    />
                  </div>
                  <p className="text-xs text-slate-500">Available: $ {user.balance.toFixed(2)}</p>
                </div>
                <div className="flex gap-2">
                   <Button variant="outline" className="flex-1" onClick={() => setStep(1)}>Back</Button>
                   <Button className="flex-[2] bg-blue-600" onClick={handleNext}>Next</Button>
                </div>
              </motion.div>
            )}

            {step === 3 && (
              <motion.div 
                key="step3"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                className="space-y-6 py-4 text-center"
              >
                <div className="w-16 h-16 bg-blue-50 text-blue-600 rounded-full flex items-center justify-center mx-auto mb-2">
                  <ShieldCheck className="w-8 h-8" />
                </div>
                <div className="space-y-2">
                  <h3 className="font-bold text-lg">Enter Transaction PIN</h3>
                  <p className="text-sm text-slate-500">Confirm your transfer of ${amount} to {recipientName}</p>
                </div>
                <Input 
                  type="password" 
                  placeholder="PIN" 
                  className="text-center text-2xl tracking-[1em] h-14" 
                  maxLength={4}
                  value={pin}
                  onChange={e => setPin(e.target.value)}
                  autoFocus
                />
                <Button className="w-full h-12 bg-blue-600 text-lg" onClick={handleConfirm}>Authorize Transfer</Button>
              </motion.div>
            )}

            {step === 4 && (
              <motion.div 
                key="step4"
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                className="py-8 text-center space-y-4"
              >
                <div className="w-20 h-20 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto">
                  <CheckCircle2 className="w-10 h-10" />
                </div>
                <div className="space-y-1">
                  <h2 className="text-2xl font-bold">Success!</h2>
                  <p className="text-slate-500">Your transfer was processed successfully.</p>
                </div>
                <div className="p-4 bg-slate-50 rounded-xl space-y-2 text-left">
                  <div className="flex justify-between text-sm">
                    <span className="text-slate-500">Recipient</span>
                    <span className="font-medium">{recipientName}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-slate-500">Amount</span>
                    <span className="font-bold text-blue-600">$ {parseFloat(amount).toFixed(2)} MXN</span>
                  </div>
                </div>
                <Button className="w-full mt-4" variant="outline" onClick={onClose}>Close</Button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </DialogContent>
    </Dialog>
  );
}