"use client";
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export default function AddGuestPage() {
  const [form, setForm] = useState({ name: '', email: '', uniqueLink: '' });
  const [loading, setLoading] = useState(false);
  const [res, setRes] = useState<{ ok?: boolean; msg?: string; link?: string }>({});

  const genLink = () => Math.random().toString(36).slice(2, 8) + Date.now().toString(36).slice(4);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true); setRes({});
    try {
      const r = await fetch('/api/admin/guests', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form)
      });
      const d = await r.json();
      if (r.ok) {
        setRes({ ok: true, msg: 'Гость успешно добавлен!', link: `/rsvp/${d.guest.uniqueLink}` });
        setForm({ name: '', email: '', uniqueLink: '' });
      } else {
        setRes({ ok: false, msg: d.error || 'Ошибка при добавлении' });
      }
    } catch {
      setRes({ ok: false, msg: 'Ошибка сети' });
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-indigo-900 py-12 px-4">
      <div className="max-w-2xl mx-auto">
        <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-purple-500 to-pink-500 rounded-2xl shadow-xl mb-4">
            <span className="text-3xl">✨</span>
          </div>
          <h1 className="text-4xl font-bold bg-gradient-to-r from-purple-400 via-pink-400 to-rose-400 bg-clip-text text-transparent">
            Пригласительный центр
          </h1>
          <p className="text-gray-400 mt-2">Добавьте гостей и отправьте приглашения</p>
        </motion.div>

        <motion.form initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} onSubmit={submit} className="bg-white/10 backdrop-blur-xl rounded-2xl shadow-2xl border border-white/20 p-8 space-y-5">
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">👤 Имя гостя</label>
            <input
              required
              placeholder="Александр Петров"
              className="w-full p-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition"
              value={form.name}
              onChange={e => setForm({ ...form, name: e.target.value })}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">📧 Email</label>
            <input
              required
              type="email"
              placeholder="alexander@example.com"
              className="w-full p-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition"
              value={form.email}
              onChange={e => setForm({ ...form, email: e.target.value })}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">🔗 Уникальная ссылка</label>
            <div className="flex gap-2">
              <input
                required
                placeholder="уникальный-идентификатор"
                className="flex-1 p-3 bg-white/10 border border-white/20 rounded-xl text-white font-mono text-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500"
                value={form.uniqueLink}
                onChange={e => setForm({ ...form, uniqueLink: e.target.value })}
              />
              <button
                type="button"
                onClick={() => setForm({ ...form, uniqueLink: genLink() })}
                className="px-5 bg-white/20 hover:bg-white/30 rounded-xl transition text-white font-medium"
              >
                🎲
              </button>
            </div>
          </div>

          <motion.button
            type="submit"
            disabled={loading}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="w-full bg-gradient-to-r from-purple-500 to-pink-500 text-white py-3 rounded-xl font-semibold hover:from-purple-600 hover:to-pink-600 disabled:opacity-50 transition shadow-lg"
          >
            {loading ? (
              <div className="flex items-center justify-center gap-2">
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                Добавление...
              </div>
            ) : (
              '✨ Добавить гостя'
            )}
          </motion.button>

          <AnimatePresence>
            {res.msg && (
              <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className={`p-4 rounded-xl ${res.ok ? 'bg-green-500/20 border border-green-500/50' : 'bg-red-500/20 border border-red-500/50'}`}>
                <div className="flex items-center gap-3">
                  <span>{res.ok ? '🎉' : '⚠️'}</span>
                  <p className={`text-sm flex-1 ${res.ok ? 'text-green-300' : 'text-red-300'}`}>{res.msg}</p>
                  {res.link && (
                    <a href={res.link} target="_blank" className="text-purple-400 hover:text-purple-300 underline text-sm">Открыть →</a>
                  )}
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          <div className="pt-4 border-t border-white/10 text-center">
            <a href="/admin/dashboard" className="text-gray-400 hover:text-white transition text-sm">
              ← Посмотреть список гостей
            </a>
          </div>
        </motion.form>
      </div>
    </div>
  );
}