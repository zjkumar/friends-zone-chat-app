
import './App.css';
import {Routes, Route, BrowserRouter as Router} from 'react-router-dom'
import Homepage from './pages/Homepage';
import ChatPage from './pages/ChatPage';

function App() {
  return (
    <div className='App'>
      <Router>
      <Routes>
          <Route exact path="/" Component={Homepage} />
          <Route exact path="/chatpage" Component={ChatPage} />
      </Routes>
      </Router>
    </div>
  );
}

export default App;
