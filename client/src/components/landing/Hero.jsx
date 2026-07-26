import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { HiOutlineArrowRight, HiOutlinePlay, HiSparkles } from 'react-icons/hi';
import { APP_NAME } from '../../constants';

const Hero = () => {
  return (
    <section className="relative min-h-screen flex flex-col items-center justify-center overflow-hidden pt-24 pb-12">
      {/* Dynamic Animated Background */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none -z-10">
        <div className="absolute inset-0 bg-slate-50 dark:bg-[#090b14] transition-colors duration-500" />
        
        {/* Glow Orbs */}
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] rounded-full bg-indigo-500/20 dark:bg-indigo-600/20 blur-[120px] mix-blend-multiply dark:mix-blend-screen animate-blob" />
        <div className="absolute top-[20%] right-[-10%] w-[40%] h-[40%] rounded-full bg-cyan-400/20 dark:bg-cyan-500/20 blur-[120px] mix-blend-multiply dark:mix-blend-screen animate-blob animation-delay-2000" style={{ animationDelay: '2s' }} />
        <div className="absolute bottom-[-20%] left-[20%] w-[50%] h-[50%] rounded-full bg-violet-500/20 dark:bg-violet-600/20 blur-[120px] mix-blend-multiply dark:mix-blend-screen animate-blob animation-delay-4000" style={{ animationDelay: '4s' }} />
        
        {/* Modern Grid Pattern */}
        <div className="absolute inset-0 bg-[linear-gradient(rgba(15,23,42,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(15,23,42,0.03)_1px,transparent_1px)] dark:bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:40px_40px] [mask-image:radial-gradient(ellipse_80%_80%_at_50%_50%,#000_20%,transparent_100%)]" />
      </div>

      <div className="relative w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 z-10">
        <div className="text-center max-w-4xl mx-auto">
          {/* AI Badge */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            transition={{ duration: 0.5, ease: "easeOut" }}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/60 dark:bg-slate-800/60 border border-indigo-100 dark:border-slate-700 backdrop-blur-md shadow-sm mb-8 hover:shadow-md transition-shadow cursor-default"
          >
            <HiSparkles className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
            <span className="text-sm font-semibold bg-gradient-to-r from-indigo-600 to-violet-600 dark:from-indigo-400 dark:to-violet-400 bg-clip-text text-transparent">
              Introducing Autonomous AI Research
            </span>
          </motion.div>

          {/* Headline */}
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.1, ease: "easeOut" }}
            className="text-5xl sm:text-6xl lg:text-7xl font-extrabold tracking-tight text-slate-900 dark:text-white mb-6"
            style={{ lineHeight: 1.15 }}
          >
            Research Smarter. <br className="hidden sm:block" />
            <span className="relative inline-block mt-2 sm:mt-0">
              <span className="absolute -inset-1 bg-gradient-to-r from-indigo-500/20 to-cyan-500/20 dark:from-indigo-400/20 dark:to-cyan-400/20 blur-lg rounded-xl" />
              <span className="relative bg-gradient-to-r from-indigo-600 to-cyan-500 dark:from-indigo-400 dark:to-cyan-300 bg-clip-text text-transparent">
                Verify Faster.
              </span>
            </span>
          </motion.h1>

          {/* Subheadline */}
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.2, ease: "easeOut" }}
            className="text-lg sm:text-xl text-slate-600 dark:text-slate-300 mb-10 max-w-2xl mx-auto leading-relaxed"
          >
            {APP_NAME} deploys autonomous AI agents to cross-reference and verify information instantly. Stop searching. Start knowing with evidence-backed insights.
          </motion.p>

          {/* CTA Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.3, ease: "easeOut" }}
            className="flex flex-col sm:flex-row items-center justify-center gap-4 sm:gap-6"
          >
            <Link
              to="/register"
              className="relative group px-8 py-4 rounded-2xl text-base font-semibold text-white overflow-hidden shadow-lg shadow-indigo-500/25 hover:shadow-indigo-500/40 transition-all duration-300 hover:-translate-y-1"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-indigo-600 to-violet-600 transition-transform duration-300 group-hover:scale-105" />
              <div className="relative flex items-center gap-2">
                Get Started Free
                <HiOutlineArrowRight className="w-5 h-5 transition-transform group-hover:translate-x-1" />
              </div>
            </Link>
            <a
              href="#how-it-works"
              className="px-8 py-4 rounded-2xl text-base font-semibold text-slate-700 dark:text-slate-200 bg-white dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-700 backdrop-blur-sm transition-all duration-300 hover:-translate-y-1 flex items-center gap-2 shadow-sm"
            >
              <HiOutlinePlay className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
              Watch Demo
            </a>
          </motion.div>

          {/* Stats Bar */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.4, ease: "easeOut" }}
            className="mt-16 grid grid-cols-3 gap-4 sm:gap-8 max-w-3xl mx-auto p-6 rounded-3xl bg-white/40 dark:bg-slate-800/40 backdrop-blur-xl border border-white/50 dark:border-slate-700/50 shadow-sm"
          >
            {[
              { value: '99.2%', label: 'Accuracy Score' },
              { value: '<2s', label: 'Processing Time' },
              { value: '50M+', label: 'Verified Sources' },
            ].map((stat, i) => (
              <div key={i} className="flex flex-col items-center justify-center p-2">
                <span className="text-2xl sm:text-4xl font-extrabold bg-gradient-to-br from-slate-900 to-slate-600 dark:from-white dark:to-slate-400 bg-clip-text text-transparent">
                  {stat.value}
                </span>
                <span className="text-xs sm:text-sm font-medium text-slate-500 dark:text-slate-400 mt-2 uppercase tracking-wide">
                  {stat.label}
                </span>
              </div>
            ))}
          </motion.div>
        </div>

        {/* Floating UI Mockup */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, delay: 0.5, ease: "easeOut" }}
          className="mt-20 relative max-w-5xl mx-auto perspective-1000"
        >
          <div className="relative rounded-3xl overflow-hidden border border-white/40 dark:border-slate-700/60 shadow-2xl shadow-indigo-500/10 dark:shadow-indigo-900/20 bg-white/60 dark:bg-slate-900/60 backdrop-blur-xl transform rotate-x-2 hover:rotate-x-0 transition-transform duration-700">
            {/* Fake Browser Header */}
            <div className="flex items-center gap-3 px-6 py-4 bg-slate-100/50 dark:bg-slate-800/50 border-b border-white/40 dark:border-slate-700/50 backdrop-blur-md">
              <div className="flex gap-2">
                <div className="w-3 h-3 rounded-full bg-red-400/90 shadow-sm" />
                <div className="w-3 h-3 rounded-full bg-amber-400/90 shadow-sm" />
                <div className="w-3 h-3 rounded-full bg-emerald-400/90 shadow-sm" />
              </div>
              <div className="flex-1 flex justify-center">
                <div className="flex items-center gap-2 bg-white/60 dark:bg-slate-900/60 px-6 py-1.5 rounded-full text-xs font-medium text-slate-500 dark:text-slate-400 shadow-inner">
                  <span className="text-emerald-500">🔒</span> claurusiq.ai/dashboard
                </div>
              </div>
            </div>
            
            {/* Mockup Interface */}
            <div className="p-8 grid grid-cols-1 md:grid-cols-4 gap-6 min-h-[300px]">
              {/* Sidebar Mock */}
              <div className="hidden md:flex flex-col gap-4 border-r border-slate-200/50 dark:border-slate-700/50 pr-6">
                <div className="h-8 w-24 bg-indigo-500/20 dark:bg-indigo-500/30 rounded-lg mb-4" />
                {[1, 2, 3, 4].map(i => (
                  <div key={i} className="h-4 w-full bg-slate-200 dark:bg-slate-700 rounded-full opacity-60" />
                ))}
              </div>
              
              {/* Main Content Mock */}
              <div className="col-span-1 md:col-span-3 space-y-6">
                <div className="flex justify-between items-center">
                  <div className="h-8 w-1/3 bg-slate-200 dark:bg-slate-700 rounded-lg" />
                  <div className="h-8 w-10 bg-indigo-500 rounded-full" />
                </div>
                
                <div className="grid grid-cols-3 gap-4">
                  {[1, 2, 3].map(i => (
                    <div key={i} className="h-28 bg-white dark:bg-slate-800 rounded-2xl border border-slate-100 dark:border-slate-700 p-4 flex flex-col justify-between shadow-sm">
                      <div className="h-8 w-8 bg-indigo-50 dark:bg-indigo-500/20 rounded-full" />
                      <div className="space-y-2">
                        <div className="h-3 w-1/2 bg-slate-200 dark:bg-slate-600 rounded-full" />
                        <div className="h-2 w-3/4 bg-slate-100 dark:bg-slate-700 rounded-full" />
                      </div>
                    </div>
                  ))}
                </div>
                
                <div className="h-40 w-full bg-white dark:bg-slate-800 rounded-2xl border border-slate-100 dark:border-slate-700 shadow-sm p-5">
                  <div className="h-4 w-1/4 bg-slate-200 dark:bg-slate-700 rounded-full mb-6" />
                  <div className="space-y-3">
                    <div className="h-2 w-full bg-slate-100 dark:bg-slate-700/50 rounded-full" />
                    <div className="h-2 w-5/6 bg-slate-100 dark:bg-slate-700/50 rounded-full" />
                    <div className="h-2 w-4/6 bg-slate-100 dark:bg-slate-700/50 rounded-full" />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default Hero;
