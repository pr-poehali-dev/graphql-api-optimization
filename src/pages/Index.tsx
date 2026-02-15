import Hero from "@/components/Hero"
import Icon from "@/components/ui/icon"
import { motion } from "framer-motion"

const advantages = [
  {
    icon: "Trophy",
    title: "Учёт достижений",
    description: "Все результаты олимпиад в одном месте — от школьного до всероссийского уровня",
  },
  {
    icon: "BarChart3",
    title: "Аналитика и статистика",
    description: "Наглядная статистика участий, побед и призовых мест для каждого ученика",
  },
  {
    icon: "Users",
    title: "Для учеников и учителей",
    description: "Удобные личные кабинеты с разными возможностями для каждой роли",
  },
  {
    icon: "Search",
    title: "Поиск олимпиад",
    description: "Находите олимпиады по предмету и уровню, получайте уведомления о новых",
  },
  {
    icon: "Shield",
    title: "Контроль данных",
    description: "Панель администратора для управления пользователями и подтверждения результатов",
  },
  {
    icon: "Smartphone",
    title: "Мобильная версия",
    description: "Платформа адаптирована под любые устройства — работайте откуда угодно",
  },
]

const steps = [
  {
    number: "01",
    title: "Регистрация",
    description: "Создайте аккаунт как ученик или учитель — это займёт меньше минуты",
  },
  {
    number: "02",
    title: "Добавление олимпиад",
    description: "Учитель создаёт олимпиады с указанием предмета, уровня и даты проведения",
  },
  {
    number: "03",
    title: "Фиксация результатов",
    description: "Результаты учеников добавляются после проведения — место, уровень, год",
  },
  {
    number: "04",
    title: "Анализ достижений",
    description: "Отслеживайте прогресс через личный кабинет — статистика обновляется автоматически",
  },
]

const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.1, duration: 0.5 },
  }),
}

const Index = () => {
  return (
    <main className="min-h-screen">
      <Hero />

      <section className="py-20 sm:py-28 px-4 sm:px-6 bg-white">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-14">
            <p className="text-primary font-medium text-sm mb-3 tracking-wide uppercase">Возможности</p>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-semibold text-gray-900 tracking-[-0.03em]">
              Всё для учёта олимпиад
            </h2>
            <p className="text-gray-500 mt-4 max-w-xl mx-auto text-lg">
              Инструменты, которые упрощают работу с олимпиадами для всей школы
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {advantages.map((item, i) => (
              <motion.div
                key={item.title}
                custom={i}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, amount: 0.3 }}
                variants={fadeUp}
                className="group p-6 rounded-2xl border border-gray-100 bg-gray-50/50 hover:bg-white hover:shadow-lg hover:shadow-primary/5 hover:border-primary/20 transition-all duration-300"
              >
                <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center mb-4 group-hover:bg-primary/15 transition-colors">
                  <Icon name={item.icon} size={24} className="text-primary" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">{item.title}</h3>
                <p className="text-gray-500 leading-relaxed">{item.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-20 sm:py-28 px-4 sm:px-6 bg-gradient-to-b from-gray-50 to-white">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-14">
            <p className="text-primary font-medium text-sm mb-3 tracking-wide uppercase">Процесс</p>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-semibold text-gray-900 tracking-[-0.03em]">
              Как это работает
            </h2>
            <p className="text-gray-500 mt-4 max-w-xl mx-auto text-lg">
              Четыре простых шага от регистрации до полной аналитики
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 lg:gap-8">
            {steps.map((step, i) => (
              <motion.div
                key={step.number}
                custom={i}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, amount: 0.3 }}
                variants={fadeUp}
                className="relative p-6 sm:p-8 rounded-2xl bg-white border border-gray-100 hover:shadow-lg hover:shadow-primary/5 transition-all duration-300"
              >
                <span className="text-5xl sm:text-6xl font-bold text-primary/10 absolute top-4 right-6">
                  {step.number}
                </span>
                <div className="relative">
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">{step.title}</h3>
                  <p className="text-gray-500 leading-relaxed">{step.description}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-16 px-4 sm:px-6 bg-white border-t border-gray-100">
        <div className="max-w-4xl mx-auto text-center">
          <div className="flex items-center justify-center gap-6 text-gray-400 text-sm">
            <div className="flex items-center gap-2">
              <Icon name="GraduationCap" size={18} className="text-primary/50" />
              <span>ОлимпТрекер</span>
            </div>
            <span>·</span>
            <span>Образовательная платформа</span>
            <span>·</span>
            <span>2025</span>
          </div>
        </div>
      </section>
    </main>
  )
}

export default Index
