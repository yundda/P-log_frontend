import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api/axiosInterceptor';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEye, faEyeSlash } from '@fortawesome/free-solid-svg-icons';
import '../style/mypage.scss';

const PROFILE_ICONS = [
  '/images/profile1.png',
  '/images/profile2.png',
  '/images/profile3.png',
  '/images/profile4.png',
  '/images/profile5.png',
  '/images/profile6.png',
  '/images/profile7.png',
  '/images/profile8.png',
  '/images/profile9.png',
  '/images/profile10.png',
  '/images/profile11.png',
  '/images/profile12.png',
  '/images/profile13.png',
];

export default function MyPage() {
  const navigate = useNavigate();

  const [userData, setUserData] = useState({ nickname: '', email: '' });
  const [form, setForm] = useState({
    nickname: '',
    beforePassword: '',
    afterPassword: '',
  });
  const [message, setMessage] = useState('');
  const [selectedIcon, setSelectedIcon] = useState(
    localStorage.getItem('profileIcon') || PROFILE_ICONS[0],
  );
  const [petList, setPetList] = useState([]);
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [isLogoutModalOpen, setIsLogoutModalOpen] = useState(false);

  // 🆕 모달 상태
  const [modalType, setModalType] = useState(null); // 'leave' or 'delete'
  const [selectedPetName, setSelectedPetName] = useState('');

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const res = await api.get('/user/mypage');
        if (res.data.code === 'SU') {
          const { nickname, email } = res.data.data;
          setUserData({ nickname, email });
          setForm(prev => ({ ...prev, nickname }));
        }
      } catch (err) {
        const res = err.response;
        if (res?.status === 401) setMessage('인증이 필요합니다.');
        else if (res?.status === 404)
          setMessage(res.data.message || '사용자 정보를 찾을 수 없습니다.');
        else setMessage('유저 정보를 불러오는 데 실패했습니다.');
      }
    };

    fetchUserData();
  }, []);

  useEffect(() => {
    const fetchPets = async () => {
      try {
        const res = await api.get('/pets');
        if (res.data.code === 'SU') {
          setPetList(res.data.data);
        }
      } catch (error) {
        console.error('반려동물 목록 불러오기 실패:', error);
      }
    };

    fetchPets();
  }, []);

  const handleChange = e => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
  };

  const handleIconSelect = icon => {
    setSelectedIcon(icon);
  };

  const handleIconSave = () => {
    localStorage.setItem('profileIcon', selectedIcon);
    alert('프로필 아이콘이 저장되었습니다!');
  };

  const validate = () => {
    const { beforePassword, afterPassword, nickname } = form;

    if (!beforePassword) {
      setMessage('현재 비밀번호를 입력해주세요.');
      return false;
    }

    if (
      afterPassword &&
      (!/(?=.*[a-zA-Z])(?=.*[0-9])|(?=.*[!@#$%^&*])/.test(afterPassword) ||
        afterPassword.length < 8)
    ) {
      setMessage(
        '새 비밀번호는 영문/숫자/특수문자 중 2가지 이상 조합, 8자 이상이어야 합니다.',
      );
      return false;
    }

    if (beforePassword === afterPassword) {
      setMessage('현재 비밀번호와 새 비밀번호가 같습니다.');
      return false;
    }

    if (!afterPassword && nickname === userData.nickname) {
      setMessage('변경할 정보가 없습니다.');
      return false;
    }

    return true;
  };

  const handleSubmit = async () => {
    if (!validate()) return;

    const payload = { beforePassword: form.beforePassword };
    if (form.nickname !== userData.nickname) payload.nickname = form.nickname;
    if (form.afterPassword) payload.afterPassword = form.afterPassword;

    try {
      const res = await api.patch('/user/update', payload);
      if (res.data.code === 'SU') {
        setMessage('수정이 완료되었습니다.');
        setUserData(prev => ({
          ...prev,
          nickname: form.nickname,
        }));
        setForm(prev => ({
          ...prev,
          afterPassword: '',
          beforePassword: '',
        }));
      }
    } catch (err) {
      const res = err.response;
      setMessage(res?.data?.message || '요청 처리 중 오류가 발생했습니다.');
    }
  };

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

  const openModal = (type, petName) => {
    setModalType(type);
    setSelectedPetName(petName);
  };

  const handleConfirm = async () => {
    if (modalType === 'leave') {
      await handleLeavePet(selectedPetName);
    } else if (modalType === 'delete') {
      await handleDeletePet(selectedPetName);
    }
    setModalType(null);
    setSelectedPetName('');
  };

  const handleCancel = () => {
    setModalType(null);
    setSelectedPetName('');
  };

  const handleLogoutClick = () => {
    setIsLogoutModalOpen(true);
  };

  const confirmLogout = () => {
    localStorage.removeItem('auth');
    window.location.href = '/login';
  };

  const cancelLogout = () => {
    setIsLogoutModalOpen(false);
  };

  return (
    <div className="mypage-wrapper">
      <div className="mypage-container">
        {/* 유저 정보 카드 */}
        <div className="profile-card">
          <img
            src={selectedIcon}
            alt="Profile Icon"
            className="w-40 h-40 rounded-full mb-4 object-cover border-4 border-gray-300"
          />
          <div className="grid grid-cols-4 gap-2 sm:grid-cols-5 md:grid-cols-6 mb-2">
            {PROFILE_ICONS.map(icon => (
              <img
                key={icon}
                src={icon}
                alt="선택 아이콘"
                onClick={() => handleIconSelect(icon)}
                className={`w-12 h-12 rounded-full cursor-pointer border-2 transition-all duration-200 ${
                  selectedIcon === icon
                    ? 'border-plog-main5 scale-110'
                    : 'border-gray-300'
                }`}
              />
            ))}
          </div>
          <button
            onClick={handleIconSave}
            className="bg-plog-main5 text-white py-1 px-3 rounded-md mb-4"
          >
            아이콘 저장
          </button>
          <br />
          <label>이메일</label>
          <input
            name="email"
            type="email"
            value={userData.email}
            readOnly
            className="w-full border p-2 rounded-md mb-2 bg-gray-100 text-gray-500 cursor-not-allowed"
          />

          <label>닉네임</label>
          <input
            name="nickname"
            value={form.nickname}
            onChange={handleChange}
            className="w-full border p-2 rounded-md mb-2"
          />

          <label>현재 비밀번호</label>
          <div className="relative w-full mb-2">
            <input
              name="beforePassword"
              type={showCurrentPassword ? 'text' : 'password'}
              value={form.beforePassword}
              onChange={handleChange}
              className="w-full border p-2 rounded-md pr-10"
            />
            <span
              className="absolute top-1/2 right-3 transform -translate-y-1/2 cursor-pointer text-gray-500"
              onClick={() => setShowCurrentPassword(prev => !prev)}
            >
              <FontAwesomeIcon
                icon={showCurrentPassword ? faEyeSlash : faEye}
              />
            </span>
          </div>

          <label>새 비밀번호</label>
          <div className="relative w-full mb-2">
            <input
              name="afterPassword"
              type={showNewPassword ? 'text' : 'password'}
              value={form.afterPassword}
              onChange={handleChange}
              className="w-full border p-2 rounded-md pr-10"
            />
            <span
              className="absolute top-1/2 right-3 transform -translate-y-1/2 cursor-pointer text-gray-500"
              onClick={() => setShowNewPassword(prev => !prev)}
            >
              <FontAwesomeIcon icon={showNewPassword ? faEyeSlash : faEye} />
            </span>
          </div>

          {message && (
            <p className="text-red-500 text-sm mt-1 whitespace-pre-wrap text-center">
              {message}
            </p>
          )}

          <button
            onClick={handleSubmit}
            className="bg-plog-main5 text-white py-2 px-4 rounded-md mt-4"
          >
            수정하기
          </button>
        </div>

        {/* 반려동물 카드 */}
        <div className="pet-card">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-plog-main4 text-3xl font-bold">
              나의 반려동물
            </h3>
            <button
              className="bg-plog-main5 text-white py-1 px-3 rounded-md"
              onClick={() => navigate('/chooseProfile')}
            >
              추가하기
            </button>
          </div>

          {petList.length === 0 ? (
            <p className="text-gray-500">등록된 반려동물이 없습니다.</p>
          ) : (
            <div className="grid grid-cols-2 gap-4">
              {petList.map(pet => (
                <div key={pet.petId} className="flex flex-col items-center">
                  <img
                    src={pet.petImageUrl || '/images/default-pet.png'}
                    alt={pet.petName || '반려동물'}
                    className="w-24 h-24 rounded-full object-cover mb-2"
                  />
                  <span className="bg-plog-main1 text-gray-700 px-2 py-1 rounded mb-1">
                    {pet.petName || '이름 없음'}
                  </span>
                  <div className="flex gap-2">
                    <button
                      onClick={() => openModal('leave', pet.petName)}
                      className="bg-yellow-500 text-white py-1 px-2 rounded-md text-sm hover:bg-yellow-600"
                    >
                      가족에서 빠지기
                    </button>
                    <button
                      onClick={() => openModal('delete', pet.petName)}
                      className="bg-red-500 text-white py-1 px-2 rounded-md text-sm hover:bg-red-600"
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

      <button onClick={handleLogoutClick} className="logout-button mt-8">
        로그아웃
      </button>

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

      {/* 🆕 가족/삭제 모달 */}
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
    </div>
  );
}
