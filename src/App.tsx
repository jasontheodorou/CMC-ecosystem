import { useMemo, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { EcosystemMap } from './EcosystemMap'
import { DEPTS, RELATIONSHIPS, SERVICES, type Service } from './data'
import { Preview } from './Preview'

export default function App() {
  const [selectedId, setSelectedId] = useState<string | null>('ptax')

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
    <div className="app">
      <div className="title-chip">
        <span className="title-dot" />
        <div>
          <div className="title-primary">GOV.UK Ecosystem</div>
          <div className="title-secondary">Click a node, or drag to reposition</div>
        </div>
      </div>
      <div className="app-body">
        <div className="map-region">
          <div className="map-canvas">
            <EcosystemMap selectedId={selectedId} onSelect={setSelectedId} />
          </div>
        </div>
        <aside className="side-panel">
          <AnimatePresence mode="wait">
            {selected ? (
              <motion.div
                key={selected.id}
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 6 }}
                transition={{ duration: 0.2, ease: [0.2, 0.7, 0.2, 1] }}
                className="detail-card"
                style={{
                  ['--dept-color' as string]: DEPTS[selected.dept].color,
                  ['--dept-soft' as string]: DEPTS[selected.dept].soft,
                }}
              >
                <Preview url={selected.url} className="detail-preview" />
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
              </motion.div>
            ) : (
              <motion.div
                key="empty"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.15 }}
                className="side-panel-empty"
              >
                Click any service to see what it does and where it connects.
              </motion.div>
            )}
          </AnimatePresence>
        </aside>
      </div>
    </div>
  )
}
