// Reorder the in-memory collection; persistence remains an explicit sync action.
export function moveAddon(addons, index, offset) {
  const target = index + offset
  if (!Number.isInteger(index) || ![-1, 1].includes(offset) || index < 0 || index >= addons.length || target < 0 || target >= addons.length) return false
  const [addon] = addons.splice(index, 1)
  addons.splice(target, 0, addon)
  return true
}
