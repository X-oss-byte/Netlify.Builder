// Retrieve the expiration date when caching a file
export const getExpires = function (ttl) {
  if (!Number.isInteger(ttl) || ttl < 1) {
    return
  }

  return Date.now() + ttl * SECS_TO_MSECS
}

const SECS_TO_MSECS = 1e3

// Check if a file about to be restored is expired
export const checkExpires = function (expires) {
  return expires !== undefined && Date.now() > expires
}
