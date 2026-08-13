// Simple client-side password gate for the editor. Not real security — the
// password is bundled into the JS, so anyone determined can read it. The point
// is only to prevent casual/accidental edits (especially when the map is
// embedded in Miro). Change the default here.
const EDIT_PASSWORD = 'wereallin26!'

const SESSION_KEY = 'ecosystem-map:editor-auth'

export function isEditAuthenticated(): boolean {
  try {
    return sessionStorage.getItem(SESSION_KEY) === '1'
  } catch {
    return false
  }
}

// Prompts the user for the password. Returns true if the password matched
// (and stores a session flag so they don't get re-prompted this tab session).
export function authenticateEdit(): boolean {
  const entered = window.prompt('Editor password')
  if (entered === null) return false // cancelled
  if (entered === EDIT_PASSWORD) {
    try {
      sessionStorage.setItem(SESSION_KEY, '1')
    } catch {
      // sessionStorage unavailable — user will be prompted again next time.
    }
    return true
  }
  window.alert('Wrong password')
  return false
}
