import {
  HiOutlineSearch,
  HiOutlineShieldCheck,
  HiOutlineBookOpen,
  HiOutlineEye,
  HiOutlineDocumentReport,
  HiOutlineChartBar,
} from 'react-icons/hi';

export const APP_NAME = 'ClaurusIQ';
export const APP_TAGLINE = 'Research Smarter. Verify Faster. Trust the Evidence.';
export const APP_DESCRIPTION =
  'Autonomous Multi-Agent Research & Fact Verification System powered by advanced AI.';

export const NAV_LINKS = [
  { name: 'Features', href: '#features' },
  { name: 'How It Works', href: '#how-it-works' },
  { name: 'Technology', href: '#technology' },
  { name: 'Why ClaurusIQ', href: '#why-claurusiq' },
];

export const FEATURES = [
  {
    icon: HiOutlineSearch,
    title: 'Research Agent',
    description:
      'Autonomous AI agents that conduct deep research across multiple sources, synthesizing information into comprehensive insights.',
    color: 'from-blue-500 to-cyan-500',
  },
  {
    icon: HiOutlineShieldCheck,
    title: 'Fact Verification',
    description:
      'Multi-layered verification system that cross-references claims against trusted databases and authoritative sources.',
    color: 'from-emerald-500 to-teal-500',
  },
  {
    icon: HiOutlineBookOpen,
    title: 'Citation Engine',
    description:
      'Automatically generates properly formatted citations and tracks source provenance for every claim.',
    color: 'from-violet-500 to-purple-500',
  },
  {
    icon: HiOutlineEye,
    title: 'Bias Detection',
    description:
      'Advanced algorithms identify potential bias, misinformation patterns, and unreliable source indicators.',
    color: 'from-amber-500 to-orange-500',
  },
  {
    icon: HiOutlineDocumentReport,
    title: 'Report Generator',
    description:
      'Produces publication-ready reports with evidence summaries, confidence levels, and visual analytics.',
    color: 'from-rose-500 to-pink-500',
  },
  {
    icon: HiOutlineChartBar,
    title: 'Confidence Scoring',
    description:
      'Quantitative confidence metrics for every finding, helping you understand the reliability of each data point.',
    color: 'from-indigo-500 to-blue-500',
  },
];

export const HOW_IT_WORKS_STEPS = [
  {
    step: '01',
    title: 'Submit Your Query',
    description:
      'Enter a research topic, claim, or question. Our system understands natural language and complex queries.',
  },
  {
    step: '02',
    title: 'AI Agents Research',
    description:
      'Multiple specialized AI agents work in parallel — researching, cross-referencing, and verifying information.',
  },
  {
    step: '03',
    title: 'Get Verified Results',
    description:
      'Receive a comprehensive, evidence-backed report with confidence scores, citations, and bias analysis.',
  },
];

export const WHY_CLAURUSIQ = [
  {
    title: 'Multi-Agent Architecture',
    description: 'Specialized AI agents collaborate to deliver deeper, more reliable research.',
  },
  {
    title: 'Evidence-First Approach',
    description: 'Every claim is backed by traceable evidence and verifiable sources.',
  },
  {
    title: 'Enterprise Security',
    description: 'Bank-grade encryption, SOC 2 compliance ready, and complete data privacy.',
  },
  {
    title: 'Real-Time Processing',
    description: 'Get results in seconds, not hours. Our agents work in parallel at scale.',
  },
];

export const SIDEBAR_LINKS = [
  { name: 'Dashboard', path: '/dashboard', icon: 'HiOutlineViewGrid' },
  { name: 'Research', path: '/dashboard/research', icon: 'HiOutlineSearch' },
  { name: 'Reports', path: '/dashboard/reports', icon: 'HiOutlineDocumentReport' },
  { name: 'History', path: '/dashboard/history', icon: 'HiOutlineClock' },
  { name: 'Bookmarks', path: '/dashboard/bookmarks', icon: 'HiOutlineBookmark' },
  { name: 'Settings', path: '/dashboard/settings', icon: 'HiOutlineCog' },
];
