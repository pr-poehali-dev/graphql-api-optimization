import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { listOlympiads, listStudents, approveOlympiad } from "@/lib/api";
import type { Olympiad, User } from "@/lib/api";
import { Button } from "@/components/ui/button";
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

const AdminDashboard = () => {
  const [olympiads, setOlympiads] = useState<Olympiad[]>([]);
  const [students, setStudents] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [approvingId, setApprovingId] = useState<number | null>(null);

  const loadData = async () => {
    try {
      const [o, s] = await Promise.all([listOlympiads(), listStudents()]);
      setOlympiads(o);
      setStudents(s);
    } catch {
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleApprove = async (id: number) => {
    setApprovingId(id);
    try {
      await approveOlympiad(id);
      await loadData();
    } catch {
    } finally {
      setApprovingId(null);
    }
  };

  const pending = olympiads.filter((o) => !o.is_approved);
  const approved = olympiads.filter((o) => o.is_approved);

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Icon name="Loader2" size={32} className="animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5"
        >
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-blue-50 flex items-center justify-center">
              <Icon name="Users" size={20} className="text-blue-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-900">{students.length}</p>
              <p className="text-sm text-gray-500">Учеников</p>
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.08 }}
          className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5"
        >
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-green-50 flex items-center justify-center">
              <Icon name="Trophy" size={20} className="text-green-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-900">{approved.length}</p>
              <p className="text-sm text-gray-500">Олимпиад</p>
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.16 }}
          className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5"
        >
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-orange-50 flex items-center justify-center">
              <Icon name="Clock" size={20} className="text-orange-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-900">{pending.length}</p>
              <p className="text-sm text-gray-500">Ожидают проверки</p>
            </div>
          </div>
        </motion.div>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="bg-white rounded-2xl border border-gray-100 shadow-sm"
      >
        <div className="p-6 border-b border-gray-100">
          <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
            <Icon name="Clock" size={20} className="text-orange-500" />
            Ожидают подтверждения ({pending.length})
          </h3>
        </div>

        {pending.length === 0 ? (
          <div className="p-12 text-center">
            <div className="w-16 h-16 rounded-2xl bg-green-50 flex items-center justify-center mx-auto mb-4">
              <Icon name="CheckCircle" size={28} className="text-green-500" />
            </div>
            <p className="text-gray-500 font-medium">Все олимпиады подтверждены</p>
          </div>
        ) : (
          <div className="divide-y divide-gray-50">
            {pending.map((o) => (
              <div key={o.id} className="p-4 sm:px-6 hover:bg-gray-50/50 transition-colors">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div className="flex-1">
                    <p className="font-medium text-gray-900">{o.title}</p>
                    <div className="flex items-center gap-2 mt-1">
                      <span className="text-sm text-gray-500">{o.subject}</span>
                      <Badge
                        className={`${levelColors[o.level] || ""} border text-xs font-medium`}
                        variant="outline"
                      >
                        {levelLabels[o.level] || o.level}
                      </Badge>
                      <span className="text-sm text-gray-400">{o.event_date}</span>
                    </div>
                  </div>
                  <Button
                    size="sm"
                    onClick={() => handleApprove(o.id)}
                    disabled={approvingId === o.id}
                    className="rounded-xl"
                  >
                    {approvingId === o.id ? (
                      <Icon name="Loader2" size={14} className="animate-spin" />
                    ) : (
                      <>
                        <Icon name="Check" size={14} />
                        Подтвердить
                      </>
                    )}
                  </Button>
                </div>
              </div>
            ))}
          </div>
        )}
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="bg-white rounded-2xl border border-gray-100 shadow-sm"
      >
        <div className="p-6 border-b border-gray-100">
          <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
            <Icon name="Trophy" size={20} className="text-primary" />
            Все олимпиады ({olympiads.length})
          </h3>
        </div>

        {olympiads.length === 0 ? (
          <div className="p-12 text-center">
            <div className="w-16 h-16 rounded-2xl bg-gray-100 flex items-center justify-center mx-auto mb-4">
              <Icon name="Trophy" size={28} className="text-gray-400" />
            </div>
            <p className="text-gray-500 font-medium">Нет олимпиад</p>
          </div>
        ) : (
          <div className="divide-y divide-gray-50">
            {olympiads.map((o) => (
              <div key={o.id} className="p-4 sm:px-6 hover:bg-gray-50/50 transition-colors">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="flex items-center gap-2">
                      <p className="font-medium text-gray-900">{o.title}</p>
                      {o.is_approved ? (
                        <span className="flex items-center gap-1 text-xs text-green-600 bg-green-50 px-2 py-0.5 rounded-full">
                          <Icon name="CheckCircle" size={12} />
                          Подтверждена
                        </span>
                      ) : (
                        <span className="flex items-center gap-1 text-xs text-orange-600 bg-orange-50 px-2 py-0.5 rounded-full">
                          <Icon name="Clock" size={12} />
                          На проверке
                        </span>
                      )}
                    </div>
                    <div className="flex items-center gap-2 mt-1">
                      <span className="text-sm text-gray-500">{o.subject}</span>
                      <Badge
                        className={`${levelColors[o.level] || ""} border text-xs font-medium`}
                        variant="outline"
                      >
                        {levelLabels[o.level] || o.level}
                      </Badge>
                    </div>
                  </div>
                  <span className="text-sm text-gray-500">{o.event_date}</span>
                </div>
              </div>
            ))}
          </div>
        )}
      </motion.div>
    </div>
  );
};

export default AdminDashboard;
