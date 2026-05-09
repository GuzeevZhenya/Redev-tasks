"use client";
import { useState, useEffect, useCallback } from 'react';
import { motion } from 'framer-motion';

type Guest = {
  id: string;
  name: string;
  email: string;
  uniqueLink: string;
  hasResponded: boolean;
  willAttend: boolean | null;
  guestsCount: number | null;
  message: string | null;
  createdAt: string;
};

export default function Dashboard() {
  const [token, setToken] = useState(() => typeof window !== 'undefined' ? localStorage.getItem('adminToken') || '' : '');
  const [guests, setGuests] = useState<Guest[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<'all' | 'yes' | 'no' | 'pending'>('all');

  const load = useCallback(async (t: string) => {
    setLoading(true);
    try {
      const r = await fetch('/api/admin/guests', {
        headers: { 'x-admin-token': t }
      });
      if (r.status === 401) {
        localStorage.removeItem('adminToken');
        setToken('');
        return;
      }
      const d = await r.json();
      if (Array.isArray(d)) setGuests(d);
    } catch {
      console.error('Ошибка загрузки');
    }
    setLoading(false);
  }, []);

  useEffect(() => {
    if (token) load(token);
    else setLoading(false);
  }, [token, load]);

  const login = (e: React.FormEvent) => {
    e.preventDefault();
    if (token.trim()) {
      localStorage.setItem('adminToken', token.trim());
      setLoading(true);
      load(token.trim());
    }
  };

  const logout = () => {
    localStorage.removeItem('adminToken');
    setToken('');
    setGuests([]);
  };

  const filtered = guests.filter(g => {
    if (filter === 'all') return true;
    if (filter === 'yes') return g.hasResponded && g.willAttend;
    if (filter === 'no') return g.hasResponded && !g.willAttend;
    return !g.hasResponded;
  });

  const stats = {
    total: guests.length,
    attending: guests.filter(g => g.willAttend).reduce((s, g) => s + (g.guestsCount || 1), 0),
    attendingCount: guests.filter(g => g.willAttend).length,
    declined: guests.filter(g => g.hasResponded && !g.willAttend).length,
    pending: guests.filter(g => !g.hasResponded).length,
    responseRate: guests.length ? Math.round((guests.filter(g => g.hasResponded).length / guests.length) * 100) : 0
  };

  if (!token) return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-indigo-900 flex items-center justify-center p-6">
      <motion.form initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} onSubmit={login} className="bg-white/10 backdrop-blur-xl rounded-2xl shadow-2xl border border-white/20 p-8 max-w-sm w-full">
        <div className="text-center mb-6">
          <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full flex items-center justify-center mx-auto mb-4">
            <span className="text-2xl">🔐</span>
          </div>
          <h1 className="text-2xl font-bold text-white">Вход в админ-панель</h1>
          <p className="text-gray-400 text-sm mt-1">Введите секретный токен</p>
        </div>
        <input
          type="password"
          placeholder="Токен доступа"
          className="w-full p-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 mb-4"
          value={token}
          onChange={e => setToken(e.target.value)}
          autoFocus
        />
        <button type="submit" className="w-full bg-gradient-to-r from-purple-500 to-pink-500 text-white py-3 rounded-xl font-semibold hover:from-purple-600 hover:to-pink-600 transition shadow-lg">
          Войти
        </button>
        <p className="text-xs text-gray-500 mt-4 text-center">Токен: <code className="text-purple-400">wedding-secret-2024</code></p>
      </motion.form>
    </div>
  );

  if (loading) return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-indigo-900 flex items-center justify-center">
      <div className="text-center">
        <div className="w-16 h-16 border-4 border-purple-400 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
        <p className="text-gray-400">Загрузка данных...</p>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 py-8 px-4">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
              📊 Управление гостями
            </h1>
            <p className="text-gray-500 mt-1">Всего приглашено: {stats.total} человек</p>
          </div>
          <button onClick={logout} className="flex items-center gap-2 px-4 py-2 bg-white rounded-lg shadow hover:shadow-md transition text-gray-600 hover:text-red-600">
            🔓 Выйти
          </button>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-8">
          {[
            ['👥 Всего', stats.total, 'from-blue-500 to-cyan-500'],
            ['✅ Придут (чел)', stats.attending, 'from-green-500 to-emerald-500'],
            ['👍 Придут (семей)', stats.attendingCount, 'from-emerald-500 to-teal-500'],
            ['❌ Отказались', stats.declined, 'from-red-500 to-rose-500'],
            ['⏳ Нет ответа', stats.pending, 'from-yellow-500 to-orange-500']
          ].map(([label, value, gradient]) => (
            <motion.div key={label} whileHover={{ y: -5 }} className={`bg-gradient-to-br ${gradient} rounded-xl p-4 text-white shadow-lg`}>
              <div className="text-2xl font-bold">{value}</div>
              <div className="text-xs opacity-90 mt-1">{label}</div>
            </motion.div>
          ))}
        </div>

        <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
          <div className="border-b border-gray-100 p-4 flex gap-2 flex-wrap">
            {[
              ['all', '📋 Все гости'],
              ['yes', '✅ Придут'],
              ['no', '❌ Не придут'],
              ['pending', '⏳ Ожидают']
            ].map(([k, l]) => (
              <button
                key={k}
                onClick={() => setFilter(k as any)}
                className={`px-5 py-2 rounded-lg text-sm font-medium transition-all ${filter === k
                  ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white shadow-md'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                  }`}
              >
                {l}
              </button>
            ))}
            <div className="ml-auto text-sm text-gray-400 flex items-center">
              Ответили: {stats.responseRate}%
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-gray-50">
                <tr>
                  <th className="p-4 text-left font-semibold text-gray-600">Имя</th>
                  <th className="p-4 text-left font-semibold text-gray-600">Email</th>
                  <th className="p-4 text-left font-semibold text-gray-600">Статус</th>
                  <th className="p-4 text-left font-semibold text-gray-600">Гостей</th>
                  <th className="p-4 text-left font-semibold text-gray-600 hidden md:table-cell">Комментарий</th>
                  <th className="p-4 text-left font-semibold text-gray-600">Ссылка</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map(guest => (
                  <tr key={guest.id} className="border-t border-gray-100 hover:bg-purple-50 transition">
                    <td className="p-4 font-medium text-gray-800">{guest.name}</td>
                    <td className="p-4 text-gray-500">{guest.email}</td>
                    <td className="p-4">
                      {!guest.hasResponded ? (
                        <span className="inline-flex items-center gap-1 px-2 py-1 bg-yellow-100 text-yellow-700 rounded-full text-xs">⏳ Ожидает</span>
                      ) : guest.willAttend ? (
                        <span className="inline-flex items-center gap-1 px-2 py-1 bg-green-100 text-green-700 rounded-full text-xs">✅ Придет</span>
                      ) : (
                        <span className="inline-flex items-center gap-1 px-2 py-1 bg-red-100 text-red-700 rounded-full text-xs">❌ Не придет</span>
                      )}
                    </td>
                    <td className="p-4 text-gray-600">{guest.willAttend ? guest.guestsCount : '—'}</td>
                    <td className="p-4 text-gray-500 max-w-xs truncate hidden md:table-cell" title={guest.message || ''}>
                      {guest.message || '—'}
                    </td>
                    <td className="p-4">
                      <a href={`/rsvp/${guest.uniqueLink}`} target="_blank" className="text-purple-500 hover:text-purple-700 transition" title="Открыть приглашение">
                        🔗
                      </a>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            {filtered.length === 0 && (
              <div className="p-12 text-center text-gray-400">
                📭 Нет гостей, соответствующих фильтру
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}