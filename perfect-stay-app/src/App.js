import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Landing from './componentsES/landing/Landing';
import PerfectStayHome from './componentsES/PerfectStayHome';
import Room from './componentsES/room/Room';
import BecomeHost from './componentsES/Host/BecomeHost';
import HostDashboard from './componentsES/Host/HostDashboard';
import './App.css';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/landing" element={<HostDashboard />} />
        <Route path="/home" element={<PerfectStayHome />} />
        <Route path="/room-details" element={<Room />} />
        <Route path="/room/:id" element={<Room />} />
        <Route path="/become-host" element={<BecomeHost />} />
        <Route path="/host-dashboard" element={<HostDashboard />} />
      </Routes>
    </Router>
  );
}

export default App;
