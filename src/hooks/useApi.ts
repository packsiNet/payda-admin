import { useState, useEffect, useCallback, useRef } from 'react'

export interface ApiState<T> {
  data: T | null
  loading: boolean
  error: string | null
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function useApi<T>(fetchFn: (() => Promise<T>) | null, deps: any[] = []) {
  const [state, setState] = useState<ApiState<T>>({ data: null, loading: !!fetchFn, error: null })
  const ref = useRef(fetchFn)
  ref.current = fetchFn

  const run = useCallback(async () => {
    if (!ref.current) return
    setState(s => ({ ...s, loading: true, error: null }))
    try {
      const data = await ref.current()
      setState({ data, loading: false, error: null })
    } catch (err: unknown) {
      const e = err as Record<string, string>
      setState(s => ({ ...s, loading: false, error: e?.detail ?? e?.title ?? e?.message ?? 'Request failed' }))
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps)

  useEffect(() => { run() }, [run])

  return { ...state, refetch: run }
}
