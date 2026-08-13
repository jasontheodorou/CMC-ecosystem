import { useCallback, useMemo } from 'react'
import {
  ReactFlow,
  ReactFlowProvider,
  Controls,
  useStore,
  type Edge,
  type Node,
} from '@xyflow/react'
import '@xyflow/react/dist/style.css'
import { RELATIONSHIPS, SERVICES } from './data'
import { ServiceNode } from './ServiceNode'

const nodeTypes = { service: ServiceNode }

// Layout centre — origin of the zoom-driven fan-out effect.
const LAYOUT_CENTER = (() => {
  const xs = SERVICES.map((s) => s.position.x)
  const ys = SERVICES.map((s) => s.position.y)
  return {
    x: (Math.min(...xs) + Math.max(...xs)) / 2,
    y: (Math.min(...ys) + Math.max(...ys)) / 2,
  }
})()

// How much extra outward spread per unit of zoom above 1.0. Gentle so nodes never
// spread far past the initial fit — just enough to feel like Google-Maps clustering easing.
const FAN_STRENGTH = 0.12

interface EcosystemMapProps {
  selectedId: string | null
  onSelect: (id: string | null) => void
}

function MapContent({ selectedId, onSelect }: EcosystemMapProps) {
  // Reactive to viewport zoom — nodes fan outward from LAYOUT_CENTER as you zoom in.
  const zoom = useStore((state) => state.transform[2])

  const nodes = useMemo<Node[]>(() => {
    const fan = Math.max(0, zoom - 1) * FAN_STRENGTH
    const scale = 1 + fan
    return SERVICES.map((service, index) => ({
      id: service.id,
      type: 'service',
      position: {
        x: LAYOUT_CENTER.x + (service.position.x - LAYOUT_CENTER.x) * scale,
        y: LAYOUT_CENTER.y + (service.position.y - LAYOUT_CENTER.y) * scale,
      },
      data: { service, index },
      selected: service.id === selectedId,
    }))
  }, [zoom, selectedId])

  const edges = useMemo<Edge[]>(
    () =>
      RELATIONSHIPS.map((relationship, index) => {
        const highlighted =
          selectedId !== null &&
          (relationship.source === selectedId || relationship.target === selectedId)
        return {
          id: `edge-${index}`,
          source: relationship.source,
          target: relationship.target,
          type: 'default',
          label: relationship.label,
          style: {
            stroke: highlighted ? '#4f46e5' : '#a8b8d6',
            strokeWidth: highlighted ? 2 : 1.5,
            opacity: selectedId && !highlighted ? 0.35 : 1,
            transition: 'stroke 0.2s, opacity 0.2s, stroke-width 0.2s',
          },
          labelStyle: {
            fill: highlighted ? '#4f46e5' : '#64748b',
            fontWeight: 500,
            fontSize: 11,
          },
          labelBgStyle: {
            fill: '#ffffff',
            fillOpacity: 0.95,
          },
          labelBgPadding: [8, 4] as [number, number],
          labelBgBorderRadius: 8,
        }
      }),
    [selectedId],
  )

  const handleNodeClick = useCallback(
    (_: unknown, node: Node) => onSelect(node.id),
    [onSelect],
  )

  return (
    <ReactFlow
      nodes={nodes}
      edges={edges}
      onNodeClick={handleNodeClick}
      onPaneClick={() => onSelect(null)}
      nodeTypes={nodeTypes}
      fitView
      fitViewOptions={{ padding: 0.15 }}
      minZoom={0.3}
      maxZoom={2}
      nodesDraggable={false}
      nodesConnectable={false}
      elementsSelectable
      proOptions={{ hideAttribution: true }}
    >
      <Controls showInteractive={false} position="bottom-right" />
    </ReactFlow>
  )
}

export function EcosystemMap(props: EcosystemMapProps) {
  return (
    <ReactFlowProvider>
      <MapContent {...props} />
    </ReactFlowProvider>
  )
}
