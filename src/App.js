import { Route, Routes } from 'react-router-dom';
import Login from './pages/Login';
import './style/index.css';
import Register from './pages/Register';
import NotFound from './pages/NotFound';
import ChooseProfile from './pages/ChooseProfile';
import MyPage from './pages/mypage';
function App() {
  return (
    <>
      <Routes>
        {/* auth */}
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="ChooseProfile" element={<ChooseProfile />} />
        <Route path="/mypage" element={<MyPage />} />

        {/* 404 */}
        <Route path="*" element={<NotFound />} />
      </Routes>
    </>
  );
}

export default App;
