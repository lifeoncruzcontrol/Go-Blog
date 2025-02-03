import { useState } from 'react'
import Navbar from './components/Navbar';
import { TextField } from '@mui/material';
import Home from './pages/Home';
import History from './pages/History';
import { BrowserRouter as Router, Routes, Route } from "react-router";
import './App.css'

function App() {

  return (
    <>
    <Router>
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/history" element={<History />} />
      </Routes>
    </Router>
    <TextField />
    </>
  )
}

export default App
