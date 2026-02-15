import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { motion } from "framer-motion";
import { useAuth } from "@/lib/auth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import Icon from "@/components/ui/icon";

const Register = () => {
  const navigate = useNavigate();
  const { register } = useAuth();
  const [role, setRole] = useState<"student" | "teacher">("student");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [grade, setGrade] = useState("9");
  const [subject, setSubject] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      await register({
        firstName,
        lastName,
        email,
        password,
        role,
        ...(role === "student" ? { grade: parseInt(grade) } : { subject }),
      });
      navigate("/dashboard");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Ошибка регистрации");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-white to-purple-50 px-4 py-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md"
      >
        <div className="text-center mb-8">
          <Link to="/" className="inline-flex items-center gap-2 text-primary hover:opacity-80 transition-opacity">
            <Icon name="GraduationCap" size={32} />
            <span className="text-2xl font-bold">ОлимпТрекер</span>
          </Link>
        </div>

        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8">
          <div className="text-center mb-6">
            <h1 className="text-2xl font-semibold text-gray-900">Регистрация</h1>
            <p className="text-gray-500 mt-1">Создайте аккаунт на платформе</p>
          </div>

          {/* Role toggle */}
          <div className="flex rounded-xl bg-gray-100 p-1 mb-6">
            <button
              type="button"
              onClick={() => setRole("student")}
              className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-lg text-sm font-medium transition-all ${
                role === "student"
                  ? "bg-white text-primary shadow-sm"
                  : "text-gray-500 hover:text-gray-700"
              }`}
            >
              <Icon name="GraduationCap" size={16} />
              Ученик
            </button>
            <button
              type="button"
              onClick={() => setRole("teacher")}
              className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-lg text-sm font-medium transition-all ${
                role === "teacher"
                  ? "bg-white text-primary shadow-sm"
                  : "text-gray-500 hover:text-gray-700"
              }`}
            >
              <Icon name="BookOpen" size={16} />
              Учитель
            </button>
          </div>

          {error && (
            <div className="mb-4 p-3 rounded-xl bg-red-50 border border-red-100 text-red-600 text-sm flex items-center gap-2">
              <Icon name="AlertCircle" size={16} />
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-2">
                <Label htmlFor="firstName">Имя</Label>
                <Input
                  id="firstName"
                  placeholder="Иван"
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                  required
                  className="rounded-xl"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="lastName">Фамилия</Label>
                <Input
                  id="lastName"
                  placeholder="Иванов"
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
                  required
                  className="rounded-xl"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="reg-email">Email</Label>
              <Input
                id="reg-email"
                type="email"
                placeholder="your@email.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="rounded-xl"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="reg-password">Пароль</Label>
              <Input
                id="reg-password"
                type="password"
                placeholder="Минимум 6 символов"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                minLength={6}
                className="rounded-xl"
              />
            </div>

            {role === "student" && (
              <div className="space-y-2">
                <Label>Класс</Label>
                <Select value={grade} onValueChange={setGrade}>
                  <SelectTrigger className="rounded-xl">
                    <SelectValue placeholder="Выберите класс" />
                  </SelectTrigger>
                  <SelectContent>
                    {[5, 6, 7, 8, 9, 10, 11].map((g) => (
                      <SelectItem key={g} value={String(g)}>
                        {g} класс
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            )}

            {role === "teacher" && (
              <div className="space-y-2">
                <Label htmlFor="subject">Предмет</Label>
                <Input
                  id="subject"
                  placeholder="Математика"
                  value={subject}
                  onChange={(e) => setSubject(e.target.value)}
                  required
                  className="rounded-xl"
                />
              </div>
            )}

            <Button
              type="submit"
              className="w-full rounded-xl h-11"
              disabled={loading}
            >
              {loading ? (
                <span className="flex items-center gap-2">
                  <Icon name="Loader2" size={18} className="animate-spin" />
                  Регистрация...
                </span>
              ) : (
                "Зарегистрироваться"
              )}
            </Button>
          </form>
        </div>

        <p className="text-center mt-6 text-gray-500">
          Уже есть аккаунт?{" "}
          <Link to="/login" className="text-primary font-medium hover:underline">
            Войти
          </Link>
        </p>
      </motion.div>
    </div>
  );
};

export default Register;
