import { PropsWithChildren } from 'react'
import { ThemeProvider } from 'styled-components'

const theme = {
  colors: {
    mainbg: '#282c34'
  },
  layout: {
    width: 800
  }
}

function StyledThemeProvider({ children }: PropsWithChildren<unknown>) {
  return <ThemeProvider theme={theme}>{children}</ThemeProvider>
}

export default StyledThemeProvider
