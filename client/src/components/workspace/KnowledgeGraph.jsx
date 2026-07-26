import React, { useEffect, useRef, useState, Suspense } from 'react';
const ForceGraph2D = React.lazy(() => import('react-force-graph-2d'));
import api from '../../services/api';

const KnowledgeGraph = () => {
  const containerRef = useRef(null);
  const [dimensions, setDimensions] = useState({ width: 800, height: 600 });
  
  // Hardcoded mock data for the visual interactive graph as requested in UI specs
  // In production, this would dynamically map claims -> evidence -> sources
  const graphData = {
    nodes: [
      { id: 'query', group: 0, label: 'Research Query', val: 30 },
      { id: 'claim1', group: 1, label: 'Claim: Market Growth', val: 20 },
      { id: 'claim2', group: 1, label: 'Claim: Security Risks', val: 20 },
      { id: 'source1', group: 2, label: 'Source: Academic Journal', val: 15 },
      { id: 'source2', group: 2, label: 'Source: Industry Report', val: 15 },
      { id: 'source3', group: 2, label: 'Source: News Article', val: 15 },
    ],
    links: [
      { source: 'query', target: 'claim1' },
      { source: 'query', target: 'claim2' },
      { source: 'claim1', target: 'source1' },
      { source: 'claim1', target: 'source2' },
      { source: 'claim2', target: 'source2' },
      { source: 'claim2', target: 'source3' }
    ]
  };

  useEffect(() => {
    if (containerRef.current) {
      setDimensions({
        width: containerRef.current.clientWidth,
        height: containerRef.current.clientHeight
      });
    }
  }, []);

  return (
    <div ref={containerRef} className="w-full h-[600px] bg-slate-900 rounded-3xl overflow-hidden border border-slate-800 shadow-2xl relative">
      <div className="absolute top-6 left-6 z-10 bg-black/50 backdrop-blur-md px-4 py-2 rounded-xl text-white font-medium text-sm">
        Interactive Knowledge Relationship Graph
      </div>
      <Suspense fallback={<div className="w-full h-full flex items-center justify-center text-slate-400">Loading interactive graph...</div>}>
        <ForceGraph2D
          width={dimensions.width}
          height={dimensions.height}
          graphData={graphData}
          nodeLabel="label"
          nodeColor={node => {
            if (node.group === 0) return '#6366f1';
            if (node.group === 1) return '#10b981';
            return '#3b82f6';
          }}
          linkColor={() => 'rgba(255,255,255,0.2)'}
          nodeRelSize={1}
          enableZoomInteraction={true}
          enablePanInteraction={true}
        />
      </Suspense>
    </div>
  );
};

export default KnowledgeGraph;
