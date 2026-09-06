export default async function copyText(text) {
  try {
    await navigator.clipboard.writeText(text)
    return
  } catch {
    // Older browsers and HTTP pages may only support selection-based copying.
    const activeElement = document.activeElement
    const selection = window.getSelection()
    const ranges = selection ? Array.from({ length: selection.rangeCount }, (_, index) => selection.getRangeAt(index).cloneRange()) : []
    const field = document.createElement('textarea')
    field.value = text
    field.readOnly = true
    field.style.cssText = 'position:fixed;inset:0 auto auto 0;width:1px;height:1px;opacity:0;font-size:16px;pointer-events:none'
    document.body.append(field)
    try {
      field.focus({ preventScroll: true })
      field.select()
      if (!document.execCommand('copy')) throw new Error('Copy failed')
    } finally {
      field.remove()
      activeElement?.focus({ preventScroll: true })
      if (selection) {
        selection.removeAllRanges()
        ranges.forEach((range) => selection.addRange(range))
      }
    }
  }
}
