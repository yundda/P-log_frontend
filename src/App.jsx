import { Route, Routes } from 'react-router-dom';
import Login from './pages/Login';
import './style/index.css';
import Register from './pages/Register';
import NotFound from './pages/NotFound';
import ChooseProfile from './pages/ChooseProfile';

import PetSetting from './pages/PetSetting';
import { RecoilRoot } from 'recoil';
import { useEffect } from 'react';
import axios from 'axios';
import './api/axiosInterceptor';
import Index from './pages/Index';
import MyPage from './pages/mypage';
import Layout from './components/Layout';
import RequestPending from './pages/RequestPending';
import MyPet from './pages/Mypet';

function App() {
  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    }
  }, []);

  return (
    <RecoilRoot>
      {/* 페이지 라우팅 */}
      <Routes>
        <Route element={<Layout />}>
          {/* 메인 페이지 */}
          <Route path="/" element={<Index />} />
          {/* 유저 관련 */}
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/myPage" element={<MyPage />} />

          <Route
            path="/request/pending/:requestId"
            element={<RequestPending />}
          />
          {/* 반려동물 관련 */}
          <Route path="/mypet" element={<MyPet />} />
          <Route path="/chooseProfile" element={<ChooseProfile />} />
          <Route path="/petSetting" element={<PetSetting />} />

          {/* 404 */}
          <Route path="*" element={<NotFound />} />
        </Route>
      </Routes>
    </RecoilRoot>
  );
}

export default App;
