import React, { useMemo } from 'react'
import ReactFlow, { Background, Controls, MarkerType } from 'reactflow'
import 'reactflow/dist/style.css'
import { computeLayout } from './graphLayout'

export default function DFAGraph({ dfa }) {
  const { nodes, edges } = useMemo(() => {
    const positions = computeLayout(dfa.states, dfa.transitions, dfa.start)

    const graphNodes = dfa.states.map((id) => {
      const isAccepting = dfa.accepting.includes(id)
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
          background: isAccepting ? '#e6f4ea' : '#fff7ed',
          border: isAccepting ? '3px double #1a7a3c' : '2px solid #c2410c',
          fontWeight: 700,
          fontSize: 14,
        },
      }
    })

    const startPos = positions[dfa.start] || { x: 0, y: 0 }
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
        target: dfa.start,
        label: 'start',
        type: 'straight',
        markerEnd: { type: MarkerType.ArrowClosed },
        style: { stroke: '#c2410c' },
      },
    ]

    dfa.transitions.forEach((t, i) => {
      graphEdges.push({
        id: `dfa-e-${i}`,
        source: t.from,
        target: t.to,
        label: t.symbol,
        markerEnd: { type: MarkerType.ArrowClosed },
        style: { stroke: '#0f766e' },
        labelStyle: { fontWeight: 600 },
      })
    })

    return { nodes: graphNodes, edges: graphEdges }
  }, [dfa])

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
