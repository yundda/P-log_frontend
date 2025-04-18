import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import '../style/Header.scss';

export default function Header() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [nickname, setNickname] = useState('');
  const [isLogoutModalOpen, setIsLogoutModalOpen] = useState(false);

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

  const handleLogoutClick = () => {
    setIsLogoutModalOpen(true);
  };

  const confirmLogout = () => {
    localStorage.removeItem('auth');
    setIsLoggedIn(false);
    setNickname('');
    setMenuOpen(false);
    setIsLogoutModalOpen(false);
    window.location.href = '/login';
  };

  const cancelLogout = () => {
    setIsLogoutModalOpen(false);
  };

  return (
    <>
      {/* PC Header */}
      <header className="hidden md:flex justify-between items-center px-6 py-3 w-[90%] h-20 mx-auto">
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
              <a
                href="https://github.com/yundda/P-log_frontend.git"
                target="_blank"
                rel="noopener noreferrer"
              >
                About Us
              </a>
            </li>
          </ul>
        </nav>
        <div className="mr-4 flex items-center gap-4">
          {isLoggedIn ? (
            <>
              <Link to="/mypage" className="login-button">
                {nickname}님 페이지
              </Link>
              {/* <button
                onClick={handleLogoutClick}
                className="logout-button ml-2"
              >
                로그아웃
              </button> */}
            </>
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
          <img src="/images/bonebar.png" alt="nav" className="w-20" />
        </button>
      </div>

      {menuOpen && (
        <div className="mobile-overlay" onClick={() => setMenuOpen(false)} />
      )}

      {/* Mobile Side Nav */}
      <nav className={`mobile-nav ${menuOpen ? 'open' : ''}`}>
        <div className="mobile-nav-content flex flex-col justify-between h-full p-6">
          <div>
            <ul className="flex flex-col gap-4 text-plog-main4 font-semibold text-lg mt-10">
              {isLoggedIn ? (
                <Link
                  to="/mypage"
                  className="login-button"
                  onClick={() => setMenuOpen(false)}
                >
                  {nickname}님 페이지
                </Link>
              ) : (
                <Link
                  to="/login"
                  className="login-button"
                  onClick={() => setMenuOpen(false)}
                >
                  로그인
                </Link>
              )}
              <li>
                <Link to="/" onClick={() => setMenuOpen(false)}>
                  홈
                </Link>
              </li>
              <li>
                <Link to="/detail" onClick={() => setMenuOpen(false)}>
                  상세페이지
                </Link>
              </li>
              <li>
                <Link to="/petSetting" onClick={() => setMenuOpen(false)}>
                  반려동물 설정
                </Link>
              </li>
              <li>
                <Link to="/request" onClick={() => setMenuOpen(false)}>
                  요청
                </Link>
              </li>
              <li>
                <a
                  href="https://github.com/"
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={() => setMenuOpen(false)}
                >
                  About Us
                </a>
              </li>
            </ul>
          </div>
          {isLoggedIn && (
            <button
              className="logout-button text-red-500 border-t border-gray-200 pt-4 mt-4"
              onClick={handleLogoutClick}
            >
              로그아웃
            </button>
          )}
        </div>
      </nav>

      {/* 로그아웃 모달 */}
      {isLogoutModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-xl shadow-xl text-center w-80">
            <p className="mb-4 text-lg font-medium">
              정말 로그아웃 하시겠습니까?
            </p>
            <div className="flex justify-center gap-4">
              <button
                onClick={confirmLogout}
                className="bg-red-500 text-white px-4 py-2 rounded-md hover:bg-red-600"
              >
                로그아웃
              </button>
              <button
                onClick={cancelLogout}
                className="bg-gray-300 px-4 py-2 rounded-md hover:bg-gray-400"
              >
                취소
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
