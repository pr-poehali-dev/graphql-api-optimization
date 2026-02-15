import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { useAuth } from "@/lib/auth";
import { Button } from "@/components/ui/button";
import Icon from "@/components/ui/icon";
import StudentDashboard from "./StudentDashboard";
import TeacherDashboard from "./TeacherDashboard";
import AdminDashboard from "./AdminDashboard";

const roleLabels: Record<string, string> = {
  student: "Ученик",
  teacher: "Учитель",
  admin: "Администратор",
};

const Dashboard = () => {
  const { user, loading, logout } = useAuth();
  const navigate = useNavigate();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50/50">
        <Icon name="Loader2" size={32} className="animate-spin text-primary" />
      </div>
    );
  }

  if (!user) {
    navigate("/login");
    return null;
  }

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <div className="min-h-screen bg-gray-50/50">
      {/* Header */}
      <motion.header
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white border-b border-gray-100 sticky top-0 z-50"
      >
        <div className="max-w-6xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2 text-primary">
              <Icon name="GraduationCap" size={24} />
              <span className="font-bold text-lg hidden sm:inline">ОлимпТрекер</span>
            </div>
            <span className="text-gray-300">|</span>
            <span className="text-sm text-gray-500 bg-gray-100 px-2.5 py-1 rounded-lg">
              {roleLabels[user.role] || user.role}
            </span>
          </div>

          <div className="flex items-center gap-3">
            <span className="text-sm text-gray-600 hidden sm:inline">
              {user.first_name} {user.last_name}
            </span>
            <Button
              variant="ghost"
              size="sm"
              onClick={handleLogout}
              className="text-gray-500 hover:text-red-500 rounded-xl"
            >
              <Icon name="LogOut" size={18} />
              <span className="hidden sm:inline">Выйти</span>
            </Button>
          </div>
        </div>
      </motion.header>

      {/* Content */}
      <main className="max-w-6xl mx-auto px-4 sm:px-6 py-6 sm:py-8">
        {user.role === "student" && <StudentDashboard />}
        {user.role === "teacher" && <TeacherDashboard />}
        {user.role === "admin" && <AdminDashboard />}
      </main>
    </div>
  );
};

export default Dashboard;