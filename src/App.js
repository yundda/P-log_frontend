import { Route, Routes } from 'react-router-dom';
import Login from './pages/Login';
import './style/index.css';
function App() {
  return (
    <>
      <Routes>
        <Route path="/login" element={<Login />} />
      </Routes>
    </>
  );
}

export default App;
