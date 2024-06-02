import './App.css'
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Sender from './components/sender';
import Reciever from './components/reciever';

function App() {
  
  return (
    <BrowserRouter>
      <Routes>
        <Route path='/sender' element={<Sender />} />
        <Route path='/reciever' element={<Reciever />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App
