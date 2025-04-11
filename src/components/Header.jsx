import { useEffect, useState } from 'react';
import { useLocation, Link } from 'react-router-dom';
import axios from 'axios';
import '../style/Header.scss';

export default function Header() {
  const location = useLocation();
  const [menuOpen, setMenuOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [nickname, setNickname] = useState('');

  const toggleMenu = () => {
    setMenuOpen(!menuOpen);
  };

  // // 로그인 상태 확인
  // const fetchUserInfo = async () => {
  //   try {
  //     const res = await axios.get(
  //       `${process.env.REACT_APP_API_SERVER}/auth/login`,
  //     ); // 로그인 상태 확인 API
  //     if (res.data.result) {
  //       setIsLoggedIn(true);
  //       setNickname(res.data.nickname);
  //     } else {
  //       setIsLoggedIn(false);
  //       setNickname('');
  //     }
  //   } catch (err) {
  //     setIsLoggedIn(false);
  //     setNickname('');
  //   }
  // };

  // location 변경 시마다 호출
  // useEffect(() => {
  //   fetchUserInfo();
  // }, [location]);

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
              <Link to="/accept">수락</Link>
            </li>
          </ul>
        </nav>
        <div className="mr-4">
          {isLoggedIn ? (
            <Link to="/mypage" className="login-button">
              {nickname}님
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
                  {nickname}님
                </Link>
                <button
                  className="logout-button"
                  onClick={() => {
                    axios.post('/api/auth/logout').then(() => {
                      setIsLoggedIn(false);
                      setNickname('');
                      setMenuOpen(false);
                    });
                  }}
                >
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
