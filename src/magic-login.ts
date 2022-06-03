import { Magic } from 'magic-sdk'

// Construct with an API key:
const magic = new Magic(process.env.MAGIC_TOKEN as string)

/* Get user id token */
// https://magic.link/docs/api-reference/client-side-sdks/flutter#getidtoken
const getUserInfo = async () => {
  const userIdToken = await magic.user.getIdToken()
  const userMetadata = await magic.user.getMetadata()
  return {
    userIdToken,
    userMetadata
  }
}

// log in a user by their email
// Tutorial Demo: https://go.magic.link/hello-world-code-with-redirect
export async function checkMagicLogin() {
  if (window.location.pathname === '/callback') {
    try {
      /* Complete the "authentication callback" */
      await magic.auth.loginWithCredential()

      return getUserInfo()
    } catch(err) {
      /* In the event of an error, we'll go back to the login page */
      window.location.href = window.location.origin
    }
  } else {
    const isLoggedIn = await magic.user.isLoggedIn()
    if (isLoggedIn) {
      return getUserInfo()
    } else {
      return false
    }
  }
}

export const handleMagicLogin = async (email: string) => {
  const redirectURI = `${window.location.origin}/callback`; // 👈 This will be our callback URI
  if (email) {
    /* One-liner login 🤯 */
    await magic.auth.loginWithMagicLink({ email, redirectURI }) // 👈 Notice the additional parameter!
    const idToken = await checkMagicLogin()
    return idToken
  }
  return false
}

export const handleMagicLogout = async () => {
  await magic.user.logout();
}
