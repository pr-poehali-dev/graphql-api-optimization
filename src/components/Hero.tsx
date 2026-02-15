import { useState, useEffect } from "react"
import { X } from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"
import { GodRays, MeshGradient } from "@paper-design/shaders-react"
import Icon from "@/components/ui/icon"

export default function Hero() {
  const [isExpanded, setIsExpanded] = useState(false)
  const [role, setRole] = useState<"student" | "teacher">("student")

  const handleExpand = () => {
    setIsExpanded(true)
  }

  const handleClose = () => {
    setIsExpanded(false)
  }

  useEffect(() => {
    if (isExpanded) {
      document.body.style.overflow = "hidden"
    } else {
      document.body.style.overflow = "unset"
    }
  }, [isExpanded])

  return (
    <>
      <div className="relative flex min-h-screen flex-col items-center justify-center px-4 sm:px-6 py-12 sm:py-20">
        <div className="absolute inset-0">
          <GodRays
            colorBack="#00000000"
            colors={["#3B82F620", "#8B5CF640", "#E0E7FF90", "#C4B5FD50"]}
            colorBloom="#FFFFFF"
            offsetX={0.85}
            offsetY={-1}
            intensity={1}
            spotty={0.45}
            midSize={10}
            midIntensity={0}
            density={0.12}
            bloom={0.15}
            speed={1}
            scale={1.6}
            frame={3332042.8159981333}
            style={{
              height: "100%",
              width: "100%",
              position: "absolute",
              top: 0,
              left: 0,
            }}
          />
        </div>

        <div className="relative z-10 flex flex-col items-center gap-4 sm:gap-6 text-center">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary/10 text-primary text-sm font-medium mb-2">
            <Icon name="GraduationCap" size={16} />
            Образовательная платформа
          </div>

          <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-semibold leading-[90%] tracking-[-0.03em] text-gray-900 max-w-3xl">
            Учёт олимпиад и достижений
          </h1>

          <p className="text-base sm:text-lg md:text-xl leading-[160%] text-gray-600 max-w-2xl px-4">
            Единая платформа для учеников и учителей. Отслеживайте участие в олимпиадах, фиксируйте результаты и анализируйте достижения.
          </p>

          <div className="flex flex-col sm:flex-row gap-3 mt-2">
            <AnimatePresence initial={false}>
              {!isExpanded && (
                <motion.div className="inline-block relative">
                  <motion.div
                    style={{ borderRadius: "100px" }}
                    layout
                    layoutId="cta-card"
                    className="absolute inset-0 bg-primary items-center justify-center transform-gpu will-change-transform"
                  ></motion.div>
                  <motion.button
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.2 }}
                    exit={{ opacity: 0, scale: 0.8 }}
                    layout={false}
                    onClick={handleExpand}
                    className="h-12 px-6 sm:px-8 py-3 text-lg sm:text-xl font-medium text-white tracking-[-0.01em] relative"
                  >
                    Зарегистрироваться
                  </motion.button>
                </motion.div>
              )}
            </AnimatePresence>

            <button className="h-12 px-6 sm:px-8 py-3 text-lg sm:text-xl font-medium text-primary tracking-[-0.01em] rounded-full border-2 border-primary/20 hover:bg-primary/5 transition-colors">
              Войти
            </button>
          </div>
        </div>
      </div>

      <AnimatePresence initial={false}>
        {isExpanded && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-2">
            <motion.div
              layoutId="cta-card"
              transition={{ duration: 0.3 }}
              style={{ borderRadius: "24px" }}
              layout
              className="relative flex h-full w-full overflow-y-auto bg-primary transform-gpu will-change-transform"
            >
              <motion.div
                initial={{ opacity: 0, scale: 2 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0 }}
                layout={false}
                transition={{ duration: 0.15, delay: 0.05 }}
                className="absolute h-full inset-0 overflow-hidden pointer-events-none"
                style={{ borderRadius: "24px" }}
              >
                <MeshGradient
                  speed={1}
                  colors={["#2563EB", "#1E40AF", "#7C3AED", "#4F46E5"]}
                  distortion={0.8}
                  swirl={0.1}
                  grainMixer={0}
                  grainOverlay={0}
                  className="inset-0 sticky top-0"
                  style={{ height: "100%", width: "100%" }}
                />
              </motion.div>
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.15, duration: 0.4 }}
                className="relative z-10 flex flex-col lg:flex-row h-full w-full max-w-[1100px] mx-auto items-center p-6 sm:p-10 lg:p-16 gap-8 lg:gap-16"
              >
                <div className="flex-1 flex flex-col justify-center space-y-3 w-full">
                  <h2 className="text-3xl sm:text-4xl lg:text-5xl font-semibold text-white leading-none tracking-[-0.03em]">
                    Присоединяйтесь к платформе
                  </h2>

                  <div className="space-y-4 sm:space-y-6 pt-4">
                    <div className="flex gap-3 sm:gap-4">
                      <div className="flex-shrink-0 w-10 h-10 sm:w-12 sm:h-12 rounded-lg bg-white/10 flex items-center justify-center">
                        <Icon name="Trophy" size={22} className="text-white" />
                      </div>
                      <div>
                        <p className="text-sm sm:text-base text-white leading-[150%]">
                          Фиксируйте все свои олимпиадные достижения в одном месте — от школьного до всероссийского уровня.
                        </p>
                      </div>
                    </div>
                    <div className="flex gap-3 sm:gap-4">
                      <div className="flex-shrink-0 w-10 h-10 sm:w-12 sm:h-12 rounded-lg bg-white/10 flex items-center justify-center">
                        <Icon name="BarChart3" size={22} className="text-white" />
                      </div>
                      <div>
                        <p className="text-sm sm:text-base text-white leading-[150%]">
                          Анализируйте статистику участий, побед и призовых мест — ваш прогресс всегда перед глазами.
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="pt-6 sm:pt-8 mt-6 sm:mt-8 border-t border-white/20">
                    <p className="text-lg sm:text-xl lg:text-2xl text-white leading-[150%] mb-4">
                      Платформа помогла нам систематизировать все олимпиады и мотивировать учеников на новые победы.
                    </p>
                    <div className="flex items-center gap-3 sm:gap-4">
                      <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-white/20 flex items-center justify-center">
                        <Icon name="User" size={20} className="text-white" />
                      </div>
                      <div>
                        <p className="text-base sm:text-lg lg:text-xl text-white">Елена Петрова</p>
                        <p className="text-sm sm:text-base text-white/70">Учитель математики, Лицей №42</p>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="flex-1 w-full">
                  <form className="space-y-4 sm:space-y-5">
                    <div className="flex gap-2 p-1 bg-white/10 rounded-lg mb-2">
                      <button
                        type="button"
                        onClick={() => setRole("student")}
                        className={`flex-1 py-2 rounded-md text-sm font-medium transition-all ${role === "student" ? "bg-white text-primary" : "text-white/70 hover:text-white"}`}
                      >
                        Ученик
                      </button>
                      <button
                        type="button"
                        onClick={() => setRole("teacher")}
                        className={`flex-1 py-2 rounded-md text-sm font-medium transition-all ${role === "teacher" ? "bg-white text-primary" : "text-white/70 hover:text-white"}`}
                      >
                        Учитель
                      </button>
                    </div>

                    <div className="flex flex-col sm:flex-row gap-4">
                      <div className="flex-1">
                        <label htmlFor="firstName" className="block text-[10px] font-mono font-normal text-white mb-2 tracking-[0.5px] uppercase">
                          ИМЯ *
                        </label>
                        <input
                          type="text"
                          id="firstName"
                          className="w-full px-4 py-2.5 rounded-lg bg-white/10 border-0 text-white placeholder:text-white/50 focus:outline-none focus:ring-2 focus:ring-white/20 transition-all text-sm h-10"
                        />
                      </div>
                      <div className="flex-1">
                        <label htmlFor="lastName" className="block text-[10px] font-mono font-normal text-white mb-2 tracking-[0.5px] uppercase">
                          ФАМИЛИЯ *
                        </label>
                        <input
                          type="text"
                          id="lastName"
                          className="w-full px-4 py-2.5 rounded-lg bg-white/10 border-0 text-white placeholder:text-white/50 focus:outline-none focus:ring-2 focus:ring-white/20 transition-all text-sm h-10"
                        />
                      </div>
                    </div>

                    {role === "student" ? (
                      <div>
                        <label htmlFor="grade" className="block text-[10px] font-mono font-normal text-white mb-2 tracking-[0.5px] uppercase">
                          КЛАСС *
                        </label>
                        <select
                          id="grade"
                          className="w-full px-4 py-2.5 rounded-lg bg-white/10 border-0 text-white focus:outline-none focus:ring-2 focus:ring-white/20 transition-all appearance-none cursor-pointer text-sm h-10"
                          style={{
                            backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='16' height='16' viewBox='0 0 24 24' fill='none' stroke='white' strokeWidth='2' strokeLinecap='round' strokeLinejoin='round'%3E%3Cpolyline points='6 9 12 15 18 9'%3E%3C/polyline%3E%3C/svg%3E")`,
                            backgroundRepeat: "no-repeat",
                            backgroundPosition: "right 0.75rem center",
                            backgroundSize: "1rem",
                          }}
                        >
                          {[5, 6, 7, 8, 9, 10, 11].map((g) => (
                            <option key={g} value={g}>{g} класс</option>
                          ))}
                        </select>
                      </div>
                    ) : (
                      <div>
                        <label htmlFor="subject" className="block text-[10px] font-mono font-normal text-white mb-2 tracking-[0.5px] uppercase">
                          ПРЕДМЕТ *
                        </label>
                        <input
                          type="text"
                          id="subject"
                          placeholder="Математика, Физика..."
                          className="w-full px-4 py-2.5 rounded-lg bg-white/10 border-0 text-white placeholder:text-white/50 focus:outline-none focus:ring-2 focus:ring-white/20 transition-all text-sm h-10"
                        />
                      </div>
                    )}

                    <div>
                      <label htmlFor="email" className="block text-[10px] font-mono font-normal text-white mb-2 tracking-[0.5px] uppercase">
                        EMAIL *
                      </label>
                      <input
                        type="email"
                        id="email"
                        className="w-full px-4 py-2.5 rounded-lg bg-white/10 border-0 text-white placeholder:text-white/50 focus:outline-none focus:ring-2 focus:ring-white/20 transition-all text-sm h-10"
                      />
                    </div>

                    <div>
                      <label htmlFor="password" className="block text-[10px] font-mono font-normal text-white mb-2 tracking-[0.5px] uppercase">
                        ПАРОЛЬ *
                      </label>
                      <input
                        type="password"
                        id="password"
                        className="w-full px-4 py-2.5 rounded-lg bg-white/10 border-0 text-white placeholder:text-white/50 focus:outline-none focus:ring-2 focus:ring-white/20 transition-all text-sm h-10"
                      />
                    </div>

                    <button
                      type="submit"
                      className="w-full px-8 py-2.5 rounded-full bg-white text-primary font-medium hover:bg-white/90 transition-colors tracking-[-0.03em] h-10"
                    >
                      Создать аккаунт
                    </button>
                  </form>
                </div>
              </motion.div>

              <motion.button
                onClick={handleClose}
                className="absolute right-6 top-6 z-10 flex h-10 w-10 items-center justify-center text-white bg-transparent transition-colors hover:bg-white/10 rounded-full"
                aria-label="Закрыть"
              >
                <X className="h-5 w-5" />
              </motion.button>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  )
}
