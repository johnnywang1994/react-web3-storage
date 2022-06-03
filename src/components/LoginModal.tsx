import styled from 'styled-components'
import { PropsWithChildren } from 'react'
import { Modal, Input, message } from 'antd'
import { useStoreContext } from '@/store'
import { handleMagicLogin } from '@/magic-login'

const StyledLoginModal = styled(Modal)``

function LoginModal(props: PropsWithChildren<any>) {
  const {
    isLoginModalVisible,
    setToken,
    setHasToken,
    setMagicToken,
    setLoginModalVisible,
    setUserEmail
  } = useStoreContext()
  const [email, setEmail] = useState('')

  const handleLogin = async () => {
    try {
      const res = await handleMagicLogin(email)
      if (res) {
        const { userIdToken: idToken, userMetadata: metaData } = res
        setMagicToken(idToken)
        setUserEmail(metaData.email as string)
        setLoginModalVisible(false)
        message.success('Sign In successful')
        // If user already login, use the idToken to call client api
        setToken(idToken)
        setHasToken(true)
      }
    } catch (err) {
      message.error('Sign In failed')
      throw err
    }
  }

  return (
    <StyledLoginModal
      {...props}
      title="Login Modal"
      okText="Login"
      visible={isLoginModalVisible}
      closable={false}
      onOk={() => handleLogin()}
      onCancel={() => setLoginModalVisible(false)}
    >
      <label>Email</label>
      <Input
        placeholder="eye666@example.com"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />
    </StyledLoginModal>
  )
}

export default LoginModal
