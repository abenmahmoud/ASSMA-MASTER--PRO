const getBaseUrl = () =>
  typeof window !== 'undefined'
    ? (import.meta.env.VITE_API_BASE_URL as string) || 'http://localhost:8080'
    : 'http://localhost:8080'

export async function apiRequest<T>(
  endpoint: string,
  options?: RequestInit,
): Promise<T> {
  const baseUrl = getBaseUrl()
  const res = await fetch(`${baseUrl}${endpoint}`, {
    headers: { 'Content-Type': 'application/json', ...options?.headers },
    ...options,
  })
  if (!res.ok) throw new Error(`API error: ${res.status}`)
  return res.json() as Promise<T>
}
