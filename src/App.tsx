import { ConnectButton } from "@mysten/dapp-kit";
import { Box, Container, Flex, Heading } from "@radix-ui/themes";
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import Home from "./component/Home/Home";

function App() {
  return (
    <>
      <Flex
        position="sticky"
        px="4"
        py="2"
        justify="between"
        style={{
          borderBottom: "1px solid var(--gray-a2)",
        }}
      >
        <Box>
          <Heading>TRUSTED POKER</Heading>
        </Box>
        <Box>
          <ConnectButton />
        </Box>
      </Flex>
      <Container>
          <Router>
              <Home></Home>
          </Router>
      </Container>
    </>
  );
}

export default App;
