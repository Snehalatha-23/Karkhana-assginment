import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { ChakraProvider, CSSReset } from '@chakra-ui/react';
import { Provider } from 'react-redux';
import store from './store';
import Login from './components/Login';
import Signup from './components/Signup';
import Dashboard from './components/Dashboard';
import Layout from './components/Layout';
import PrivateRoute from './routes/PrivateRoute';

function App() {
  return (
    <Provider store={store}>
      <ChakraProvider>
        <CSSReset />
        <Router>
          <Routes>
            <Route element={<Layout />}>
              <Route path="/login" element={<Login />} />
              <Route path="/signup" element={<Signup />} />
              <Route path="/dashboard" element={<PrivateRoute><Dashboard /></PrivateRoute>} />
              <Route path="/" element={<Navigate to="/dashboard" replace />} />
              <Route path="*" element={<Navigate to="/login" replace />} />
            </Route>
          </Routes>
        </Router>
      </ChakraProvider>
    </Provider>
  );
}

export default App;
