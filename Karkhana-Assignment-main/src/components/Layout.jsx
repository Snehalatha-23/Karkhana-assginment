import { Box, Container, useColorModeValue } from '@chakra-ui/react';
import { Outlet } from 'react-router-dom';

const Layout = () => {
  const bgColor = useColorModeValue('gray.50', 'gray.900');

  return (
    <Box minH="100vh" w="100vw" bg={bgColor} overflowX="hidden">
      <Container 
        maxW="100%"
        minH="100vh"
        px={{ base: 4, md: 6, lg: 8 }}
        py={{ base: 4, md: 6, lg: 8 }}
      >
        <Outlet />
      </Container>
    </Box>
  );
};

export default Layout; 