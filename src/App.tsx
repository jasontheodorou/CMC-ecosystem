import { EcosystemMap } from './EcosystemMap'

export default function App() {
  return (
    <div className="app">
      <div className="title-chip">
        <span className="title-dot" />
        <div>
          <div className="title-primary">GOV.UK Ecosystem</div>
          <div className="title-secondary">Click a node to explore</div>
        </div>
      </div>
      <EcosystemMap />
    </div>
  )
}
