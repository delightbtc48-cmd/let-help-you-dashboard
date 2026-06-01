import React, { useState } from 'react';
import { User } from '../types';
import { 
  PlusCircle, 
  Send, 
  History, 
  User as UserIcon, 
  LogOut, 
  CreditCard, 
  Smartphone, 
  Zap, 
  Globe, 
  ShieldCheck, 
  Bell, 
  Search,
  Wallet
} from 'lucide-react';
import { Button } from './ui/button';
import { Card, CardContent } from './ui/card';
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';
import TransferModal from './TransferModal';
import AddMoneyModal from './AddMoneyModal';
import ProfileModal from './ProfileModal';
import HistoryModal from './HistoryModal';

interface DashboardProps {
  user: User;
  onLogout: () => void;
  onUpdateUser: (user: User) => void;
}

export default function Dashboard({ user, onLogout, onUpdateUser }: DashboardProps) {
  const [activeModal, setActiveModal] = useState<'transfer' | 'add' | 'profile' | 'history' | null>(null);

  const services = [
    { icon: <Send className="w-6 h-6" />, label: 'Transfer', color: 'bg-blue-100 text-blue-600', action: () => setActiveModal('transfer') },
    { icon: <PlusCircle className="w-6 h-6" />, label: 'Add Money', color: 'bg-green-100 text-green-600', action: () => setActiveModal('add') },
    { icon: <Smartphone className="w-6 h-6" />, label: 'Airtime', color: 'bg-purple-100 text-purple-600' },
    { icon: <Zap className="w-6 h-6" />, label: 'Bills', color: 'bg-yellow-100 text-yellow-600' },
    { icon: <Globe className="w-6 h-6" />, label: 'Global', color: 'bg-indigo-100 text-indigo-600' },
    { icon: <CreditCard className="w-6 h-6" />, label: 'Cards', color: 'bg-pink-100 text-pink-600' },
    { icon: <ShieldCheck className="w-6 h-6" />, label: 'Security', color: 'bg-teal-100 text-teal-600' },
    { icon: <Bell className="w-6 h-6" />, label: 'Alerts', color: 'bg-orange-100 text-orange-600' },
  ];

  return (
    <div className="max-w-md mx-auto min-h-screen bg-white shadow-xl flex flex-col relative overflow-hidden">
      {/* Background Decor */}
      <div className="absolute top-0 left-0 w-full h-64 bg-blue-600 rounded-b-[3rem] -z-10" />
      
      {/* Header */}
      <header className="p-6 flex items-center justify-between text-white">
        <div className="flex items-center gap-3 cursor-pointer" onClick={() => setActiveModal('profile')}>
          <Avatar className="h-12 w-12 border-2 border-white/50">
            <AvatarImage src={user.photo} alt={user.name} />
            <AvatarFallback>{user.name.charAt(0)}</AvatarFallback>
          </Avatar>
          <div>
            <p className="text-xs opacity-80">Hello,</p>
            <h2 className="font-bold text-lg">{user.name}</h2>
          </div>
        </div>
        <div className="flex gap-2">
          <Button variant="ghost" size="icon" className="text-white hover:bg-white/10" onClick={() => setActiveModal('history')}>
            <History className="h-6 w-6" />
          </Button>
          <Button variant="ghost" size="icon" className="text-white hover:bg-white/10" onClick={onLogout}>
            <LogOut className="h-6 w-6" />
          </Button>
        </div>
      </header>

      {/* Balance Card */}
      <main className="flex-1 px-6 pb-20">
        <Card className="mt-2 bg-white shadow-lg border-none overflow-hidden rounded-2xl">
          <CardContent className="p-8 text-center space-y-2">
            <p className="text-slate-500 text-sm font-medium uppercase tracking-wider">Available Balance</p>
            <h1 className="text-4xl font-black text-slate-900">
              <span className="text-blue-600">$</span> {user.balance.toLocaleString('es-MX', { minimumFractionDigits: 2 })}
              <span className="text-lg font-medium text-slate-400 ml-1">MXN</span>
            </h1>
            <div className="pt-6 flex gap-3">
              <Button 
                className="flex-1 bg-blue-600 hover:bg-blue-700 h-12 rounded-xl text-white font-bold gap-2"
                onClick={() => setActiveModal('transfer')}
              >
                <Send className="w-4 h-4" /> Transfer
              </Button>
              <Button 
                variant="outline"
                className="flex-1 border-blue-200 text-blue-600 h-12 rounded-xl font-bold gap-2"
                onClick={() => setActiveModal('add')}
              >
                <PlusCircle className="w-4 h-4" /> Add Money
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Services Grid */}
        <div className="mt-8">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-bold text-slate-800">All Services</h3>
            <Button variant="link" className="text-blue-600 p-0 h-auto">View All</Button>
          </div>
          <div className="grid grid-cols-4 gap-4">
            {services.map((service, i) => (
              <button 
                key={i} 
                className="flex flex-col items-center gap-2 group"
                onClick={service.action}
              >
                <div className={`w-14 h-14 rounded-2xl flex items-center justify-center shadow-sm group-active:scale-95 transition-transform ${service.color}`}>
                  {service.icon}
                </div>
                <span className="text-xs font-medium text-slate-600">{service.label}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Search / Placeholder */}
        <div className="mt-10 bg-slate-100 rounded-2xl p-4 flex items-center gap-3 text-slate-400">
          <Search className="w-5 h-5" />
          <span className="text-sm">Search transactions or people...</span>
        </div>

        {/* Recent Transactions Teaser */}
        <div className="mt-8">
           <div className="flex items-center justify-between mb-4">
            <h3 className="font-bold text-slate-800">Recent Transactions</h3>
            <Button variant="link" className="text-blue-600 p-0 h-auto" onClick={() => setActiveModal('history')}>History</Button>
          </div>
          <div className="space-y-4">
            <div className="flex items-center justify-center p-8 bg-slate-50 border-2 border-dashed border-slate-200 rounded-2xl">
              <p className="text-slate-400 text-sm">No recent activity</p>
            </div>
          </div>
        </div>
      </main>

      {/* Bottom Nav */}
      <nav className="fixed bottom-0 left-1/2 -translate-x-1/2 w-full max-w-md bg-white border-t border-slate-100 h-16 flex items-center justify-around px-6 z-40">
        <Button variant="ghost" className="flex flex-col items-center gap-1 text-blue-600 h-auto p-2">
          <Wallet className="w-6 h-6" />
          <span className="text-[10px]">Home</span>
        </Button>
        <Button variant="ghost" className="flex flex-col items-center gap-1 text-slate-400 h-auto p-2" onClick={() => setActiveModal('history')}>
          <History className="w-6 h-6" />
          <span className="text-[10px]">History</span>
        </Button>
        <div className="relative -top-8">
          <button 
            className="w-14 h-14 bg-blue-600 rounded-full shadow-lg shadow-blue-200 flex items-center justify-center text-white active:scale-90 transition-transform"
            onClick={() => setActiveModal('transfer')}
          >
            <Send className="w-6 h-6" />
          </button>
        </div>
        <Button variant="ghost" className="flex flex-col items-center gap-1 text-slate-400 h-auto p-2">
          <CreditCard className="w-6 h-6" />
          <span className="text-[10px]">Cards</span>
        </Button>
        <Button variant="ghost" className="flex flex-col items-center gap-1 text-slate-400 h-auto p-2" onClick={() => setActiveModal('profile')}>
          <UserIcon className="w-6 h-6" />
          <span className="text-[10px]">Profile</span>
        </Button>
      </nav>

      {/* Modals */}
      {activeModal === 'transfer' && (
        <TransferModal user={user} onClose={() => setActiveModal(null)} onUpdate={onUpdateUser} />
      )}
      {activeModal === 'add' && (
        <AddMoneyModal user={user} onClose={() => setActiveModal(null)} onUpdate={onUpdateUser} />
      )}
      {activeModal === 'profile' && (
        <ProfileModal user={user} onClose={() => setActiveModal(null)} onUpdate={onUpdateUser} />
      )}
      {activeModal === 'history' && (
        <HistoryModal user={user} onClose={() => setActiveModal(null)} />
      )}
    </div>
  );
}