import './App.css'
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Sender from './components/sender';
import {Receiver} from './components/reciever';

function App() {
  
  return (
    <BrowserRouter>
      <Routes>
        <Route path='/sender' element={<Sender />} />
        <Route path='/reciever' element={<Receiver />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App
