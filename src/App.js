import { Route, Routes } from 'react-router-dom';
import Login from './pages/Login';
import './style/index.css';
import Register from './pages/Register';
import NotFound from './pages/NotFound';
import ChooseProfile from './pages/ChooseProfile';
import MyPage from './pages/mypage';
import Accept from './components/Accept';
import PetSetting from './pages/PetSetting';

function App() {
  return (
    <>
      <Routes>
        {/* auth */}
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/accept" element={<Accept />} />
        <Route path="/myPage" element={<MyPage />} />

        <Route path="chooseProfile" element={<ChooseProfile />} />
        <Route path="petSetting" element={<PetSetting />} />

        {/* 404 */}
        <Route path="*" element={<NotFound />} />
      </Routes>
    </>
  );
}

export default App;
