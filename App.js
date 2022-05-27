import './App.css';
import Navbar from './components/Navbar';
import { BrowserRouter as Router, Routes, Route } from
  "react-router-dom";
import Home from "./components/Home";
import About from './components/About';
import Resume from './components/Resume';
import Trash from './components/Trash';
import News from './components/News';
import Notes from './components/Notes';
import NoteState from './context/Notes/NoteState';
function App() {
  return (
    <>
      <NoteState>
        <Router>
          <Navbar>
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/about" element={<About />} />
              <Route path="/resume" element={<Resume />} />
              <Route path="/trash" element={<Trash />} />
              <Route path="/news" element={<News />} />
              <Route path="/notes" element={<Notes />} />
            </Routes>
          </Navbar>
        </Router>
      </NoteState>

    </>
  );
}

export default App;
