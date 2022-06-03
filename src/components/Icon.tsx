import { PropsWithChildren } from 'react'
import styled from 'styled-components'

type Props = {
  size?: number | string
  style?: any
}

const StyledIcon = styled.span`
  font-size: ${(props: Props) => props.size || 20}px;
`

const Icon = ({ children, ...props }: PropsWithChildren<Props>) => (
  <StyledIcon className="anticon" {...props}>
    <span className="iconify" data-icon={children}></span>
  </StyledIcon>
)

export default Icon
