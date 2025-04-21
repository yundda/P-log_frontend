import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import AddPet from '../components/Modal/AddPet';
import axios from '../api/axiosInterceptor';
import { useSetRecoilState } from 'recoil';
import {
  selectedpetNameState,
  selectedPetProfileState,
} from '../recoil/petAtom';
import LoginRequired from '../components/Modal/LoginRequired';

const API = process.env.REACT_APP_API_SERVER;

export default function ChooseProfile() {
  const navigate = useNavigate();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [pets, setPets] = useState([]);

  const setSelectedpetName = useSetRecoilState(selectedpetNameState);
  const setSelectedPetProfile = useSetRecoilState(selectedPetProfileState);
  const [isLogin, setIsLogin] = useState(true);
  const [showLoginModal, setShowLoginModal] = useState(false);

  // 로그인 여부 확인
  useEffect(() => {
    const auth = localStorage.getItem('auth');
    if (!auth) {
      setIsLogin(false);
      setShowLoginModal(true);
    } else {
      setIsLogin(true);
      setShowLoginModal(false);
    }
  }, []);

  // 로그인 상태일 때만 fetchPets 호출
  useEffect(() => {
    if (isLogin) {
      fetchPets();
    }
  }, [isLogin]);

  const openModal = () => {
    console.log('[모달 열기]');
    setIsModalOpen(true);
  };

  const closeModal = () => {
    console.log('[모달 닫기 및 반려동물 목록 새로고침]');
    setIsModalOpen(false);
    fetchPets();
  };

  const fetchPets = async () => {
    try {
      const storedAuth = localStorage.getItem('auth');
      const token = storedAuth ? JSON.parse(storedAuth).token : '';

      console.log('[반려동물 목록 요청 시작] 토큰:', token);

      const response = await axios.get(`${API}/pets`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      console.log('[반려동물 목록 응답]', response.data);

      if (response.data.code === 'SU') {
        setPets(response.data.data || []);
      } else {
        console.warn('[반려동물 목록 응답 실패]', response.data);
      }
    } catch (error) {
      console.error('[반려동물 목록 조회 실패]', error);
    }
  };

  const handlePetClick = async petName => {
    console.log('[선택된 반려동물]', petName);
    setSelectedpetName(petName);

    try {
      const storedAuth = localStorage.getItem('auth');
      const token = storedAuth ? JSON.parse(storedAuth).token : '';

      const encodedPetName = encodeURIComponent(petName);
      const requestUrl = `${API}/pets/profile/${encodedPetName}`;

      console.log('[프로필 요청 시작]', petName);
      console.log('[요청 URL]', requestUrl);
      console.log('[요청 헤더]', { Authorization: `Bearer ${token}` });

      const response = await axios.get(requestUrl, {
        headers: { Authorization: `Bearer ${token}` },
      });

      console.log('[반려동물 프로필 응답]', response.data);

      if (response.data.code === 'SU') {
        const petData = response.data.data;

        const formattedPetData = {
          id: petData.id || petData.petId,
          petName: petData.petName,
          petSpecies: petData.petSpecies,
          petBreed: petData.petBreed,
          petGender: petData.petGender,
          petBirthday: petData.petBirthday,
          petImageUrl: petData.petImageUrl,
          petWeight: petData.petWeight,
        };

        console.log('[포맷된 반려동물 데이터]', formattedPetData);

        setSelectedPetProfile(formattedPetData);
        localStorage.setItem('selectedPet', JSON.stringify(formattedPetData));
        navigate('/');
      } else {
        console.warn('[프로필 응답 실패]', response.data);
      }
    } catch (error) {
      console.error('[반려동물 정보 불러오기 실패]', error);

      if (error.response) {
        console.error('[에러 응답 데이터]', error.response.data);
        console.error('[에러 상태 코드]', error.response.status);
        console.error('[에러 헤더]', error.response.headers);
      } else if (error.request) {
        console.error('[요청은 되었지만 응답이 없음]', error.request);
      } else {
        console.error('[요청 설정 중 에러 발생]', error.message);
      }

      alert(
        error.response?.data?.message ||
          '반려동물 정보를 불러오는 데 실패했습니다.',
      );
    }
  };

  // 로그인하지 않은 경우 로그인 필요 모달
  if (!isLogin && showLoginModal) {
    return <LoginRequired onClose={() => setShowLoginModal(false)} />;
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-white">
      <h1 className="text-3xl md:text-4xl font-bold text-brown-700 mb-8">
        관리를 해줄 동물을 선택하세요.
      </h1>

      <div className="flex gap-8 flex-wrap justify-center">
        {pets.map(pet => (
          <div
            key={pet.petName}
            onClick={() => handlePetClick(pet.petName)}
            className="cursor-pointer flex flex-col items-center p-4 rounded-lg shadow-md transition-transform hover:scale-105 ring-1 ring-gray-300"
          >
            <img
              src={pet.petImageUrl || '/images/default-pet.png'}
              alt={pet.petName}
              className="w-32 h-32 md:w-40 md:h-40 rounded-full object-cover"
            />
            <span className="mt-3 px-4 py-2 bg-beige-300 text-lg rounded-lg shadow-sm">
              {pet.petName}
            </span>
          </div>
        ))}
      </div>

      <button
        className="w-[140px] mt-10 px-8 bg-plog-main5 text-white text-lg text-center rounded-lg shadow-md"
        onClick={openModal}
      >
        추가하기
      </button>

      {isModalOpen && <AddPet onClose={closeModal} />}
    </div>
  );
}
