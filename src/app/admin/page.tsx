'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Calendar, Clock, Phone, Mail, User, Check, RefreshCw, Trash2, ShieldAlert, LogOut } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface Booking {
  id: string;
  name: string;
  phone: string;
  email: string;
  reason: string;
  date: string;
  time: string;
  notes: string;
  status: 'pending' | 'confirmed' | 'proposed';
}

const defaultSlots = [
  "9:00 AM", "10:00 AM", "11:00 AM", "12:00 PM",
  "2:00 PM", "3:00 PM", "4:00 PM", "5:00 PM", "6:00 PM"
];

export default function AdminDashboard() {
  const router = useRouter();
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [activeTab, setActiveTab] = useState<'pending' | 'confirmed' | 'proposed'>('pending');
  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState('');
  
  // Reschedule Form States
  const [rescheduleId, setRescheduleId] = useState<string | null>(null);
  const [rescheduleDate, setRescheduleDate] = useState('');
  const [rescheduleTime, setRescheduleTime] = useState('');
  const [updatingId, setUpdatingId] = useState<string | null>(null);

  // Load Bookings
  const fetchBookings = async () => {
    setLoading(true);
    setErrorMsg('');
    try {
      const res = await fetch('/api/bookings');
      
      // Auth Guard Redirect
      if (res.status === 401) {
        router.push('/admin/login');
        return;
      }

      const data = await res.json();
      if (res.ok && data.success) {
        setBookings(data.bookings || []);
      } else {
        setErrorMsg(data.error || 'Failed to load bookings.');
      }
    } catch (err) {
      console.error(err);
      setErrorMsg('Network error loading database bookings.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBookings();
  }, []);

  const handleConfirm = async (id: string) => {
    setUpdatingId(id);
    setErrorMsg('');
    try {
      const res = await fetch('/api/bookings', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, status: 'confirmed' }),
      });

      if (res.status === 401) {
        router.push('/admin/login');
        return;
      }

      const data = await res.json();
      if (res.ok && data.success) {
        // Update local state
        setBookings(prev => prev.map(b => b.id === id ? { ...b, status: 'confirmed' } : b));
      } else {
        setErrorMsg(data.error || 'Failed to confirm booking.');
      }
    } catch (err) {
      console.error(err);
      setErrorMsg('Network error confirming appointment.');
    } finally {
      setUpdatingId(null);
    }
  };

  const handleRescheduleSubmit = async (e: React.FormEvent, id: string) => {
    e.preventDefault();
    if (!rescheduleDate || !rescheduleTime) {
      alert('Please select both date and time.');
      return;
    }

    setUpdatingId(id);
    setErrorMsg('');
    try {
      const res = await fetch('/api/bookings', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, status: 'proposed', date: rescheduleDate, time: rescheduleTime }),
      });

      if (res.status === 401) {
        router.push('/admin/login');
        return;
      }

      const data = await res.json();
      if (res.ok && data.success) {
        // Update local state
        setBookings(prev => prev.map(b => b.id === id ? { ...b, status: 'proposed', date: rescheduleDate, time: rescheduleTime } : b));
        setRescheduleId(null);
        setRescheduleDate('');
        setRescheduleTime('');
      } else {
        setErrorMsg(data.error || 'Failed to reschedule booking.');
      }
    } catch (err) {
      console.error(err);
      setErrorMsg('Network error suggesting reschedule.');
    } finally {
      setUpdatingId(null);
    }
  };

  const handleCancel = async (id: string) => {
    if (!confirm('Are you sure you want to cancel and delete this appointment?')) return;
    setUpdatingId(id);
    setErrorMsg('');
    try {
      const res = await fetch(`/api/bookings/${id}`, {
        method: 'DELETE',
      });
      const data = await res.json();
      if (res.ok && data.success) {
        setBookings(prev => prev.filter(b => b.id !== id));
      } else {
        setErrorMsg(data.error || 'Failed to delete booking.');
      }
    } catch (err) {
      console.error(err);
      setErrorMsg('Network error deleting appointment.');
    } finally {
      setUpdatingId(null);
    }
  };

  const handleLogout = async () => {
    try {
      const res = await fetch('/api/admin/logout', { method: 'POST' });
      if (res.ok) {
        router.push('/admin/login');
        router.refresh();
      }
    } catch (err) {
      console.error('Logout error:', err);
    }
  };

  // Filter Bookings by Tab
  const filteredBookings = bookings.filter(b => b.status === activeTab);

  return (
    <div className="w-full min-h-screen bg-sand-light/50 pb-20">
      {/* Admin Header */}
      <section className="bg-teal-deep text-sand-light py-12 relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-6 md:px-12 relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2">
            <h1 className="text-3xl md:text-4xl font-serif font-bold text-white leading-tight">
              Ankita Gastro Care
            </h1>
            <p className="text-xs md:text-sm font-semibold tracking-wider text-copper-soft uppercase">
              Clinic Reception Scheduling panel
            </p>
          </div>
          <div className="flex items-center gap-3">
            <button 
              onClick={fetchBookings}
              className="px-5 py-2.5 bg-copper-deep text-sand-light text-xs font-bold uppercase tracking-wider hover:bg-white hover:text-teal-deep transition-all duration-300 flex items-center gap-2 cursor-pointer"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              <span>Refresh List</span>
            </button>
            <button 
              onClick={handleLogout}
              className="px-5 py-2.5 bg-full/10 border border-full/25 text-full text-xs font-bold uppercase tracking-wider hover:bg-full hover:text-white transition-all duration-300 flex items-center gap-2 cursor-pointer"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span>Log Out</span>
            </button>
          </div>
        </div>
      </section>

      {/* Main dashboard content */}
      <main className="max-w-7xl mx-auto px-6 md:px-12 mt-10">
        {errorMsg && (
          <div className="bg-full/5 border border-full/20 text-full text-sm font-semibold p-4 mb-6 flex items-center gap-3">
            <ShieldAlert className="w-5 h-5 flex-shrink-0" />
            <span>{errorMsg}</span>
          </div>
        )}

        {/* Tab Header bar */}
        <div className="flex border-b border-ink/10 mb-8 bg-white p-1 rounded shadow-sm">
          {(['pending', 'confirmed', 'proposed'] as const).map(tab => {
            const count = bookings.filter(b => b.status === tab).length;
            return (
              <button
                key={tab}
                onClick={() => { setActiveTab(tab); setRescheduleId(null); }}
                className={`flex-1 py-3 text-xs md:text-sm font-bold uppercase tracking-wider transition-all duration-300 border-b-2 cursor-pointer text-center ${
                  activeTab === tab
                    ? 'border-teal-deep text-teal-deep'
                    : 'border-transparent text-ink/50 hover:text-teal-light'
                }`}
              >
                {tab} ({count})
              </button>
            );
          })}
        </div>

        {/* Bookings Display */}
        {loading ? (
          <p className="text-center py-20 text-ink/50 italic animate-pulse">
            Loading clinic records...
          </p>
        ) : filteredBookings.length === 0 ? (
          <div className="text-center py-20 bg-white border border-ink/10 rounded-sm">
            <p className="text-sm text-ink/50 italic">No {activeTab} bookings found.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <AnimatePresence>
              {filteredBookings.map(booking => {
                const isVeteran = booking.notes.toLowerCase().includes('vet') || 
                                  booking.notes.toLowerCase().includes('soldier') || 
                                  booking.notes.toLowerCase().includes('army');

                return (
                  <motion.div
                    key={booking.id}
                    layout
                    initial={{ opacity: 0, scale: 0.98 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    className="bg-white border border-ink/10 p-6 rounded-sm shadow-sm hover:border-teal-deep/30 transition-all duration-300 flex flex-col justify-between"
                  >
                    <div className="space-y-4">
                      {/* Veteran Banner */}
                      {isVeteran && (
                        <div className="bg-full/10 border border-full/20 text-full text-[10px] font-bold px-2.5 py-1 uppercase tracking-wider flex items-center gap-1.5 rounded-sm">
                          <span>🎖️ Veteran Concession Discount</span>
                        </div>
                      )}

                      {/* Header details */}
                      <div className="flex items-start justify-between">
                        <div>
                          <h4 className="font-serif text-lg font-bold text-teal-deep">
                            {booking.name}
                          </h4>
                          <span className="text-[10px] text-ink/50 uppercase tracking-widest font-mono">
                            ID: {booking.id}
                          </span>
                        </div>
                      </div>

                      {/* Info grid */}
                      <div className="space-y-2 text-xs text-ink/75 font-medium border-t border-ink/5 pt-3">
                        <div className="flex items-center gap-2">
                          <Calendar className="w-4 h-4 text-copper-deep" />
                          <span>{booking.date}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Clock className="w-4 h-4 text-copper-deep" />
                          <span>{booking.time}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Phone className="w-4 h-4 text-copper-deep" />
                          <a href={`tel:${booking.phone}`} className="hover:underline">{booking.phone}</a>
                        </div>
                        {booking.email && (
                          <div className="flex items-center gap-2">
                            <Mail className="w-4 h-4 text-copper-deep" />
                            <a href={`mailto:${booking.email}`} className="hover:underline truncate max-w-[200px]">{booking.email}</a>
                          </div>
                        )}
                        <div className="border-t border-ink/5 pt-2 mt-2">
                          <span className="text-[10px] text-ink/40 uppercase block">Reason</span>
                          <span className="font-semibold text-teal-deep">{booking.reason}</span>
                        </div>
                        {booking.notes && (
                          <div className="bg-bg-deep/30 p-2.5 rounded-sm border border-ink/5 mt-2">
                            <span className="text-[9px] text-ink/40 uppercase block">Notes</span>
                            <p className="text-[11px] italic text-ink/70">"{booking.notes}"</p>
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Actions Panel */}
                    <div className="border-t border-ink/5 pt-4 mt-6 space-y-3">
                      {rescheduleId === booking.id ? (
                        /* Reschedule Suggestion Form inline */
                        <form onSubmit={(e) => handleRescheduleSubmit(e, booking.id)} className="space-y-3 p-3 bg-bg-deep/40 border border-ink/10 rounded-sm">
                          <h5 className="text-[10px] font-bold uppercase tracking-wider text-teal-deep">Propose New Slot</h5>
                          
                          <div className="flex flex-col gap-1">
                            <label className="text-[8px] font-bold uppercase text-ink/50">Date</label>
                            <input 
                              type="date" 
                              required 
                              min={new Date().toISOString().split('T')[0]}
                              value={rescheduleDate} 
                              onChange={(e) => setRescheduleDate(e.target.value)}
                              className="text-xs bg-white border border-ink/15 rounded p-1.5 w-full focus:outline-none"
                            />
                          </div>

                          <div className="flex flex-col gap-1">
                            <label className="text-[8px] font-bold uppercase text-ink/50">Time Slot</label>
                            <select 
                              required
                              value={rescheduleTime} 
                              onChange={(e) => setRescheduleTime(e.target.value)}
                              className="text-xs bg-white border border-ink/15 rounded p-1.5 w-full focus:outline-none"
                            >
                              <option value="">Select Time</option>
                              {defaultSlots.map(slot => (
                                <option key={slot} value={slot}>{slot}</option>
                              ))}
                            </select>
                          </div>

                          <div className="flex gap-2 pt-1">
                            <button 
                              type="submit"
                              disabled={updatingId === booking.id}
                              className="flex-1 py-1.5 bg-teal-deep text-sand-light text-[10px] font-bold uppercase tracking-wider rounded hover:bg-copper-deep transition-all"
                            >
                              Send
                            </button>
                            <button 
                              type="button" 
                              onClick={() => setRescheduleId(null)}
                              className="px-2.5 py-1.5 border border-ink/20 text-ink/60 text-[10px] font-bold uppercase tracking-wider rounded hover:bg-ink/5"
                            >
                              Cancel
                            </button>
                          </div>
                        </form>
                      ) : (
                        /* Standard action buttons */
                        <div className="flex gap-2">
                          {booking.status === 'pending' && (
                            <button
                              onClick={() => handleConfirm(booking.id)}
                              disabled={updatingId !== null}
                              className="flex-1 py-2 bg-ok/10 hover:bg-ok/20 border border-ok/25 text-ok text-[10px] font-bold uppercase tracking-wider transition-all duration-300 rounded flex items-center justify-center gap-1 cursor-pointer disabled:opacity-50"
                            >
                              <Check className="w-3.5 h-3.5" />
                              <span>Confirm</span>
                            </button>
                          )}
                          
                          {booking.status === 'pending' && (
                            <button
                              onClick={() => { setRescheduleId(booking.id); setRescheduleDate(booking.date); setRescheduleTime(''); }}
                              disabled={updatingId !== null}
                              className="flex-1 py-2 bg-copper-deep/10 hover:bg-copper-deep/20 border border-copper-soft text-copper-deep text-[10px] font-bold uppercase tracking-wider transition-all duration-300 rounded flex items-center justify-center gap-1 cursor-pointer disabled:opacity-50"
                            >
                              <RefreshCw className="w-3.5 h-3.5 animate-spin-slow" />
                              <span>Reschedule</span>
                            </button>
                          )}

                          <button
                            onClick={() => handleCancel(booking.id)}
                            disabled={updatingId !== null}
                            className="flex-1 py-2 border border-full/20 bg-full/5 hover:bg-full/10 text-full text-[10px] font-bold uppercase tracking-wider transition-all duration-300 rounded flex items-center justify-center gap-1 cursor-pointer disabled:opacity-50"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                            <span>Delete</span>
                          </button>
                        </div>
                      )}
                    </div>
                  </motion.div>
                );
              })}
            </AnimatePresence>
          </div>
        )}
      </main>
    </div>
  );
}
