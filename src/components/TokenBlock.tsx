import styled from 'styled-components'
import { Input, Button } from 'antd'
import { useStoreContext } from '@/store'

const StyledTokenBlock = styled.div`
  text-align: left;
  max-width: ${props => props.theme.layout.width}px;
  margin: auto;
  p {
    font-size: 12px;
    color: red;
  }
`

function TokenBlock() {
  const { token, onChangeToken, setHasToken } = useStoreContext()

  return (
    <StyledTokenBlock>
      <label>
        API Token (
        <a
          href="https://web3.storage/docs/how-tos/generate-api-token/"
          target="_blank"
        >
          Create Here
        </a>
        )
      </label>
      <Input
        value={token}
        onChange={(e) => onChangeToken(e)}
      />
      <p>Your API Token won't be stored anywhere, only used in runtime</p>
      <Button
        type="primary"
        disabled={!token.length}
        onClick={() => setHasToken(true)}
      >Confirm</Button>
    </StyledTokenBlock>
  )
}

export default TokenBlock
