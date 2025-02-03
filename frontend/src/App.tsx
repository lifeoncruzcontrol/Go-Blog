import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import { BrowserRouter, Routes, Route} from 'react-router';
import Navbar from './components/Navbar';
import { TextField } from '@mui/material';
import './App.css'

function App() {
  const [count, setCount] = useState(0)

  return (
    <>
    <Navbar />
    <TextField />
    {/* <BrowserRouter>
      <Routes>
        <Route index element={<App />} />
        <Route path="about" element={<About />} />
      </Routes>
    </BrowserRouter> */}
    </>
  )
}

export default App
