import { useAuthStore } from "../store/authStore";
import { Link, useNavigate } from "@tanstack/react-router";

export default function Dashboard() {
  const { currentUser, logout, isAuthenticated } = useAuthStore();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate({ to: "/login" });
  };

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <div className="max-w-4xl mx-auto bg-white rounded-xl shadow p-6">
        <div className="flex items-center justify-between border-b pb-4 mb-6">
          <div>
            <h1 className="text-2xl font-bold text-gray-800">KasBan Dashboard</h1>
            <p className="text-gray-500 text-sm">
              Welcome back, {currentUser?.username || (isAuthenticated ? "User" : "Guest")}!
            </p>
          </div>
          <div className="flex gap-3">
            {isAuthenticated ? (
              <button
                onClick={handleLogout}
                className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg text-sm transition"
              >
                Logout
              </button>
            ) : (
              <Link
                to="/login"
                className="bg-black hover:bg-gray-800 text-white px-4 py-2 rounded-lg text-sm transition"
              >
                Login
              </Link>
            )}
          </div>
        </div>

        <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 text-center">
          <h2 className="text-lg font-semibold text-blue-900 mb-2">
            Kanban Board & Tasks
          </h2>
          <p className="text-blue-700 text-sm max-w-md mx-auto">
            Your task management space is ready. Start creating tasks, managing stages, and collaborating.
          </p>
        </div>
      </div>
    </div>
  );
}
