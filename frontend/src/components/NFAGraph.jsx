import React, { useMemo } from 'react'
import ReactFlow, { Background, Controls, MarkerType } from 'reactflow'
import 'reactflow/dist/style.css'
import { computeLayout } from './graphLayout'

export default function NFAGraph({ nfa }) {
  const { nodes, edges } = useMemo(() => {
    const positions = computeLayout(nfa.states, nfa.transitions, nfa.start)

    const graphNodes = nfa.states.map((id) => {
      const isAccept = id === nfa.accept
      return {
        id,
        position: positions[id],
        data: { label: id },
        style: {
          width: 54,
          height: 54,
          borderRadius: '50%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          background: isAccept ? '#e6f4ea' : '#eef2ff',
          border: isAccept ? '3px double #1a7a3c' : '2px solid #4338ca',
          fontWeight: 600,
          fontSize: 13,
        },
      }
    })

    // Invisible marker node + edge so the graph shows a "start" arrow
    const startPos = positions[nfa.start] || { x: 0, y: 0 }
    graphNodes.push({
      id: '__start__',
      position: { x: startPos.x - 90, y: startPos.y + 22 },
      data: { label: '' },
      style: { width: 1, height: 1, opacity: 0 },
      draggable: false,
      selectable: false,
    })

    const graphEdges = [
      {
        id: 'start-edge',
        source: '__start__',
        target: nfa.start,
        label: 'start',
        type: 'straight',
        markerEnd: { type: MarkerType.ArrowClosed },
        style: { stroke: '#4338ca' },
      },
    ]

    nfa.transitions.forEach((t, i) => {
      const isEpsilon = t.symbol === 'ε'
      graphEdges.push({
        id: `nfa-e-${i}`,
        source: t.from,
        target: t.to,
        label: t.symbol,
        markerEnd: { type: MarkerType.ArrowClosed },
        animated: isEpsilon,
        style: { stroke: isEpsilon ? '#9333ea' : '#0f766e' },
        labelStyle: { fontWeight: 600 },
      })
    })

    return { nodes: graphNodes, edges: graphEdges }
  }, [nfa])

  return (
    <div className="graph-canvas">
      <ReactFlow
        nodes={nodes}
        edges={edges}
        fitView
        proOptions={{ hideAttribution: true }}
        nodesDraggable
        minZoom={0.2}
        maxZoom={2.5}
      >
        <Background gap={20} />
        <Controls />
      </ReactFlow>
    </div>
  )
}
