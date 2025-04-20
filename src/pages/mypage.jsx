import { useEffect, useState } from 'react';
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
  const [userData, setUserData] = useState({ nickname: '', email: '' });
  const [form, setForm] = useState({
    nickname: '',
    beforePassword: '',
    afterPassword: '',
  });
  const [message, setMessage] = useState('');
  const [selectedIcon, setSelectedIcon] = useState('');
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [isLogoutModalOpen, setIsLogoutModalOpen] = useState(false);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const res = await api.get('/user/mypage');
        if (res.data.code === 'SU') {
          const { nickname, email, profileImage } = res.data.data;
          setUserData({ nickname, email });
          setForm(prev => ({ ...prev, nickname }));

          const iconUrl = `/images/${profileImage}.png`;
          setSelectedIcon(iconUrl);
          localStorage.setItem('profileIcon', iconUrl);
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

  const handleChange = e => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
  };

  const handleIconSelect = icon => {
    setSelectedIcon(icon);
  };

  const handleIconUpdate = async () => {
    const iconFileName = selectedIcon.split('/').pop(); // profile12.png
    const profileName = iconFileName.split('.')[0]; // profile12

    try {
      const res = await api.patch(`/user/updateProfile/${profileName}`);
      if (res.data.code === 'SU') {
        localStorage.setItem('profileIcon', selectedIcon);
        alert('프로필 아이콘이 수정되었습니다!');
      } else {
        setMessage(res.data.message || '프로필 이미지 저장에 실패했습니다.');
      }
    } catch (err) {
      const res = err.response;
      if (res?.status === 403) {
        setMessage('접근 권한이 없습니다. 로그인 상태를 확인해주세요.');
      } else if (res?.status === 404) {
        setMessage('사용자 정보를 찾을 수 없습니다.');
      } else if (res?.status === 500) {
        setMessage('서버 오류로 프로필 이미지 변경에 실패했습니다.');
      } else {
        setMessage(res?.data?.message || '알 수 없는 오류가 발생했습니다.');
      }
    }
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
        setUserData(prev => ({ ...prev, nickname: form.nickname }));
        setForm(prev => ({ ...prev, beforePassword: '', afterPassword: '' }));
      }
    } catch (err) {
      const res = err.response;
      setMessage(res?.data?.message || '요청 처리 중 오류가 발생했습니다.');
    }
  };

  const handleLogoutClick = () => setIsLogoutModalOpen(true);
  const confirmLogout = () => {
    localStorage.removeItem('auth');
    window.location.href = '/login';
  };
  const cancelLogout = () => setIsLogoutModalOpen(false);

  return (
    <div className="mypage-wrapper">
      <div className="mypage-container">
        <div className="profile-card">
          <div className="flex justify-center mb-4">
            {selectedIcon && (
              <img
                src={selectedIcon}
                alt="Profile Icon"
                className="w-40 h-40 rounded-full object-cover border-4 border-gray-300"
              />
            )}
          </div>

          <div className="icon-scroll flex overflow-x-auto gap-2 mb-4 px-2">
            {PROFILE_ICONS.map(icon => (
              <img
                key={icon}
                src={icon}
                alt="선택 아이콘"
                onClick={() => handleIconSelect(icon)}
                className={`w-12 h-12 rounded-full cursor-pointer border-2 transition-transform duration-200 ${
                  selectedIcon === icon
                    ? 'border-plog-main5 scale-110'
                    : 'border-gray-300'
                }`}
              />
            ))}
          </div>

          <div className="icon-save-button-wrapper">
            <button
              onClick={handleIconUpdate}
              className="bg-plog-main5 text-white py-1 px-3 rounded-md"
            >
              아이콘 수정
            </button>
          </div>

          {/* 이메일 */}
          <div className="input-row flex flex-col sm:flex-row sm:items-center mb-2">
            <label className="w-full sm:w-24 text-sm font-medium mb-1 sm:mb-0 sm:text-right">
              이메일
            </label>
            <div className="w-full sm:w-1/2">
              <input
                name="email"
                type="email"
                value={userData.email}
                readOnly
                className="w-full border p-2 rounded-md bg-gray-100 text-gray-500 cursor-not-allowed"
              />
            </div>
          </div>

          {/* 닉네임 */}
          <div className="input-row flex flex-col sm:flex-row sm:items-center mb-2">
            <label className="w-full sm:w-24 text-sm font-medium mb-1 sm:mb-0 sm:text-right">
              닉네임
            </label>
            <div className="w-full sm:w-1/2">
              <input
                name="nickname"
                value={form.nickname}
                onChange={handleChange}
                className="w-full border p-2 rounded-md"
              />
            </div>
          </div>

          {/* 현재 비밀번호 */}
          <div className="input-row flex flex-col sm:flex-row sm:items-center mb-2">
            <label className="w-full sm:w-24 text-sm font-medium mb-1 sm:mb-0 sm:text-right">
              현재 비밀번호
            </label>
            <div className="relative w-full sm:w-1/2">
              <input
                name="beforePassword"
                type={showCurrentPassword ? 'text' : 'password'}
                value={form.beforePassword}
                onChange={handleChange}
                className="w-full border border-gray-300 rounded-md p-2 pr-10"
              />
              <span
                onClick={() => setShowCurrentPassword(prev => !prev)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 cursor-pointer"
              >
                <FontAwesomeIcon
                  icon={showCurrentPassword ? faEyeSlash : faEye}
                />
              </span>
            </div>
          </div>

          {/* 새 비밀번호 */}
          <div className="input-row flex flex-col sm:flex-row sm:items-center mb-2">
            <label className="w-full sm:w-24 text-sm font-medium mb-1 sm:mb-0 sm:text-right">
              새 비밀번호
            </label>
            <div className="relative w-full sm:w-1/2">
              <input
                name="afterPassword"
                type={showNewPassword ? 'text' : 'password'}
                value={form.afterPassword}
                onChange={handleChange}
                className="w-full border border-gray-300 rounded-md p-2 pr-10"
              />
              <span
                onClick={() => setShowNewPassword(prev => !prev)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 cursor-pointer"
              >
                <FontAwesomeIcon icon={showNewPassword ? faEyeSlash : faEye} />
              </span>
            </div>
          </div>

          {message && (
            <p className="text-red-500 text-sm mt-1 whitespace-pre-wrap text-center">
              {message}
            </p>
          )}

          <button
            onClick={handleSubmit}
            className="submit-button bg-plog-main5 text-white py-2 px-4 rounded-md mt-4"
          >
            수정하기
          </button>
        </div>
      </div>

      <button onClick={handleLogoutClick} className="logout-button mt-8">
        로그아웃
      </button>

      {/* 로그아웃 모달 */}
      {/* {isLogoutModalOpen && (
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
      )} */}
    </div>
  );
}
