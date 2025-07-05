import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom";
import JournalCalendar from "./JournalCalender";

export default function Journal() {
  const [text, setText] = useState("");
  const [mood, setMood] = useState("😐");
  const [entries, setEntries] = useState(() => {
    const saved = localStorage.getItem("journal-entries");
    return saved ? JSON.parse(saved) : [];
  });

  const [effects, setEffects] = useState([]);
  const today = new Date().toISOString().slice(0, 10);
  const navigate = useNavigate();

  const handleSave = () => {
    if (!text.trim()) return;

    const newEntry = { date: today, text, mood };
    const updated = [...entries.filter((e) => e.date !== today), newEntry];
    setEntries(updated);
    setText("");
    setMood("😐");
  };

  useEffect(() => {
    localStorage.setItem("journal-entries", JSON.stringify(entries));
  }, [entries]);

  const handleTyping = (e) => {
    setText(e.target.value);

    const newEffect = {
      id: Date.now(),
      x: Math.random() * 200 - 100,
      emoji: ["🌷", "🫂", "👻", "🌟"][Math.floor(Math.random() * 4)],
    };

    setEffects((prev) => [...prev, newEffect]);
    setTimeout(() => {
      setEffects((prev) => prev.filter((effect) => effect.id !== newEffect.id));
    }, 1000);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-purple-100 p-4 sm:p-6 overflow-x-hidden">
      
      {/* Back Button */}
      <button
        onClick={() => navigate("/")}
        className="mb-4 text-sm text-purple-600 hover:underline block w-fit"
      >
        ← Back to Home
      </button>

      <div className="w-full max-w-xl mx-auto bg-white p-4 sm:p-6 rounded-xl shadow-md relative">
        <h1 className="text-2xl sm:text-3xl font-bold text-purple-700 mb-4 text-center">
          📝 Daily Journal
        </h1>

        <p className="text-sm text-gray-500 text-center mb-4">
          Today's Date: <strong>{today}</strong>
        </p>

        {/* Mood Picker */}
        <div className="mb-4 flex justify-center flex-wrap gap-2 text-2xl">
          {["😄", "😐", "😢", "😠"].map((m) => (
            <motion.button
              key={m}
              onClick={() => setMood(m)}
              animate={mood === m ? { rotate: [0, -15, 15, -10, 10, 0] } : {}}
              transition={{ duration: 0.6 }}
              className={`p-3 rounded-xl border transition duration-200 transform ${
                mood === m
                  ? "bg-white border-purple-500 scale-110 shadow-md"
                  : "bg-black text-white hover:bg-white hover:text-black"
              }`}
            >
              {m}
            </motion.button>
          ))}
        </div>

        {/* Text Area with Emoji Sparkle */}
        <div className="relative">
          <textarea
            className="w-full p-4 border rounded-xl text-black resize-none h-32 focus:outline-purple-400"
            placeholder="Write about your day, thoughts, hobbies..."
            value={text}
            onChange={handleTyping}
          />

          <AnimatePresence>
            {effects.map((effect) => (
              <motion.div
                key={effect.id}
                initial={{ opacity: 1, y: 0, x: 0 }}
                animate={{ opacity: 0, y: -60, x: effect.x }}
                exit={{ opacity: 0 }}
                transition={{ duration: 1 }}
                className="absolute text-2xl"
                style={{ left: "50%", top: "10%" }}
              >
                {effect.emoji}
              </motion.div>
            ))}
          </AnimatePresence>
        </div>

        <button
          onClick={handleSave}
          className="mt-4 w-full bg-purple-600 text-white py-3 rounded-xl hover:bg-purple-700 transition"
        >
          Save Entry
        </button>
      </div>

      <div className="max-w-xl mx-auto mt-10 px-2 sm:px-4">
        <JournalCalendar entries={entries} />

        <h2 className="text-xl font-semibold text-purple-700 mb-3 mt-6">
          📅 Past Entries
        </h2>

        {entries
          .sort((a, b) => b.date.localeCompare(a.date))
          .map((entry) => (
            <div
              key={entry.date}
              className="mb-4 p-4 bg-white rounded-xl shadow text-sm sm:text-base break-words"
            >
              <p className="text-gray-500">
                Date: <strong>{entry.date}</strong>
              </p>
              <p className="text-2xl mt-1">{entry.mood}</p>
              <p className="text-gray-800 mt-2 whitespace-pre-wrap break-words">
                {entry.text}
              </p>
            </div>
          ))}
      </div>
    </div>
  );
}
