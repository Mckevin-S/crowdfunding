import React, { useState, useEffect, useRef } from 'react';
import { Bell, BellRing, Check, Clock, ExternalLink, X } from 'lucide-react';
import { useSelector } from 'react-redux';
import { notificationService } from '../../services/notificationService';
import clsx from 'clsx';
import { Link } from 'react-router-dom';

const timeAgo = (date) => {
  if (!date) return "";
  const now = new Date();
  const diffInSeconds = Math.floor((now - new Date(date)) / 1000);
  
  if (diffInSeconds < 60) return "À l'instant";
  const diffInMinutes = Math.floor(diffInSeconds / 60);
  if (diffInMinutes < 60) return `Il y a ${diffInMinutes} min`;
  const diffInHours = Math.floor(diffInMinutes / 60);
  if (diffInHours < 24) return `Il y a ${diffInHours} h`;
  const diffInDays = Math.floor(diffInHours / 24);
  if (diffInDays < 30) return `Il y a ${diffInDays} j`;
  return new Date(date).toLocaleDateString('fr-FR');
};

const NotificationDropdown = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const { user } = useSelector(state => state.auth);
  const dropdownRef = useRef(null);

  const fetchNotifications = async () => {
    if (!user?.id) return;
    try {
      const res = await notificationService.getNotificationsByUser(user.id);
      const data = Array.isArray(res.data) ? res.data : [];
      const sorted = data.sort((a, b) => new Date(b.dateCreation) - new Date(a.dateCreation));
      setNotifications(sorted);
      setUnreadCount(sorted.filter(n => !n.estLu).length);
    } catch (error) {
      console.error("Erreur notifications:", error);
    }
  };

  useEffect(() => {
    fetchNotifications();
    const interval = setInterval(fetchNotifications, 60000);
    return () => clearInterval(interval);
  }, [user?.id]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleMarkAsRead = async (id) => {
    try {
      await notificationService.markAsRead(id);
      setNotifications(notifications.map(n => n.id === id ? { ...n, estLu: true } : n));
      setUnreadCount(prev => Math.max(0, prev - 1));
    } catch (error) {
      console.error("Erreur marquage lu:", error);
    }
  };

  const handleMarkAllAsRead = async () => {
    const unreadOnes = notifications.filter(n => !n.estLu);
    for (const n of unreadOnes) {
      await handleMarkAsRead(n.id);
    }
  };

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={clsx(
          "relative p-2 rounded-xl transition-all duration-300 outline-none",
          isOpen ? "bg-primary-50 text-primary-600" : "text-slate-500 hover:bg-slate-100"
        )}
      >
        {unreadCount > 0 ? (
          <BellRing className="w-6 h-6 animate-pulse" />
        ) : (
          <Bell className="w-6 h-6" />
        )}
        
        {unreadCount > 0 && (
          <span className="absolute top-1 right-1 w-5 h-5 bg-red-500 text-white text-[10px] font-black rounded-full flex items-center justify-center border-2 border-white animate-bounce">
            {unreadCount > 9 ? '9+' : unreadCount}
          </span>
        )}
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-3 w-80 sm:w-96 bg-white rounded-2xl shadow-2xl border border-slate-100 overflow-hidden z-[100] animate-in fade-in zoom-in duration-200">
          <div className="p-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
            <h3 className="font-black text-slate-800 tracking-tight">Notifications</h3>
            {unreadCount > 0 && (
              <button 
                onClick={handleMarkAllAsRead}
                className="text-xs font-bold text-primary-600 hover:text-primary-700 transition-colors"
              >
                Tout marquer comme lu
              </button>
            )}
          </div>

          <div className="max-h-[400px] overflow-y-auto">
            {notifications.length === 0 ? (
              <div className="p-10 text-center">
                <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-4 text-slate-300">
                  <Bell className="w-8 h-8" />
                </div>
                <p className="text-slate-400 font-medium">Aucune notification pour le moment.</p>
              </div>
            ) : (
              notifications.map((notification) => (
                <div 
                  key={notification.id}
                  className={clsx(
                    "p-4 border-b border-slate-50 transition-colors flex gap-4 group",
                    !notification.estLu ? "bg-primary-50/30 hover:bg-primary-50/50" : "hover:bg-slate-50"
                  )}
                >
                  <div className={clsx(
                    "w-2 h-2 mt-2 rounded-full flex-shrink-0 transition-all",
                    !notification.estLu ? "bg-primary-500 shadow-[0_0_8px_rgba(59,130,246,0.5)]" : "bg-transparent"
                  )} />
                  
                  <div className="flex-1 min-w-0">
                    <p className={clsx(
                      "text-sm leading-relaxed mb-1",
                      !notification.estLu ? "text-slate-900 font-bold" : "text-slate-600 font-medium"
                    )}>
                      {notification.message}
                    </p>
                    <div className="flex items-center gap-2 text-[10px] font-bold text-slate-400">
                      <Clock className="w-3 h-3" />
                      {timeAgo(notification.dateCreation)}
                    </div>
                  </div>

                  {!notification.estLu && (
                    <button 
                      onClick={() => handleMarkAsRead(notification.id)}
                      className="opacity-0 group-hover:opacity-100 p-1.5 bg-white rounded-lg border border-slate-100 text-primary-600 shadow-sm transition-all hover:scale-110"
                      title="Marquer comme lu"
                    >
                      <Check className="w-4 h-4" />
                    </button>
                  )}
                </div>
              ))
            )}
          </div>

          <div className="p-4 bg-slate-50/50 border-t border-slate-100 text-center">
            <Link 
              to="/profile" 
              onClick={() => setIsOpen(false)}
              className="text-xs font-black text-slate-500 hover:text-primary-600 transition-colors uppercase tracking-widest flex items-center justify-center gap-2"
            >
              Voir mon profil <ExternalLink className="w-3 h-3" />
            </Link>
          </div>
        </div>
      )}
    </div>
  );
};

export default NotificationDropdown;
