"use client";
import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
export default function RsvpPage() {
  const params = useParams();
  const [guest, setGuest] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [willAttend, setWillAttend] = useState('');
  const [count, setCount] = useState(1);
  const [msg, setMsg] = useState('');
  const [done, setDone] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    const link = params.link as string;
    if (!link) return;
    fetch(`/api/guest/${link}`)
      .then(r => r.json())
      .then(d => { if (d.error) setError(d.error); else setGuest(d); if (d.hasResponded) { setDone(true); setWillAttend(d.willAttend ? 'true' : 'false'); } })
      .catch(() => setError('Ошибка загрузки'))
      .finally(() => setLoading(false));
  }, [params.link]);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault(); if (!willAttend) return;
    setSubmitting(true); setError('');
    try {
      const r = await fetch('/api/rsvp', {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ link: params.link, willAttend, guestsCount: willAttend === 'true' ? count : null, message: msg })
      });
      const d = await r.json();
      if (!r.ok) throw new Error(d.error);
      setDone(true);
    } catch (e: any) { setError(e.message); }
    setSubmitting(false);
  };

  if (loading) return (
    <div className="min-h-screen bg-gradient-to-br from-rose-100 via-pink-100 to-amber-100 flex items-center justify-center">
      <div className="text-center">
        <div className="w-16 h-16 border-4 border-rose-400 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
        <p className="text-rose-600 font-medium">Загрузка приглашения...</p>
      </div>
    </div>
  );

  if (error || !guest) return (
    <div className="min-h-screen bg-gradient-to-br from-rose-100 via-pink-100 to-amber-100 flex items-center justify-center p-6">
      <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="bg-white/90 backdrop-blur-sm rounded-2xl shadow-2xl p-8 text-center max-w-md">
        <div className="text-6xl mb-4">😔</div>
        <h1 className="text-2xl font-bold text-gray-800 mb-2">Приглашение не найдено</h1>
        <p className="text-gray-600">{error || 'Пожалуйста, проверьте ссылку'}</p>
      </motion.div>
    </div>
  );

  if (done) return (
    <div className="min-h-screen bg-gradient-to-br from-green-100 via-emerald-100 to-teal-100 flex items-center justify-center p-4">
      <motion.div initial={{ scale: 0.9, opacity: 0, y: 20 }} animate={{ scale: 1, opacity: 1, y: 0 }} className="bg-white rounded-2xl p-8 text-center max-w-md shadow-2xl">
        <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ delay: 0.2, type: "spring" }} className="text-7xl mb-4">
          {willAttend === 'true' ? '🎉' : '💝'}
        </motion.div>
        <h1 className="text-2xl font-bold text-gray-800 mb-2">Спасибо, {guest.name}!</h1>
        <p className="text-gray-600 leading-relaxed">
          {willAttend === 'true'
            ? 'С нетерпением ждём вас на нашем торжестве! 💒✨'
            : 'Жаль, что не сможете присутствовать. Обязательно отметим вместе в другой раз! 💕'}
        </p>
        <div className="mt-6 pt-4 border-t border-gray-100">
          <p className="text-xs text-gray-400">Ответ сохранён • {new Date().toLocaleDateString('ru-RU')}</p>
        </div>
      </motion.div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-rose-100 via-pink-100 to-amber-100 flex items-center justify-center p-4">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="w-full max-w-md">
        <form onSubmit={submit} className="bg-white/95 backdrop-blur-sm rounded-2xl shadow-2xl p-8 space-y-6">
          <div className="text-center">
            <div className="w-20 h-20 bg-gradient-to-br from-rose-400 to-pink-500 rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg">
              <span className="text-3xl">💌</span>
            </div>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-rose-600 to-pink-600 bg-clip-text text-transparent mb-2">
              Приглашение
            </h1>
            <p className="text-gray-600">
              <span className="font-semibold text-rose-600">{guest.name}</span>, мы ждём вас!
            </p>
          </div>

          <div className="space-y-3">
            <label className="block text-sm font-medium text-gray-700 text-center">Вы сможете присутствовать?</label>
            <div className="flex gap-3">
              <button
                type="button"
                onClick={() => setWillAttend('true')}
                className={`flex-1 py-3 rounded-xl font-semibold transition-all transform hover:scale-105 ${willAttend === 'true'
                  ? 'bg-gradient-to-r from-green-500 to-emerald-600 text-white shadow-lg'
                  : 'bg-gray-100 text-gray-700 hover:bg-green-50'
                  }`}
              >
                ✅ Да, буду!
              </button>
              <button
                type="button"
                onClick={() => setWillAttend('false')}
                className={`flex-1 py-3 rounded-xl font-semibold transition-all transform hover:scale-105 ${willAttend === 'false'
                  ? 'bg-gradient-to-r from-red-500 to-rose-600 text-white shadow-lg'
                  : 'bg-gray-100 text-gray-700 hover:bg-red-50'
                  }`}
              >
                ❌ Нет, не смогу
              </button>
            </div>
          </div>

          <AnimatePresence>
            {willAttend === 'true' && (
              <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }} className="space-y-4 pt-2">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">👥 Количество гостей</label>
                  <div className="flex items-center gap-3">
                    <button type="button" onClick={() => setCount(Math.max(1, count - 1))} className="w-10 h-10 rounded-full bg-gray-100 hover:bg-gray-200 text-lg font-bold">−</button>
                    <span className="text-2xl font-bold text-rose-600 min-w-[50px] text-center">{count}</span>
                    <button type="button" onClick={() => setCount(Math.min(10, count + 1))} className="w-10 h-10 rounded-full bg-gray-100 hover:bg-gray-200 text-lg font-bold">+</button>
                  </div>
                  <p className="text-xs text-gray-400 mt-1">Включая вас</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">💬 Пожелания или комментарии</label>
                  <textarea
                    rows={3}
                    value={msg}
                    onChange={e => setMsg(e.target.value)}
                    className="w-full p-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-rose-400 focus:border-transparent transition"
                    placeholder="Аллергии, особые пожелания, тост..."
                  />
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {error && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="p-3 bg-red-50 border border-red-200 text-red-700 rounded-xl text-sm">
              ⚠️ {error}
            </motion.div>
          )}

          <button
            disabled={!willAttend || submitting}
            className="w-full bg-gradient-to-r from-rose-500 to-pink-500 text-white py-3 rounded-xl font-semibold hover:from-rose-600 hover:to-pink-600 transition-all transform hover:scale-[1.02] disabled:opacity-50 disabled:transform-none shadow-lg"
          >
            {submitting ? (
              <div className="flex items-center justify-center gap-2">
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                Отправка...
              </div>
            ) : (
              '💌 Подтвердить ответ'
            )}
          </button>
        </form>
      </motion.div>
    </div>
  );
}