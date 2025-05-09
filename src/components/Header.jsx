import { useEffect, useState, useRef } from 'react';
import { Link } from 'react-router-dom';
import '../style/Header.scss';
import axios from '../api/axiosInterceptor';
import { useRecoilState, useSetRecoilState, useResetRecoilState } from 'recoil';
import {
  selectedPetProfileState,
  selectedpetNameState,
  selectedPetState,
} from '../recoil/petAtom';
import AddPet from '../components/Modal/AddPet';

const API = process.env.REACT_APP_API_SERVER;

export default function Header() {
  // const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isLogoutModalOpen, setIsLogoutModalOpen] = useState(false);
  const [showPetMenu, setShowPetMenu] = useState(false);
  const [selectedPet, setSelectedPet] = useRecoilState(selectedPetState);
  const [petList, setPetList] = useState([]);
  const [isAddPetModalOpen, setIsAddPetModalOpen] = useState(false);

  const setSelectedPetProfile = useSetRecoilState(selectedPetProfileState);
  const resetSelectedPetProfile = useResetRecoilState(selectedPetProfileState);
  const resetSelectedPetName = useResetRecoilState(selectedpetNameState);

  const petMenuRef = useRef(null);

  const toggleMenu = () => setMenuOpen(prev => !prev);

  // useEffect(() => {
  //   const storedAuth = localStorage.getItem('auth');
  //   if (storedAuth) {
  //     const { isLoggedIn } = JSON.parse(storedAuth);
  //     if (isLoggedIn) {
  //       setIsLoggedIn(true);
  //       fetchPetList();
  //     }
  //   }

  //   const storedPet = localStorage.getItem('selectedPet');
  //   if (storedPet) {
  //     const parsed = JSON.parse(storedPet);
  //     setSelectedPet(parsed);
  //     setSelectedPetProfile(parsed);
  //   }

  //   const handleResize = () => {
  //     if (window.innerWidth > 923) setMenuOpen(false);
  //   };
  //   const handleClickOutside = e => {
  //     if (petMenuRef.current && !petMenuRef.current.contains(e.target)) {
  //       setShowPetMenu(false);
  //     }
  //   };

  //   window.addEventListener('resize', handleResize);
  //   document.addEventListener('mousedown', handleClickOutside);

  //   return () => {
  //     window.removeEventListener('resize', handleResize);
  //     document.removeEventListener('mousedown', handleClickOutside);
  //   };
  // }, [setSelectedPet, setSelectedPetProfile]);
  useEffect(() => {
    const storedAuth = localStorage.getItem('auth');
    if (storedAuth) {
      const { isLoggedIn } = JSON.parse(storedAuth);
      if (isLoggedIn) {
        setIsLoggedIn(true);
        fetchPetList();
      }
    }

    const storedPet = localStorage.getItem('selectedPet');
    if (storedPet) {
      const parsed = JSON.parse(storedPet);
      setSelectedPet(parsed);
      setSelectedPetProfile(parsed);
    }

    const handleResize = () => {
      if (window.innerWidth > 923) setMenuOpen(false);
    };
    const handleClickOutside = e => {
      if (petMenuRef.current && !petMenuRef.current.contains(e.target)) {
        setShowPetMenu(false);
      }
    };

    window.addEventListener('resize', handleResize);
    document.addEventListener('mousedown', handleClickOutside);

    return () => {
      window.removeEventListener('resize', handleResize);
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [setSelectedPet, setSelectedPetProfile]);

  const fetchPetList = async () => {
    try {
      const token = JSON.parse(localStorage.getItem('auth'))?.token;
      const response = await axios.get(`${API}/pets`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (response.data.code === 'SU') {
        setPetList(response.data.data || []);
      }
    } catch (error) {
      console.error('[펫 목록 불러오기 실패]', error);
    }
  };

  const handlePetSelect = async petName => {
    try {
      const token = JSON.parse(localStorage.getItem('auth'))?.token;
      const response = await axios.get(
        `${API}/pets/profile/${encodeURIComponent(petName)}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        },
      );

      if (response.data.code === 'SU') {
        const petData = response.data.data;
        const formattedPet = {
          id: petData.id || petData.petId,
          petName: petData.petName,
          petSpecies: petData.petSpecies,
          petBreed: petData.petBreed,
          petGender: petData.petGender,
          petBirthday: petData.petBirthday,
          petImageUrl: petData.petImageUrl,
          petWeight: petData.petWeight,
        };

        localStorage.setItem('selectedPet', JSON.stringify(formattedPet));
        setSelectedPet(formattedPet);
        setSelectedPetProfile(formattedPet);
        setShowPetMenu(false);
        setMenuOpen(false);
      }
    } catch (error) {
      console.error('[펫 선택 실패]', error);
      alert('펫 정보를 불러오는 데 실패했습니다.');
    }
  };

  const openAddPetModal = () => setIsAddPetModalOpen(true);
  const closeAddPetModal = () => {
    setIsAddPetModalOpen(false);
    fetchPetList();
  };

  const handleLogoutClick = () => setIsLogoutModalOpen(true);
  const confirmLogout = () => {
    localStorage.clear();
    resetSelectedPetProfile();
    resetSelectedPetName();
    setIsLoggedIn(false);
    setMenuOpen(false);
    setIsLogoutModalOpen(false);
    window.location.href = '/';
  };
  const cancelLogout = () => setIsLogoutModalOpen(false);

  return (
    <>
      {/* PC Header */}
      <header className="hidden md:flex fixed top-0 left-0 right-0 z-50 bg-white justify-between items-center px-6 py-3 w-full h-20">
        <Link to="/">
          <img src="/images/Logo.png" alt="logo" className="w-14" />
        </Link>
        <nav className="flex-1 flex justify-center items-center">
          <ul className="flex gap-10 text-plog-main4 font-bold text-xl">
            <li>
              <Link to="/mypet">마이 펫</Link>
            </li>
            <li>
              <Link to="/mypage">회원정보 수정</Link>
            </li>
            <li>
              <Link to="/petsetting">펫 수정</Link>
            </li>
          </ul>
        </nav>
        <div className="mr-4 flex items-center gap-4 relative">
          {isLoggedIn && selectedPet && (
            <div className="relative" ref={petMenuRef}>
              <button
                className="flex items-center gap-2 focus:outline-none"
                onClick={() => setShowPetMenu(prev => !prev)}
              >
                <img
                  src={selectedPet.petImageUrl || '/images/default-pet.png'}
                  alt="pet"
                  className="w-10 h-10 rounded-full object-cover"
                />
                <span className="text-sm font-medium text-gray-800">
                  {selectedPet.petName || '펫 선택'}
                </span>
              </button>

              {showPetMenu && (
                <div className="pet-menu absolute right-0 mt-2 w-64 z-50">
                  {petList.map(pet => (
                    <div
                      key={pet.petName}
                      className="pet-item"
                      onClick={() => handlePetSelect(pet.petName)}
                    >
                      <img
                        src={pet.petImageUrl || '/images/default-pet.png'}
                        alt={pet.petName}
                      />
                      <span>{pet.petName}</span>
                    </div>
                  ))}
                  <div className="add-pet" onClick={openAddPetModal}>
                    + 반려동물 추가하기
                  </div>
                </div>
              )}
            </div>
          )}
          {isLoggedIn ? (
            <button
              onClick={handleLogoutClick}
              className="login-button text-red-500"
            >
              로그아웃
            </button>
          ) : (
            <Link to="/login" className="login-button">
              로그인
            </Link>
          )}
        </div>
      </header>

      {/* AddPet 모달 */}
      {isAddPetModalOpen && <AddPet onClose={closeAddPetModal} />}

      {/* Mobile Header */}
      <div className="md:hidden flex justify-between items-center px-6 py-3  mobile-header ">
        <Link to="/">
          <img src="/images/Logo.png" alt="logo" className="w-[40px]" />
        </Link>
        <button className="menu-button" onClick={toggleMenu}>
          <img src="/images/bonebar.png" alt="nav" className="w-[30px]" />
        </button>
      </div>

      {menuOpen && (
        <div
          className="mobile-overlay fixed inset-0 bg-black bg-opacity-40 z-50"
          onClick={() => setMenuOpen(false)}
        />
      )}

      {/* Mobile Side Nav */}
      <nav className={`mobile-nav ${menuOpen ? 'open' : ''}`}>
        <div className="mobile-nav-content flex flex-col justify-between h-full p-6">
          <div>
            {isLoggedIn && petList.length > 0 && (
              <div className="mb-4 border-b pb-4 border-gray-200">
                <p className="text-xl text-center text-plog-main4 font-bold mb-2">
                  반려동물 선택
                </p>
                <div className="flex flex-wrap gap-6 justify-center">
                  {petList.map(pet => (
                    <div
                      key={pet.petName}
                      onClick={() => handlePetSelect(pet.petName)}
                      className="flex flex-col items-center cursor-pointer"
                    >
                      <img
                        src={pet.petImageUrl || '/images/default-pet.png'}
                        alt={pet.petName}
                        className="w-14 h-14 rounded-full object-cover"
                      />
                      <span className="text-xs mt-1">{pet.petName}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            <ul className="flex flex-col gap-4 text-plog-main4 font-semibold text-lg mt-6">
              <li>
                <Link to="/mypet" onClick={() => setMenuOpen(false)}>
                  마이 펫
                </Link>
              </li>
              <li>
                <Link to="/mypage" onClick={() => setMenuOpen(false)}>
                  회원정보 수정
                </Link>
              </li>
              <li>
                <Link to="/petsetting" onClick={() => setMenuOpen(false)}>
                  펫 수정
                </Link>
              </li>
            </ul>
          </div>

          {isLoggedIn ? (
            <button
              className="logout-button text-red-500 border-t border-gray-200 pt-4 mt-4"
              onClick={handleLogoutClick}
            >
              로그아웃
            </button>
          ) : (
            <Link
              to="/login"
              className="login-button"
              onClick={() => setMenuOpen(false)}
            >
              로그인
            </Link>
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
