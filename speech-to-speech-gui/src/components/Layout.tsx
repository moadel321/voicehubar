import { Box, Container } from '@chakra-ui/react'
import { ReactNode } from 'react'

interface LayoutProps {
  children: ReactNode
}

const Layout = ({ children }: LayoutProps) => {
  return (
    <Box minHeight="100vh" bg="gray.900">
      <Container maxW="container.md" py={8}>
        {children}
      </Container>
    </Box>
  )
}

export default Layout