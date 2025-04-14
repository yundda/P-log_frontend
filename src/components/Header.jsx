import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../api/axiosInterceptor';
import '../style/Header.scss';

const API = process.env.REACT_APP_API_SERVER;

export default function Header() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [nickname, setNickname] = useState('');

  const toggleMenu = () => setMenuOpen(prev => !prev);

  useEffect(() => {
    const storedAuth = localStorage.getItem('auth');
    if (storedAuth) {
      const { isLoggedIn, nickname } = JSON.parse(storedAuth);
      if (isLoggedIn) {
        setIsLoggedIn(true);
        setNickname(nickname);
      }
    }

    const handleResize = () => {
      if (window.innerWidth > 923) {
        setMenuOpen(false);
      }
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const handleLogout = async () => {
    try {
      await api.post(`${API}/user/logout`);
      localStorage.removeItem('auth');
      setIsLoggedIn(false);
      setNickname('');
      setMenuOpen(false);
      window.location.href = '/login';
    } catch (error) {
      alert('로그아웃에 실패했습니다. 다시 시도해주세요.');
    }
  };

  return (
    <>
      {/* PC Header */}
      <header className="hidden md:flex justify-between items-center px-6 py-3 shadow-md h-16">
        <Link to="/">
          <img src="/images/Logo.png" alt="logo" className="w-14" />
        </Link>
        <nav className="flex-1 flex justify-center items-center">
          <ul className="flex gap-10 text-plog-main4 font-semibold text-base">
            <li>
              <Link to="/">홈</Link>
            </li>
            <li>
              <Link to="/detail">상세페이지</Link>
            </li>
            <li>
              <Link to="/petSetting">반려동물 설정</Link>
            </li>
            <li>
              <Link to="/invite">수락</Link>
            </li>
          </ul>
        </nav>
        <div className="mr-4">
          {isLoggedIn ? (
            <Link to="/mypage" className="login-button">
              {nickname}님 페이지
            </Link>
          ) : (
            <Link to="/login" className="login-button">
              로그인
            </Link>
          )}
        </div>
      </header>

      {/* Mobile Header */}
      <div className="md:hidden flex justify-between items-center px-6 py-3 shadow-md mobile-header">
        <Link to="/">
          <img src="/images/Logo.png" alt="logo" className="w-24" />
        </Link>
        <button className="menu-button" onClick={toggleMenu}>
          <img src="/images/bones.png" alt="nav" className="w-6 h-6" />
        </button>
      </div>

      {menuOpen && (
        <div className="mobile-overlay" onClick={() => setMenuOpen(false)} />
      )}

      {/* Mobile Side Nav */}
      <nav className={`mobile-nav ${menuOpen ? 'open' : ''}`}>
        <div className="mobile-nav-content">
          <ul className="flex flex-col gap-4 text-plog-main4 font-semibold text-lg mt-10">
            <li>
              <Link to="/">홈</Link>
            </li>
            <li>
              <Link to="/detail">상세페이지</Link>
            </li>
            <li>
              <Link to="/petSetting">반려동물 설정</Link>
            </li>
          </ul>
          <div className="flex flex-col gap-3 mt-6">
            {isLoggedIn ? (
              <>
                <Link to="/mypage" className="login-button">
                  {nickname}님 페이지
                </Link>
                <button className="logout-button" onClick={handleLogout}>
                  로그아웃
                </button>
              </>
            ) : (
              <Link to="/login" className="login-button">
                로그인
              </Link>
            )}
          </div>
        </div>
      </nav>
    </>
  );
}
