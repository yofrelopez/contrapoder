export function getAbsoluteUrl(path: string) {
  const base =
    typeof window === 'undefined'
      ? process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'
      : window.location.origin

  return `${base}${path}`
}