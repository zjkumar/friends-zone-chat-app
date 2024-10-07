
import './App.css';
import {Routes, Route, BrowserRouter as Router} from 'react-router-dom'

import ChatPage from './pages/ChatPage';
import LoginPage from './pages/LoginPage';

function App() {
  return (
    <div className='App'>
      <Router>
        <Routes>
            <Route exact path="/" Component={LoginPage} />
            <Route exact path="/chatpage" Component={ChatPage} />
        </Routes>
      </Router>
    </div>
  );
}

export default App;
