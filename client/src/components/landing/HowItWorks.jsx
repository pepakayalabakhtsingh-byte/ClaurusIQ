import { motion } from 'framer-motion';
import { HOW_IT_WORKS_STEPS } from '../../constants';
import {
  HiOutlineLightningBolt,
  HiOutlineSearchCircle,
  HiOutlineDocumentText,
} from 'react-icons/hi';

const stepIcons = [HiOutlineSearchCircle, HiOutlineLightningBolt, HiOutlineDocumentText];

const HowItWorks = () => {
  return (
    <section
      id="how-it-works"
      className="py-20 lg:py-32 bg-slate-50/50 dark:bg-slate-900/30"
    >
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
            Process
          </span>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-slate-900 dark:text-white mt-3 mb-4">
            How It Works
          </h2>
          <p className="max-w-2xl mx-auto text-lg text-slate-600 dark:text-slate-400">
            Three simple steps to evidence-backed research.
          </p>
        </motion.div>

        {/* Steps */}
        <div className="relative max-w-4xl mx-auto">
          {/* Connecting Line */}
          <div className="hidden md:block absolute left-1/2 top-0 bottom-0 w-px bg-gradient-to-b from-primary-500/20 via-primary-500/40 to-accent-500/20" />

          <div className="space-y-12 md:space-y-0">
            {HOW_IT_WORKS_STEPS.map((step, index) => {
              const Icon = stepIcons[index];
              const isEven = index % 2 === 0;

              return (
                <motion.div
                  key={step.step}
                  initial={{ opacity: 0, x: isEven ? -30 : 30 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true, margin: '-100px' }}
                  transition={{ duration: 0.5, delay: index * 0.15 }}
                  className={`relative md:flex items-center ${
                    isEven ? '' : 'md:flex-row-reverse'
                  } md:py-8`}
                >
                  {/* Content */}
                  <div className={`flex-1 ${isEven ? 'md:pr-16 md:text-right' : 'md:pl-16'}`}>
                    <div
                      className={`bg-white dark:bg-slate-800/50 rounded-2xl p-6 lg:p-8 border border-slate-200 dark:border-slate-700/50 shadow-sm ${
                        isEven ? 'md:ml-auto' : ''
                      } max-w-md`}
                    >
                      <div className={`flex items-center gap-3 mb-4 ${isEven ? 'md:justify-end' : ''}`}>
                        <div className="w-10 h-10 rounded-xl bg-primary-500/10 flex items-center justify-center">
                          <Icon className="w-5 h-5 text-primary-500" />
                        </div>
                        <span className="text-xs font-bold text-primary-500 uppercase tracking-widest">
                          Step {step.step}
                        </span>
                      </div>
                      <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2">
                        {step.title}
                      </h3>
                      <p className="text-slate-600 dark:text-slate-400 text-sm leading-relaxed">
                        {step.description}
                      </p>
                    </div>
                  </div>

                  {/* Center Dot */}
                  <div className="hidden md:flex absolute left-1/2 -translate-x-1/2 w-10 h-10 rounded-full bg-gradient-to-br from-primary-500 to-accent-500 items-center justify-center shadow-lg shadow-primary-500/30 z-10">
                    <span className="text-white font-bold text-sm">{index + 1}</span>
                  </div>

                  {/* Spacer */}
                  <div className="flex-1 hidden md:block" />
                </motion.div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
};

export default HowItWorks;
