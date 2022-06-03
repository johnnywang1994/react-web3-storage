export const getIpfsLink = (cid: string) => `https://dweb.link/ipfs/${cid}`

export function formatBytes(bytes: number, decimals = 2) {
  if (bytes === 0) return '0 Bytes'

  const k = 1024
  const dm = decimals < 0 ? 0 : decimals
  const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB']

  const i = Math.floor(Math.log(bytes) / Math.log(k))

  return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i]
}

export const vrange = (min: number, max: number, maxPx = 1920) => `calc(${min}px + (${max} - ${min}) * ((100vw - 300px) / (${maxPx} - 300)))`