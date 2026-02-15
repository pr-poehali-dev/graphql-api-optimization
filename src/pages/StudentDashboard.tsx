import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useAuth } from "@/lib/auth";
import { getMyResults, getStats } from "@/lib/api";
import type { OlympiadResult, StudentStats } from "@/lib/api";
import { Badge } from "@/components/ui/badge";
import Icon from "@/components/ui/icon";

const levelLabels: Record<string, string> = {
  school: "Школьный",
  municipal: "Муниципальный",
  regional: "Региональный",
  national: "Всероссийский",
};

const levelColors: Record<string, string> = {
  school: "bg-blue-100 text-blue-700 border-blue-200",
  municipal: "bg-green-100 text-green-700 border-green-200",
  regional: "bg-orange-100 text-orange-700 border-orange-200",
  national: "bg-purple-100 text-purple-700 border-purple-200",
};

const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.08, duration: 0.4 },
  }),
};

const StudentDashboard = () => {
  const { user } = useAuth();
  const [results, setResults] = useState<OlympiadResult[]>([]);
  const [stats, setStats] = useState<StudentStats>({ total: 0, wins: 0, prizes: 0 });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      try {
        const [r, s] = await Promise.all([getMyResults(), getStats()]);
        setResults(r);
        setStats(s);
      } catch {
        // silently fail
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  const statCards = [
    {
      icon: "Trophy",
      label: "Всего участий",
      value: stats.total,
      color: "text-blue-600",
      bg: "bg-blue-50",
    },
    {
      icon: "Medal",
      label: "Победы (1 место)",
      value: stats.wins,
      color: "text-yellow-600",
      bg: "bg-yellow-50",
    },
    {
      icon: "Award",
      label: "Призовые (1-3)",
      value: stats.prizes,
      color: "text-purple-600",
      bg: "bg-purple-50",
    },
  ];

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Icon name="Loader2" size={32} className="animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Profile Card */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6"
      >
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 rounded-2xl bg-primary/10 flex items-center justify-center">
            <Icon name="User" size={28} className="text-primary" />
          </div>
          <div>
            <h2 className="text-xl font-semibold text-gray-900">
              {user?.first_name} {user?.last_name}
            </h2>
            <div className="flex items-center gap-3 mt-1 text-sm text-gray-500">
              <span className="flex items-center gap-1">
                <Icon name="Mail" size={14} />
                {user?.email}
              </span>
              {user?.grade && (
                <span className="flex items-center gap-1">
                  <Icon name="GraduationCap" size={14} />
                  {user.grade} класс
                </span>
              )}
            </div>
          </div>
        </div>
      </motion.div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {statCards.map((card, i) => (
          <motion.div
            key={card.label}
            custom={i}
            initial="hidden"
            animate="visible"
            variants={fadeUp}
            className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 hover:shadow-md transition-shadow"
          >
            <div className="flex items-center gap-3">
              <div className={`w-10 h-10 rounded-xl ${card.bg} flex items-center justify-center`}>
                <Icon name={card.icon} size={20} className={card.color} />
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-900">{card.value}</p>
                <p className="text-sm text-gray-500">{card.label}</p>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Results */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="bg-white rounded-2xl border border-gray-100 shadow-sm"
      >
        <div className="p-6 border-b border-gray-100">
          <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
            <Icon name="ClipboardList" size={20} className="text-primary" />
            Мои результаты
          </h3>
        </div>

        {results.length === 0 ? (
          <div className="p-12 text-center">
            <div className="w-16 h-16 rounded-2xl bg-gray-100 flex items-center justify-center mx-auto mb-4">
              <Icon name="FileText" size={28} className="text-gray-400" />
            </div>
            <p className="text-gray-500 font-medium">Пока нет результатов</p>
            <p className="text-gray-400 text-sm mt-1">
              Результаты олимпиад появятся здесь после добавления учителем
            </p>
          </div>
        ) : (
          <div className="divide-y divide-gray-50">
            {results.map((result, i) => (
              <motion.div
                key={result.id}
                custom={i}
                initial="hidden"
                animate="visible"
                variants={fadeUp}
                className="p-4 sm:p-5 hover:bg-gray-50/50 transition-colors"
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div className="flex-1">
                    <p className="font-medium text-gray-900">
                      {result.olympiad_title || `Олимпиада #${result.olympiad_id}`}
                    </p>
                    <div className="flex flex-wrap items-center gap-2 mt-1.5">
                      {result.subject && (
                        <span className="text-sm text-gray-500">
                          {result.subject}
                        </span>
                      )}
                      {result.level && (
                        <Badge
                          className={`${levelColors[result.level] || ""} border text-xs font-medium`}
                          variant="outline"
                        >
                          {levelLabels[result.level] || result.level}
                        </Badge>
                      )}
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="text-right">
                      <p className="text-sm text-gray-500">Место</p>
                      <p className="text-lg font-bold text-gray-900">
                        {result.place <= 3 ? (
                          <span className={
                            result.place === 1
                              ? "text-yellow-600"
                              : result.place === 2
                              ? "text-gray-500"
                              : "text-orange-600"
                          }>
                            {result.place}
                          </span>
                        ) : (
                          result.place
                        )}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm text-gray-500">Год</p>
                      <p className="font-medium text-gray-900">{result.year}</p>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </motion.div>
    </div>
  );
};

export default StudentDashboard;