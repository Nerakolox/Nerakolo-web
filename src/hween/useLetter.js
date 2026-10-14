import { useCallback, useEffect, useRef, useState } from 'react'
import { fetchLetter } from './letter'

export default function useLetter(initialCode = '') {
  const [letter, setLetter] = useState(null)
  const [settled, setSettled] = useState(() => !initialCode)
  const requestRef = useRef(0)

  const lookup = useCallback((code) => {
    const id = ++requestRef.current
    return fetchLetter(code)
      .catch(() => null)
      .then((result) => {
        if (id !== requestRef.current) return
        if (result) setLetter(result)
        setSettled(true)
      })
  }, [])

  useEffect(() => {
    if (initialCode) void lookup(initialCode)
    return () => { requestRef.current += 1 }
  }, [initialCode, lookup])

  // A rejected lookup leaves the stage untouched: no message, no state change.
  return { letter, lookup, settled }
}
