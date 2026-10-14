const BUCKET = 'https://nerakolo.cn-nb1.rains3.com'
export const CODE_LENGTH = 6
const CODE_PATTERN = /^[a-z0-9]{6}$/

export function readCodeFromLocation() {
  const match = window.location.pathname.match(/^\/26hween\/([^/]+)\/?$/)
  if (!match) return ''

  const code = decodeURIComponent(match[1]).toLowerCase()
  return CODE_PATTERN.test(code) ? code : ''
}

export function normalizeCode(value) {
  return value.toLowerCase().replace(/[^a-z0-9]/g, '').slice(0, CODE_LENGTH)
}

export function isCodeComplete(value) {
  return CODE_PATTERN.test(value)
}

export async function fetchLetter(code) {
  if (!isCodeComplete(code)) return null

  // The bucket object is the single source of truth, in dev and in production alike.
  const source = `${BUCKET}/26hween/${code}.json`

  const response = await fetch(source, { cache: 'no-cache' })
  if (!response.ok) return null

  const payload = await response.json()
  if (typeof payload?.body !== 'string' || payload.body.trim() === '') return null

  return {
    to: typeof payload.to === 'string' ? payload.to.trim() : '',
    body: payload.body,
    date: typeof payload.date === 'string' ? payload.date.trim() : '',
  }
}

export function formatDate(value) {
  const match = value.match(/^(\d{4})-(\d{2})-(\d{2})$/)
  return match ? `${match[1]} 年 ${Number(match[2])} 月 ${Number(match[3])} 日` : value
}

export function toParagraphs(body) {
  return body.split(/\n\s*\n/).map((block) => block.trim()).filter(Boolean)
}
