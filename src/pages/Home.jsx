import { Link } from 'react-router-dom';

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-100 flex flex-col items-center justify-center text-center px-4 py-8">
      <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-gray-800 mb-4">
        Welcome to EmoWeb 💙
      </h1>

      <p className="text-gray-600 mb-8 text-base sm:text-lg max-w-md">
        A safe space to express your feelings, reflect on your day, and connect with others anonymously.
      </p>

      <div className="flex flex-col w-full max-w-sm space-y-4">
        <Link to="/journal">
          <button className="w-full py-3 bg-blue-500 text-white rounded-xl shadow hover:bg-blue-600 transition">
            Start Journaling
          </button>
        </Link>

        <Link to="/chat">
          <button className="w-full py-3 bg-indigo-500 text-white rounded-xl shadow hover:bg-indigo-600 transition">
            Talk to AI
          </button>
        </Link>

        <button className="w-full py-3 bg-pink-500 text-white rounded-xl shadow hover:bg-pink-600 transition">
          Join Peer Chat
        </button>
      </div>
    </div>
  );
}
