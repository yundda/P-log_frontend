import { useEffect, useState } from 'react';
import AddPet from '../components/Modal/AddPet';
import axios from 'axios';

const API = process.env.REACT_APP_API_SERVER;

export default function ChooseProfile() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [pets, setPets] = useState([]);
  const [selectedPetId, setSelectedPetId] = useState(null);

  const openModal = () => setIsModalOpen(true);
  const closeModal = () => {
    setIsModalOpen(false);
    fetchPets(); // 추가 후 목록
  };

  const fetchPets = async () => {
    try {
      const storedAuth = localStorage.getItem('auth');
      const token = storedAuth ? JSON.parse(storedAuth).token : '';
      const response = await axios.get(`${API}/pets`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (response.data.code === 'SU') {
        setPets(response.data.data || []);
      }
    } catch (error) {
      console.error('반려동물 목록 조회 실패:', error);
    }
  };

  const handlePetClick = petId => {
    setSelectedPetId(petId);
    localStorage.setItem('selectedPetId', petId); // 선택된 반려동물 저장
  };

  useEffect(() => {
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
            key={pet.petId}
            onClick={() => handlePetClick(pet.petId)}
            className={`cursor-pointer flex flex-col items-center p-4 rounded-lg shadow-md transition-transform hover:scale-105 ${
              selectedPetId === pet.petId
                ? 'ring-4 ring-plog-main4'
                : 'ring-1 ring-gray-300'
            }`}
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
