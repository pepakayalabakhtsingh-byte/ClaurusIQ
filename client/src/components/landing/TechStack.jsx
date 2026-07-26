import { motion } from 'framer-motion';
import {
  HiOutlineCode,
  HiOutlineDatabase,
  HiOutlineServer,
  HiOutlineCube,
  HiOutlineChip,
  HiOutlineGlobe,
} from 'react-icons/hi';

const techs = [
  { name: 'React', icon: HiOutlineCode, color: 'text-cyan-500' },
  { name: 'Node.js', icon: HiOutlineServer, color: 'text-emerald-500' },
  { name: 'MongoDB', icon: HiOutlineDatabase, color: 'text-green-500' },
  { name: 'AI Agents', icon: HiOutlineChip, color: 'text-violet-500' },
  { name: 'REST API', icon: HiOutlineGlobe, color: 'text-blue-500' },
  { name: 'Microservices', icon: HiOutlineCube, color: 'text-amber-500' },
];

const TechStack = () => {
  return (
    <section id="technology" className="py-20 lg:py-32">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-100px' }}
          transition={{ duration: 0.5 }}
          className="text-center mb-16"
        >
          <span className="text-sm font-semibold text-primary-500 uppercase tracking-wider">
            Technology
          </span>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-slate-900 dark:text-white mt-3 mb-4">
            Built with Modern Stack
          </h2>
          <p className="max-w-2xl mx-auto text-lg text-slate-600 dark:text-slate-400">
            Enterprise-grade technology designed for scale, security, and speed.
          </p>
        </motion.div>

        {/* Tech Grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 lg:gap-6">
          {techs.map((tech, index) => {
            const Icon = tech.icon;
            return (
              <motion.div
                key={tech.name}
                initial={{ opacity: 0, scale: 0.8 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: index * 0.08 }}
                whileHover={{ y: -4 }}
                className="flex flex-col items-center justify-center p-6 rounded-2xl bg-white dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700/50 hover:shadow-lg dark:hover:shadow-slate-900/50 transition-shadow"
              >
                <Icon className={`w-8 h-8 ${tech.color} mb-3`} />
                <span className="text-sm font-semibold text-slate-700 dark:text-slate-300">
                  {tech.name}
                </span>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default TechStack;
