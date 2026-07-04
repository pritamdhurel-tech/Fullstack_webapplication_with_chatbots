import { useState, useEffect } from 'react'

/**
 * useFetch — generic data fetching hook
 * @param {string} url - API endpoint e.g. '/api/solutions'
 * @returns {{ data, loading, error }}
 *
 * Expected backend response shape: { data: [...] }
 * On error the hook returns error message and empty data array.
 */
export default function useFetch(url) {
  const [data, setData]       = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError]     = useState(null)

  useEffect(() => {
    if (!url) return
    let cancelled = false

    setLoading(true)
    setError(null)

    fetch(url)
      .then(res => {
        if (!res.ok) throw new Error(`Server error: ${res.status}`)
        return res.json()
      })
      .then(json => {
        if (!cancelled) {
          // Accept { data: [...] } or a bare array
          setData(Array.isArray(json) ? json : json.data ?? [])
        }
      })
      .catch(err => {
        if (!cancelled) setError(err.message)
      })
      .finally(() => {
        if (!cancelled) setLoading(false)
      })

    return () => { cancelled = true }
  }, [url])

  return { data, loading, error }
}
