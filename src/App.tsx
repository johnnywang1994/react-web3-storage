import styled from 'styled-components'
import { message, Layout, Tabs } from 'antd'
import { useMount } from 'ahooks'
import { useStoreContext } from '@/store'
import logo from '@/assets/logo.svg'
import BaseHeader from '@/components/BaseHeader'
import TokenBlock from '@/components/TokenBlock'
import ListFiles from '@/components/ListFiles'
import StoreFiles from '@/components/StoreFiles'
import RetrieveFiles from '@/components/RetrieveFiles'
import LoginModal from '@/components/LoginModal'
import { checkMagicLogin } from '@/magic-login'
import { vrange } from '@/utils'

const { Content } = Layout
const { TabPane } = Tabs

// Dynamic styles
// https://emotion.sh/docs/styled#composing-dynamic-styles
const AppContainer = styled(Layout)`
  min-height: 100vh;
  text-align: center;

  .App-Logo {
    height: 40vmin;
    pointer-events: none;
    @media (prefers-reduced-motion: no-preference) {
      animation: App-logo-spin infinite 20s linear;
    }
  }

  .App-Logo-header {
    font-size: ${vrange(12, 26)};
    padding: 40px auto;
  }

  @keyframes App-logo-spin {
    from {
      transform: rotate(0deg);
    }
    to {
      transform: rotate(360deg);
    }
  }
`

const StyledTabs = styled(Tabs)`
  max-width: ${(props) => props.theme.layout.width}px;
  margin: auto;
`

function App() {
  const { hasToken, setToken, setUserEmail, setHasToken, setMagicToken } =
    useStoreContext()

  // check login idToken on App mount
  useMount(async () => {
    const res = await checkMagicLogin()
    if (res) {
      const { userIdToken: idToken, userMetadata: metaData } = res
      message.success('Login successful')
      setMagicToken(idToken)
      setUserEmail(metaData.email as string)
      // If user already login, use the idToken to call client api
      setToken(idToken)
      setHasToken(true)
    }
  })

  return (
    <AppContainer>
      <BaseHeader />

      <Content style={{ padding: '0 15px' }}>
        <div className="App-Logo-header">
          <img src={logo} className="App-Logo" alt="logo" />
        </div>
        {hasToken ? (
          <StyledTabs defaultActiveKey="1">
            <TabPane tab="Dashboard" key="feature-1">
              <ListFiles />
            </TabPane>
            <TabPane tab="Upload" key="feature-2">
              <StoreFiles />
            </TabPane>
            <TabPane tab="Retrieve" key="feature-3">
              <RetrieveFiles />
            </TabPane>
          </StyledTabs>
        ) : (
          <TokenBlock />
        )}
      </Content>

      <LoginModal />
    </AppContainer>
  )
}

export default App
