import { Web3Storage } from 'web3.storage'
import axios from 'axios'

export function makeStorageClient(token: string) {
  return new Web3Storage({ token })
}

// Delete by Cid
// DELETE /user/uploads/{cid}
// https://github.com/web3-storage/web3.storage/pull/81
export function deleteById(cid: string, idToken: string) {
  return axios.delete(`https://api.web3.storage/user/uploads/${cid}`, {
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/jsoncharset=UTF-8',
      // idToken get from Magic Login `getIdToken` method
      authorization: `Bearer ${idToken}`
    }
  })
}

export async function storeWithProgress(
  files: File[],
  {
    token = '',
    onProgress = (pct: number) => {},
    onComplete = (cid: string) => {}
  } = {}
) {
  if (!token) return

  const totalSize = files
    .map((f: File) => f.size)
    .reduce((a: number, b: number) => a + b, 0)
  let uploaded = 0

  const onStoredChunk = (size: number) => {
    uploaded += size
    const pct = (uploaded / totalSize) * 100
    onProgress(pct)
  }

  // makeStorageClient returns an authorized Web3.Storage client instance
  const client = makeStorageClient(token)

  // client.put will invoke our callbacks during the upload
  // and return the root cid when the upload completes
  return client.put(files, {
    onRootCidReady: onComplete,
    onStoredChunk
  })
}
