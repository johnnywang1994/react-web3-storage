import constate from 'constate'
import { KEY_API_TOKEN, isProd } from '@/constant'

function useStore() {
  const [isLoginModalVisible, setLoginModalVisible] = useState(false)
  const [hasToken, setHasToken] = useState(false)
  const [userEmail, setUserEmail] = useState('')
  // API Token
  const [token, setToken] = useState(
    isProd
      ? ''
      : sessionStorage.getItem(KEY_API_TOKEN) || ''
  )
  // Magic Login User IdToken
  // IdToken is used to authorize for official Http Delete API
  const [magicToken, setMagicToken] = useState('')

  const onChangeToken = (e: any) => {
    const newToken = e.target.value
    if (!isProd) {
      sessionStorage.setItem(KEY_API_TOKEN, newToken)
    }
    setToken(newToken)
  }

  return { isLoginModalVisible, hasToken, userEmail, token, magicToken, setHasToken, setToken, setMagicToken, onChangeToken, setUserEmail, setLoginModalVisible }
}

export const [StoreProvider, useStoreContext] = constate(useStore)
