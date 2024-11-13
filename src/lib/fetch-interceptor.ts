if (typeof window !== 'undefined') {
  const originalFetch = window.fetch
  window.fetch = function(...args) {
    const url = args[0].toString()
    console.log(`Fetch request to: ${url}`)
    console.trace('Fetch called from:')
    return originalFetch.apply(this, args)
  }
} 