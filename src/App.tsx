import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Layout } from './components/layout/Layout';
import SessionsPage from './pages/SessionsPage';
import BoothsPage from './pages/BoothsPage';
import NetworkPage from './pages/NetworkPage';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<Navigate to="/sessions" replace />} />
          <Route path="sessions" element={<SessionsPage />} />
          <Route path="booths" element={<BoothsPage />} />
          <Route path="network" element={<NetworkPage />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
