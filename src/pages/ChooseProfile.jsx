import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import AddPet from '../components/Modal/AddPet';
import axios from '../api/axiosInterceptor';
import { useSetRecoilState } from 'recoil';
import {
  selectedpetNameState,
  selectedPetProfileState,
} from '../recoil/petAtom';

const API = process.env.REACT_APP_API_SERVER;

export default function ChooseProfile() {
  const navigate = useNavigate();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [pets, setPets] = useState([]);

  const setSelectedpetName = useSetRecoilState(selectedpetNameState);
  const setSelectedPetProfile = useSetRecoilState(selectedPetProfileState);

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

      console.log('[프로필 요청 시작]', petName);

      const response = await axios.get(
        `${API}/pets/profile/${encodeURIComponent(petName)}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        },
      );

      console.log('[반려동물 프로필 응답]', response.data);

      // if (response.data.code === 'SU') {
      //   const petData = response.data.data;
      //   setSelectedPetProfile(petData);
      //   localStorage.setItem('selectedPet', JSON.stringify(petData));
      //   navigate('/detail');
      if (response.data.code === 'SU') {
        const petData = response.data.data;

        // const formattedPetData = {
        //   id: petData.id || petData.petId,
        //   petName: petData.petName,
        //   petSpecies: petData.petSpecies,
        //   petBreed: petData.petBreed,
        //   petGender: petData.petGender,
        //   petBirthday: petData.petBirthday,
        //   petImageUrl: petData.petImageUrl,
        // };
        const formattedPetData = {
          id: petData.id || petData.petId, // :white_check_mark: id 또는 petId 포함
          petName: petData.petName,
          petSpecies: petData.petSpecies,
          petBreed: petData.petBreed,
          petGender: petData.petGender,
          petBirthday: petData.petBirthday,
          petImageUrl: petData.petImageUrl,
          petWeight: petData.petWeight,
        };

        setSelectedPetProfile(formattedPetData);
        localStorage.setItem('selectedPet', JSON.stringify(formattedPetData));
        navigate('/detail');
      } else {
        console.warn('[프로필 응답 실패]', response.data);
      }
    } catch (error) {
      console.error('[반려동물 정보 불러오기 실패]', error);
      alert(
        error.response?.data?.message ||
          '반려동물 정보를 불러오는 데 실패했습니다.',
      );
    }
  };

  useEffect(() => {
    console.log('[컴포넌트 마운트] 반려동물 목록 요청');
    fetchPets();
  }, []);

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
