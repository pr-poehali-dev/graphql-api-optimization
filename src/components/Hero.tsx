import { useNavigate } from "react-router-dom"
import { motion } from "framer-motion"
import { GodRays } from "@paper-design/shaders-react"
import Icon from "@/components/ui/icon"

export default function Hero() {
  const navigate = useNavigate()

  return (
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
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary/10 text-primary text-sm font-medium mb-2"
        >
          <Icon name="GraduationCap" size={16} />
          Образовательная платформа
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-semibold leading-[90%] tracking-[-0.03em] text-gray-900 max-w-3xl"
        >
          Учёт олимпиад и достижений
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="text-base sm:text-lg md:text-xl leading-[160%] text-gray-600 max-w-2xl px-4"
        >
          Единая платформа для учеников и учителей. Отслеживайте участие в олимпиадах, фиксируйте результаты и анализируйте достижения.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="flex flex-col sm:flex-row gap-3 mt-2"
        >
          <button
            onClick={() => navigate("/register")}
            className="h-12 px-6 sm:px-8 py-3 text-lg sm:text-xl font-medium text-white tracking-[-0.01em] rounded-full bg-primary hover:bg-primary/90 transition-colors"
          >
            Зарегистрироваться
          </button>

          <button
            onClick={() => navigate("/login")}
            className="h-12 px-6 sm:px-8 py-3 text-lg sm:text-xl font-medium text-primary tracking-[-0.01em] rounded-full border-2 border-primary/20 hover:bg-primary/5 transition-colors"
          >
            Войти
          </button>
        </motion.div>
      </div>
    </div>
  )
}
