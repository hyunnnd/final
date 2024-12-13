import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './AuthContext';
import Home from './pages/Home';
import Login from './pages/Login';
import Join from './pages/Join';
import Map from './pages/Map';
import Board from './pages/Board';
import BoardWrite from './pages/BoardWrite';
import BoardDetail from './pages/BoardDetail';
import BoardEdit from './pages/BoardEdit';
import Player from './pages/Player';

export default function AppRouter() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/join" element={<Join />} />
          <Route path="/map" element={<Map />} />
          <Route path="/board" element={<Board />} />
          <Route path="/board/detail" element={<BoardDetail />} />
          <Route path="/board/write" element={<BoardWrite />} />
          <Route path="/board/edit" element={<BoardEdit />} />
          <Route path="/player" element={<Player />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
}
