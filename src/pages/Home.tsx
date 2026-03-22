import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useHistoryStore } from '../store/historyStore';
import { useSessionStore } from '../store/sessionStore';
import SwipeableHistoryCard from '../components/SwipeableHistoryCard';
import ThemeToggle from '../components/ThemeToggle';
import { Session } from '../types';

export default function Home() {
  const navigate = useNavigate();
  const { sessions, isLoaded, loadHistory, deleteSession } = useHistoryStore();
  const resetSession = useSessionStore((s) => s.resetSession);

  useEffect(() => {
    loadHistory();
  }, [loadHistory]);

  const handleNewCheck = () => {
    resetSession();
    navigate('/split/people');
  };

  return (
    <div className="min-h-dvh bg-bg flex flex-col font-nunito">
      <div className="px-6 pt-6 flex justify-end">
        <ThemeToggle />
      </div>

      <div className="px-6 pb-8 flex flex-col items-center">
        <motion.h1
          className="text-[#4A90D9] font-nunito font-black text-3xl text-center"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          Guess The Check !
        </motion.h1>

        <motion.p
          className="text-text-secondary text-center mt-2"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          Know your share, every time
        </motion.p>

        <motion.button
          onClick={handleNewCheck}
          className="mt-8 w-full bg-[#4A90D9] text-white font-bold text-lg rounded-[18px] py-4.5 shadow-md active:scale-95 transition-transform"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
        >
          New Check Split
        </motion.button>
      </div>

      <div className="px-6 flex-1 pb-8">
        <h2 className="font-bold text-lg mb-4">Recent Checks</h2>

        {isLoaded && sessions.length === 0 && (
          <motion.div
            className="text-center text-text-secondary py-12"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
          >
            <p className="text-4xl mb-3">🧾</p>
            <p>No checks yet.</p>
            <p className="text-sm mt-1">
              Tap "New Check Split" to get started!
            </p>
          </motion.div>
        )}

        <div className="flex flex-col gap-3">
          {sessions.map((session) => (
            <SwipeableHistoryCard
              key={session.id}
              session={session}
              onPress={() => navigate(`/history/${session.id}`)}
              onDelete={() => deleteSession(session.id)}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
