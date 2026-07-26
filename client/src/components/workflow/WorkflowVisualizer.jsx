import { useEffect, useRef, useState } from 'react';
import AgentCard from './AgentCard';

const WorkflowVisualizer = ({ agents, selectedAgentIndex, onSelectAgent }) => {
  const containerRef = useRef(null);
  const [lines, setLines] = useState([]);

  // Calculate lines between cards
  useEffect(() => {
    if (!containerRef.current || !agents || agents.length === 0) return;

    const updateLines = () => {
      const newLines = [];
      const cards = containerRef.current.querySelectorAll('.agent-card-wrapper');
      
      for (let i = 0; i < cards.length - 1; i++) {
        const rect1 = cards[i].getBoundingClientRect();
        const rect2 = cards[i + 1].getBoundingClientRect();
        const containerRect = containerRef.current.getBoundingClientRect();

        const x1 = rect1.left + rect1.width / 2 - containerRect.left;
        const y1 = rect1.bottom - containerRect.top;
        const x2 = rect2.left + rect2.width / 2 - containerRect.left;
        const y2 = rect2.top - containerRect.top;

        newLines.push({ id: i, x1, y1, x2, y2, active: agents[i + 1].status !== 'idle' && agents[i + 1].status !== 'queued' });
      }
      setLines(newLines);
    };

    updateLines();
    window.addEventListener('resize', updateLines);
    return () => window.removeEventListener('resize', updateLines);
  }, [agents]);

  if (!agents || agents.length === 0) return null;

  return (
    <div className="relative w-full max-w-2xl mx-auto py-8" ref={containerRef}>
      {/* SVG Connecting Lines */}
      <svg className="absolute inset-0 w-full h-full pointer-events-none z-0" style={{ minHeight: '100%' }}>
        {lines.map(line => (
          <g key={line.id}>
            {/* Background line */}
            <line 
              x1={line.x1} y1={line.y1} x2={line.x2} y2={line.y2} 
              stroke="currentColor" 
              strokeWidth="2" 
              className="text-slate-200 dark:text-slate-800" 
            />
            {/* Animated active line */}
            {line.active && (
              <line 
                x1={line.x1} y1={line.y1} x2={line.x2} y2={line.y2} 
                stroke="url(#gradient)" 
                strokeWidth="2" 
                className="animate-pulse"
                strokeDasharray="4 4"
              >
                <animate attributeName="stroke-dashoffset" values="8;0" dur="1s" repeatCount="indefinite" />
              </line>
            )}
          </g>
        ))}
        <defs>
          <linearGradient id="gradient" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#3b82f6" />
            <stop offset="100%" stopColor="#8b5cf6" />
          </linearGradient>
        </defs>
      </svg>

      {/* Agent Cards */}
      <div className="relative z-10 flex flex-col gap-12">
        {agents.map((agent, index) => (
          <div key={index} className="agent-card-wrapper w-full max-w-sm mx-auto">
            <AgentCard 
              agent={agent} 
              index={index} 
              isActive={selectedAgentIndex === index}
              onClick={() => onSelectAgent(index)}
            />
          </div>
        ))}
      </div>
    </div>
  );
};

export default WorkflowVisualizer;
