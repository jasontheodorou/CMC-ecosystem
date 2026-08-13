import type { Service } from './data'

const HUB_BAND_Y = 180
const HUB_SPACING = 320
const HUB_START_X = 250

const SPOKE_RADIUS = 320
const SPOKE_SLOTS = 6

// Position for a brand-new main page — extends the horizontal band of existing hubs.
export function positionForNewHub(existingServices: Service[]): { x: number; y: number } {
  if (existingServices.length === 0) {
    return { x: HUB_START_X, y: HUB_BAND_Y }
  }
  const maxX = Math.max(...existingServices.map((s) => s.position.x))
  return { x: maxX + HUB_SPACING, y: HUB_BAND_Y }
}

// Position for a new connected page — placed in an arc below its hub.
// hubConnectionCount is used as the slot index so successive spokes fan out.
export function positionForNewSpoke(
  hub: Service,
  hubConnectionCount: number,
): { x: number; y: number } {
  const startAngle = Math.PI * 0.15 // just past east, downward
  const endAngle = Math.PI * 0.85 // just before west, downward
  const slot = hubConnectionCount % SPOKE_SLOTS
  const t = SPOKE_SLOTS === 1 ? 0.5 : slot / (SPOKE_SLOTS - 1)
  const angle = startAngle + t * (endAngle - startAngle)
  return {
    x: hub.position.x + Math.cos(angle) * SPOKE_RADIUS,
    y: hub.position.y + Math.sin(angle) * SPOKE_RADIUS,
  }
}
