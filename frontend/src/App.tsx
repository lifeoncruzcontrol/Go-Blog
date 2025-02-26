import Navbar from './components/Navbar';
import BlogGrid from './pages/BlogGrid';
import { BrowserRouter as Router, Routes, Route } from "react-router";
import './App.css'

function App() {

  return (
    <>
    <Router>
      <Navbar />
      <Routes>
        <Route path="/" element={<BlogGrid />} />
      </Routes>
    </Router>
    </>
  )
}

export default App
