import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useAuth } from "@/lib/auth";
import {
  listOlympiads,
  createOlympiad,
  addResult,
  listStudents,
} from "@/lib/api";
import type { Olympiad, User } from "@/lib/api";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
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

const TeacherDashboard = () => {
  const { user } = useAuth();
  const [olympiads, setOlympiads] = useState<Olympiad[]>([]);
  const [students, setStudents] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);

  // Create olympiad form
  const [oTitle, setOTitle] = useState("");
  const [oSubject, setOSubject] = useState("");
  const [oLevel, setOLevel] = useState("school");
  const [oDate, setODate] = useState("");
  const [oDesc, setODesc] = useState("");
  const [creating, setCreating] = useState(false);
  const [createMsg, setCreateMsg] = useState("");

  // Add result form
  const [rStudentId, setRStudentId] = useState("");
  const [rOlympiadId, setROlympiadId] = useState("");
  const [rPlace, setRPlace] = useState("");
  const [rYear, setRYear] = useState(String(new Date().getFullYear()));
  const [adding, setAdding] = useState(false);
  const [addMsg, setAddMsg] = useState("");

  const loadData = async () => {
    try {
      const [o, s] = await Promise.all([listOlympiads(), listStudents()]);
      setOlympiads(o);
      setStudents(s);
    } catch {
      // silently fail
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleCreateOlympiad = async (e: React.FormEvent) => {
    e.preventDefault();
    setCreating(true);
    setCreateMsg("");
    try {
      await createOlympiad({
        title: oTitle,
        subject: oSubject,
        level: oLevel,
        event_date: oDate,
        description: oDesc,
      });
      setCreateMsg("Олимпиада создана");
      setOTitle("");
      setOSubject("");
      setOLevel("school");
      setODate("");
      setODesc("");
      await loadData();
    } catch (err) {
      setCreateMsg(err instanceof Error ? err.message : "Ошибка создания");
    } finally {
      setCreating(false);
    }
  };

  const handleAddResult = async (e: React.FormEvent) => {
    e.preventDefault();
    setAdding(true);
    setAddMsg("");
    try {
      await addResult({
        student_id: parseInt(rStudentId),
        olympiad_id: parseInt(rOlympiadId),
        place: parseInt(rPlace),
        year: parseInt(rYear),
      });
      setAddMsg("Результат добавлен");
      setRStudentId("");
      setROlympiadId("");
      setRPlace("");
    } catch (err) {
      setAddMsg(err instanceof Error ? err.message : "Ошибка добавления");
    } finally {
      setAdding(false);
    }
  };

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
            <Icon name="BookOpen" size={28} className="text-primary" />
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
              {user?.subject && (
                <span className="flex items-center gap-1">
                  <Icon name="Bookmark" size={14} />
                  {user.subject}
                </span>
              )}
            </div>
          </div>
        </div>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Create Olympiad Form */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6"
        >
          <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2 mb-5">
            <Icon name="Plus" size={20} className="text-primary" />
            Создать олимпиаду
          </h3>

          {createMsg && (
            <div className={`mb-4 p-3 rounded-xl text-sm flex items-center gap-2 ${
              createMsg.includes("создана")
                ? "bg-green-50 border border-green-100 text-green-600"
                : "bg-red-50 border border-red-100 text-red-600"
            }`}>
              <Icon name={createMsg.includes("создана") ? "CheckCircle" : "AlertCircle"} size={16} />
              {createMsg}
            </div>
          )}

          <form onSubmit={handleCreateOlympiad} className="space-y-4">
            <div className="space-y-2">
              <Label>Название</Label>
              <Input
                placeholder="Всероссийская олимпиада по математике"
                value={oTitle}
                onChange={(e) => setOTitle(e.target.value)}
                required
                className="rounded-xl"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-2">
                <Label>Предмет</Label>
                <Input
                  placeholder="Математика"
                  value={oSubject}
                  onChange={(e) => setOSubject(e.target.value)}
                  required
                  className="rounded-xl"
                />
              </div>
              <div className="space-y-2">
                <Label>Уровень</Label>
                <Select value={oLevel} onValueChange={setOLevel}>
                  <SelectTrigger className="rounded-xl">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="school">Школьный</SelectItem>
                    <SelectItem value="municipal">Муниципальный</SelectItem>
                    <SelectItem value="regional">Региональный</SelectItem>
                    <SelectItem value="national">Всероссийский</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-2">
              <Label>Дата проведения</Label>
              <Input
                type="date"
                value={oDate}
                onChange={(e) => setODate(e.target.value)}
                required
                className="rounded-xl"
              />
            </div>

            <div className="space-y-2">
              <Label>Описание</Label>
              <Input
                placeholder="Краткое описание (необязательно)"
                value={oDesc}
                onChange={(e) => setODesc(e.target.value)}
                className="rounded-xl"
              />
            </div>

            <Button type="submit" className="w-full rounded-xl" disabled={creating}>
              {creating ? (
                <span className="flex items-center gap-2">
                  <Icon name="Loader2" size={16} className="animate-spin" />
                  Создание...
                </span>
              ) : (
                "Создать олимпиаду"
              )}
            </Button>
          </form>
        </motion.div>

        {/* Add Result Form */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6"
        >
          <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2 mb-5">
            <Icon name="FileEdit" size={20} className="text-primary" />
            Добавить результат
          </h3>

          {addMsg && (
            <div className={`mb-4 p-3 rounded-xl text-sm flex items-center gap-2 ${
              addMsg.includes("добавлен")
                ? "bg-green-50 border border-green-100 text-green-600"
                : "bg-red-50 border border-red-100 text-red-600"
            }`}>
              <Icon name={addMsg.includes("добавлен") ? "CheckCircle" : "AlertCircle"} size={16} />
              {addMsg}
            </div>
          )}

          <form onSubmit={handleAddResult} className="space-y-4">
            <div className="space-y-2">
              <Label>Ученик</Label>
              <Select value={rStudentId} onValueChange={setRStudentId}>
                <SelectTrigger className="rounded-xl">
                  <SelectValue placeholder="Выберите ученика" />
                </SelectTrigger>
                <SelectContent>
                  {students.map((s) => (
                    <SelectItem key={s.id} value={String(s.id)}>
                      {s.last_name} {s.first_name}
                      {s.grade ? ` (${s.grade} кл.)` : ""}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Олимпиада</Label>
              <Select value={rOlympiadId} onValueChange={setROlympiadId}>
                <SelectTrigger className="rounded-xl">
                  <SelectValue placeholder="Выберите олимпиаду" />
                </SelectTrigger>
                <SelectContent>
                  {olympiads.map((o) => (
                    <SelectItem key={o.id} value={String(o.id)}>
                      {o.title}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-2">
                <Label>Место</Label>
                <Input
                  type="number"
                  min={1}
                  placeholder="1"
                  value={rPlace}
                  onChange={(e) => setRPlace(e.target.value)}
                  required
                  className="rounded-xl"
                />
              </div>
              <div className="space-y-2">
                <Label>Год</Label>
                <Input
                  type="number"
                  min={2000}
                  max={2030}
                  value={rYear}
                  onChange={(e) => setRYear(e.target.value)}
                  required
                  className="rounded-xl"
                />
              </div>
            </div>

            <Button type="submit" className="w-full rounded-xl" disabled={adding}>
              {adding ? (
                <span className="flex items-center gap-2">
                  <Icon name="Loader2" size={16} className="animate-spin" />
                  Добавление...
                </span>
              ) : (
                "Добавить результат"
              )}
            </Button>
          </form>
        </motion.div>
      </div>

      {/* Students List */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="bg-white rounded-2xl border border-gray-100 shadow-sm"
      >
        <div className="p-6 border-b border-gray-100">
          <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
            <Icon name="Users" size={20} className="text-primary" />
            Ученики ({students.length})
          </h3>
        </div>

        {students.length === 0 ? (
          <div className="p-12 text-center">
            <div className="w-16 h-16 rounded-2xl bg-gray-100 flex items-center justify-center mx-auto mb-4">
              <Icon name="Users" size={28} className="text-gray-400" />
            </div>
            <p className="text-gray-500 font-medium">Нет учеников</p>
          </div>
        ) : (
          <div className="divide-y divide-gray-50">
            {students.map((s) => (
              <div key={s.id} className="p-4 sm:px-6 flex items-center gap-3 hover:bg-gray-50/50 transition-colors">
                <div className="w-9 h-9 rounded-xl bg-blue-50 flex items-center justify-center">
                  <Icon name="User" size={16} className="text-blue-600" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-gray-900 truncate">
                    {s.last_name} {s.first_name}
                  </p>
                  <p className="text-sm text-gray-500">{s.email}</p>
                </div>
                {s.grade && (
                  <span className="text-sm text-gray-500 bg-gray-100 px-2.5 py-1 rounded-lg">
                    {s.grade} кл.
                  </span>
                )}
              </div>
            ))}
          </div>
        )}
      </motion.div>

      {/* Olympiads List */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="bg-white rounded-2xl border border-gray-100 shadow-sm"
      >
        <div className="p-6 border-b border-gray-100">
          <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
            <Icon name="Trophy" size={20} className="text-primary" />
            Олимпиады ({olympiads.length})
          </h3>
        </div>

        {olympiads.length === 0 ? (
          <div className="p-12 text-center">
            <div className="w-16 h-16 rounded-2xl bg-gray-100 flex items-center justify-center mx-auto mb-4">
              <Icon name="Trophy" size={28} className="text-gray-400" />
            </div>
            <p className="text-gray-500 font-medium">Нет олимпиад</p>
            <p className="text-gray-400 text-sm mt-1">Создайте первую олимпиаду выше</p>
          </div>
        ) : (
          <div className="divide-y divide-gray-50">
            {olympiads.map((o) => (
              <div key={o.id} className="p-4 sm:px-6 hover:bg-gray-50/50 transition-colors">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium text-gray-900">{o.title}</p>
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
                  <div className="text-right text-sm text-gray-500">
                    {o.event_date}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </motion.div>
    </div>
  );
};

export default TeacherDashboard;