import styled from 'styled-components'
import { Layout, Button, message } from 'antd'
import { useStoreContext } from '@/store'
import { handleMagicLogout } from '@/magic-login'
import GrowSpacer from '@/components/GrowSpacer'

const { Header } = Layout

const StyledHeader = styled(Header)`
  display: flex;
  align-items: center;
  color: white;
  > h1 {
    color: white;
    margin: 0;
  }
  .welcome-hint {
    margin: 0;
    @media (max-width: 575.98px) {
      display: none;
    }
  }
`

function BaseHeader() {
  const { magicToken, userEmail, setLoginModalVisible } = useStoreContext()

  const isLogin = !!magicToken

  const handleLogout = async () => {
    try {
      await handleMagicLogout()
      message.success('Logout successful')
      setTimeout(() => {
        window.location.reload()
      }, 1000)
    } catch (err) {
      message.error('Logout failed')
      throw err
    }
  }

  return (
    <StyledHeader>
      <h1>Web3 Storage</h1>
      <GrowSpacer />
      {isLogin ? (
        <>
          <p className="welcome-hint">Hi, {userEmail}</p>
          <Button type="primary" onClick={() => handleLogout()}>
            Logout
          </Button>
        </>
      ) : (
        <Button type="primary" onClick={() => setLoginModalVisible(true)}>
          Sign In
        </Button>
      )}
    </StyledHeader>
  )
}

export default BaseHeader
