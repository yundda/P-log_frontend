import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api/axiosInterceptor';
import {
  selectedpetNameState,
  selectedPetProfileState,
} from '../recoil/petAtom';
import { useSetRecoilState } from 'recoil';

export default function MyPet() {
  const navigate = useNavigate();
  const [petList, setPetList] = useState([]);
  const [modalType, setModalType] = useState(null);
  const [selectedPetName, setSelectedPetName] = useState('');

  const setSelectedPetProfile = useSetRecoilState(selectedPetProfileState);
  const setSelectedpetName = useSetRecoilState(selectedpetNameState);

  useEffect(() => {
    const fetchPets = async () => {
      try {
        const res = await api.get('/pets');
        console.log('[반려동물 목록 응답]', res.data);
        if (res.data.code === 'SU') {
          setPetList(res.data.data);
        }
      } catch (error) {
        console.error('[반려동물 목록 요청 실패]', error);
      }
    };

    fetchPets();
  }, []);

  const handleLeavePet = async petName => {
    try {
      const res = await api.get(`/user/leave/${encodeURIComponent(petName)}`);
      if (res.data.code === 'SU') {
        alert(`"${petName}"에서 가족 관계가 해제되었습니다.`);
        setPetList(prev => prev.filter(pet => pet.petName !== petName));
      }
    } catch (err) {
      const res = err.response;
      alert(res?.data?.message || '가족에서 빠지기에 실패했습니다.');
    }
  };

  const handleDeletePet = async petName => {
    try {
      const res = await api.delete(
        `/pets/delete/${encodeURIComponent(petName)}`,
      );
      if (res.data.code === 'SU') {
        alert('반려동물이 삭제되었습니다.');
        setPetList(prev => prev.filter(pet => pet.petName !== petName));
      }
    } catch (err) {
      const res = err.response;
      alert(res?.data?.message || '삭제에 실패했습니다.');
    }
  };

  // ✅ 모달 열기 전에 role이 OWNER가 아니면 막기
  const openModal = (type, petName) => {
    const pet = petList.find(p => p.petName === petName);
    if (type === 'delete' && pet?.role !== 'OWNER') {
      alert('해당 반려동물의 소유자가 아니므로 삭제할 수 없습니다.');
      return;
    }
    setModalType(type);
    setSelectedPetName(petName);
  };

  const handleConfirm = async () => {
    if (modalType === 'leave') {
      await handleLeavePet(selectedPetName);
    } else if (modalType === 'delete') {
      await handleDeletePet(selectedPetName); // 백엔드에서 실제 검증도 이루어짐
    }
    setModalType(null);
    setSelectedPetName('');
  };

  const handleCancel = () => {
    setModalType(null);
    setSelectedPetName('');
  };

  const handlePetClick = async petName => {
    setSelectedpetName(petName);
    try {
      const res = await api.get(`/pets/profile/${encodeURIComponent(petName)}`);
      if (res.data.code === 'SU') {
        const petData = res.data.data;

        const formattedPetData = {
          id: petData.id || petData.petId,
          petName: petData.petName,
          petSpecies: petData.petSpecies,
          petBreed: petData.petBreed,
          petGender: petData.petGender,
          petBirthday: petData.petBirthday,
          petImageUrl: petData.petImageUrl,
        };

        setSelectedPetProfile(formattedPetData);
        localStorage.setItem('selectedPet', JSON.stringify(formattedPetData));

        navigate('/petsetting');
      } else {
        alert(res.data.message || '프로필 정보를 가져오지 못했습니다.');
      }
    } catch (error) {
      console.error('[프로필 요청 실패]', error);
      alert(
        error.response?.data?.message ||
          '반려동물 정보를 불러오는 데 실패했습니다.',
      );
    }
  };

  return (
    <>
      <div className="mypet-container w-full min-h-[80vh] flex justify-center items-start p-4 ">
        <div className="pet-card w-full max-w-screen-xl bg-white p-8 rounded-2xl shadow-2xl">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-plog-main4 text-4xl font-bold">
              나의 반려동물
            </h3>
            <button
              className="bg-plog-main5 text-white py-2 px-4 rounded-lg hover:bg-plog-main4 transition text-base"
              onClick={() => navigate('/chooseProfile')}
            >
              추가하기
            </button>
          </div>

          {petList.length === 0 ? (
            <p className="text-gray-500 text-center text-lg">
              등록된 반려동물이 없습니다.
            </p>
          ) : (
            <div className="grid grid-cols-2 lg:grid-cols-3 gap-6 justify-center mt-6">
              {petList.map(pet => (
                <div
                  key={pet.petId}
                  className="flex flex-col items-center text-center bg-gray-50 p-4 rounded-xl shadow-sm w-full"
                >
                  <img
                    src={pet.petImageUrl || '/images/default-pet.png'}
                    alt={pet.petName || '반려동물'}
                    className="w-24 h-24 rounded-full object-cover mb-2 cursor-pointer"
                    onClick={() => handlePetClick(pet.petName)}
                  />
                  <span className="bg-plog-main1 text-gray-800 px-3 py-1 rounded mb-2 text-sm font-medium">
                    {pet.petName || '이름 없음'}
                  </span>
                  <div className="flex gap-2 flex-wrap justify-center">
                    <button
                      onClick={() => openModal('leave', pet.petName)}
                      className="bg-yellow-500 text-white py-1 px-3 rounded-md text-sm hover:bg-yellow-600"
                    >
                      가족에서 빠지기
                    </button>
                    <button
                      onClick={() => openModal('delete', pet.petName)}
                      className="bg-red-500 text-white py-1 px-3 rounded-md text-sm hover:bg-red-600"
                    >
                      삭제하기
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* 모달 */}
      {modalType && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-xl shadow-xl text-center w-80">
            <p className="mb-4 text-lg font-medium">
              {modalType === 'leave'
                ? `"${selectedPetName}"에서 가족 관계를 해제하시겠습니까?`
                : `"${selectedPetName}"을(를) 정말 삭제하시겠습니까?`}
            </p>
            <div className="flex justify-center gap-4">
              <button
                onClick={handleConfirm}
                className="bg-red-500 text-white px-4 py-2 rounded-md hover:bg-red-600"
              >
                확인
              </button>
              <button
                onClick={handleCancel}
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
