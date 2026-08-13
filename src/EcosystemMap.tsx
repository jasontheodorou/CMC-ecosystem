import { useCallback, useMemo, useState } from 'react'
import {
  ReactFlow,
  Controls,
  type Edge,
  type Node,
} from '@xyflow/react'
import { AnimatePresence, motion } from 'framer-motion'
import '@xyflow/react/dist/style.css'
import { DEPTS, RELATIONSHIPS, SERVICES, type Service } from './data'
import { ServiceNode } from './ServiceNode'

const nodeTypes = { service: ServiceNode }

export function EcosystemMap() {
  const [selectedId, setSelectedId] = useState<string | null>('ptax')

  const nodes = useMemo<Node[]>(
    () =>
      SERVICES.map((service, index) => ({
        id: service.id,
        type: 'service',
        position: service.position,
        data: { service, index },
        selected: service.id === selectedId,
      })),
    [selectedId],
  )

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

  const handleNodeClick = useCallback((_: unknown, node: Node) => {
    setSelectedId(node.id)
  }, [])

  const selected = SERVICES.find((s) => s.id === selectedId) ?? null

  const related = useMemo<Service[]>(() => {
    if (!selected) return []
    const ids = RELATIONSHIPS.filter(
      (r) => r.source === selected.id || r.target === selected.id,
    ).map((r) => (r.source === selected.id ? r.target : r.source))
    return ids
      .map((id) => SERVICES.find((s) => s.id === id))
      .filter((s): s is Service => Boolean(s))
  }, [selected])

  return (
    <div className="ecosystem-map">
      <ReactFlow
        nodes={nodes}
        edges={edges}
        nodeTypes={nodeTypes}
        onNodeClick={handleNodeClick}
        onPaneClick={() => setSelectedId(null)}
        fitView
        fitViewOptions={{ padding: 0.15 }}
        minZoom={0.3}
        maxZoom={1.6}
        nodesDraggable={false}
        nodesConnectable={false}
        elementsSelectable
      >
        <Controls showInteractive={false} position="bottom-right" />
      </ReactFlow>

      <AnimatePresence mode="wait">
        {selected && (
          <motion.aside
            key={selected.id}
            className="detail-panel"
            style={{
              ['--dept-color' as string]: DEPTS[selected.dept].color,
              ['--dept-soft' as string]: DEPTS[selected.dept].soft,
            }}
            initial={{ opacity: 0, y: 8, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 8, scale: 0.98 }}
            transition={{ duration: 0.2, ease: [0.2, 0.7, 0.2, 1] }}
          >
            <div className="detail-dept">{DEPTS[selected.dept].label}</div>
            <h2 className="detail-title">{selected.name}</h2>
            <p className="detail-summary">{selected.summary}</p>
            <a
              className="detail-link"
              href={selected.url}
              target="_blank"
              rel="noreferrer"
            >
              Open on GOV.UK
            </a>
            {related.length > 0 && (
              <div className="detail-related">
                <div className="detail-related-heading">Connects to</div>
                <ul>
                  {related.map((r) => (
                    <li key={r.id}>
                      <button
                        type="button"
                        className="related-link"
                        onClick={() => setSelectedId(r.id)}
                      >
                        {r.name}
                      </button>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </motion.aside>
        )}
      </AnimatePresence>
    </div>
  )
}
