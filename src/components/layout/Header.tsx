'use client';

import { useState } from 'react';

interface HeaderProps {
  onMenuClick: () => void;
}

export default function Header({ onMenuClick }: HeaderProps) {
  const [showNotifications, setShowNotifications] = useState(false);

  return (
    <header className="h-20 glass border-b border-purple-100 flex items-center justify-between px-4 lg:px-6">
      <div className="flex items-center gap-4">
        <button
          onClick={onMenuClick}
          className="lg:hidden p-2 text-gray-600 hover:bg-purple-50 rounded-xl transition-colors"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        </button>

        <div className="hidden md:block">
          <h1 className="text-xl font-bold text-gray-900">Welcome back!</h1>
          <p className="text-sm text-gray-500">Here&apos;s what&apos;s happening with your platform today.</p>
        </div>
      </div>

      <div className="flex items-center gap-3">
        {/* Search */}
        <div className="hidden lg:flex items-center gap-2 px-4 py-2 bg-white border border-gray-200 rounded-xl w-64">
          <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
          <input type="text" placeholder="Search..." className="flex-1 text-sm outline-none bg-transparent" />
          <kbd className="px-2 py-0.5 text-xs bg-gray-100 rounded text-gray-500">⌘K</kbd>
        </div>

        {/* Notifications */}
        <div className="relative">
          <button 
            onClick={() => setShowNotifications(!showNotifications)}
            className="relative p-2.5 text-gray-600 hover:bg-purple-50 rounded-xl transition-colors"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
            </svg>
            <span className="absolute top-1 right-1 w-4 h-4 bg-gradient-to-r from-red-500 to-pink-500 rounded-full text-[10px] text-white flex items-center justify-center font-bold">3</span>
          </button>

          {showNotifications && (
            <div className="absolute right-0 top-full mt-2 w-80 bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden z-50">
              <div className="p-4 border-b border-gray-100 bg-gradient-to-r from-purple-50 to-white">
                <h3 className="font-semibold text-gray-900">Notifications</h3>
                <p className="text-xs text-gray-500">You have 3 unread messages</p>
              </div>
              <div className="max-h-64 overflow-y-auto">
                {[
                  { title: 'New user registered', desc: 'John Doe just signed up', time: '2m ago', iconType: 'user' },
                  { title: 'API limit reached', desc: 'User exceeded rate limit', time: '1h ago', iconType: 'warning' },
                  { title: 'Payment received', desc: '$299 from Enterprise plan', time: '3h ago', iconType: 'payment' },
                ].map((n, i) => (
                  <div key={i} className="p-4 hover:bg-purple-50 cursor-pointer transition-colors border-b border-gray-50">
                    <div className="flex gap-3">
                      <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                        n.iconType === 'user' ? 'bg-blue-100 text-blue-600' :
                        n.iconType === 'warning' ? 'bg-yellow-100 text-yellow-600' :
                        'bg-green-100 text-green-600'
                      }`}>
                        {n.iconType === 'user' && <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" /></svg>}
                        {n.iconType === 'warning' && <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" /></svg>}
                        {n.iconType === 'payment' && <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>}
                      </div>
                      <div className="flex-1">
                        <p className="text-sm font-medium text-gray-900">{n.title}</p>
                        <p className="text-xs text-gray-500">{n.desc}</p>
                        <p className="text-xs text-purple-600 mt-1">{n.time}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              <div className="p-3 bg-gray-50">
                <button className="w-full text-sm text-purple-600 font-medium hover:text-purple-700">View all notifications</button>
              </div>
            </div>
          )}
        </div>

        {/* Profile */}
        <div className="flex items-center gap-3 pl-3 border-l border-gray-200">
          <div className="text-right hidden sm:block">
            <p className="text-sm font-semibold text-gray-900">Admin User</p>
            <p className="text-xs text-gray-500">Super Admin</p>
          </div>
          <div className="relative">
            <div className="w-10 h-10 bg-gradient-to-br from-[#6D28D9] to-[#8B5CF6] rounded-xl flex items-center justify-center text-white font-bold shadow-lg">
              A
            </div>
            <div className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-green-400 rounded-full border-2 border-white"></div>
          </div>
        </div>
      </div>
    </header>
  );
}
