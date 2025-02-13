import Navbar from './components/Navbar';
import BlogPage from './pages/BlogPage';
import { BrowserRouter as Router, Routes, Route } from "react-router";
import './App.css'

function App() {

  return (
    <>
    <Router>
      <Navbar />
      <Routes>
        <Route path="/" element={<BlogPage />} />
      </Routes>
    </Router>
    </>
  )
}

export default App
