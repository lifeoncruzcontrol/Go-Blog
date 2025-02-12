import Navbar from './components/Navbar';
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
      </Routes>
    </Router>
    </>
  )
}

export default App
