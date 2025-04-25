import { useEffect, useState } from 'react';
import api from '../api/axiosInterceptor';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEye, faEyeSlash } from '@fortawesome/free-solid-svg-icons';
import '../style/mypage.scss';
import LoginRequired from '../components/Modal/LoginRequired';
import Alert from '../components/Modal/Alert';

const PROFILE_ICONS = Array.from(
  { length: 13 },
  (_, i) => `/images/profile${i + 1}.png`,
);

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
  // const [isLogoutModalOpen, setIsLogoutModalOpen] = useState(false);
  const [isLogin, setIsLogin] = useState(true);
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [alertMessage, setAlertMessage] = useState('');
  const [showAlert, setShowAlert] = useState(false);

  useEffect(() => {
    const auth = localStorage.getItem('auth');
    if (!auth) {
      setIsLogin(false);
      setShowLoginModal(true);
    }
  }, []);

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

    if (isLogin) fetchUserData();
  }, [isLogin]);

  const handleChange = e => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
  };

  const handleIconSelect = icon => setSelectedIcon(icon);

  const handleIconUpdate = async () => {
    if (!form.beforePassword) {
      openAlert(
        '현재 비밀번호를 입력해야           아이콘을 변경할 수 있습니다.',
      );
      return;
    }

    const iconFileName = selectedIcon.split('/').pop();
    const profileName = iconFileName?.split('.')[0];

    try {
      const res = await api.patch(`/user/update/${profileName}`, {
        beforePassword: form.beforePassword,
      });

      if (res.data.code === 'SU') {
        localStorage.setItem('profileIcon', selectedIcon);
        openAlert('프로필 아이콘이 수정되었습니다!');
      }
    } catch (err) {
      const res = err.response;
      const code = res?.data?.code;
      const msg = res?.data?.message;

      if (code === 'NF') openAlert('해당 사용자를 찾을 수 없습니다.');
      else if (code === 'DBE') openAlert('프로필 이미지 변경 실패 (DB 오류)');
      else openAlert(msg || '알 수 없는 오류가 발생했습니다.');
    }
  };

  const handleSubmit = async () => {
    const { beforePassword, afterPassword, nickname } = form;

    if (!beforePassword) {
      openAlert('현재 비밀번호를 입력해주세요.');
      return;
    }

    if (
      afterPassword &&
      (!/(?=.*[a-zA-Z])(?=.*[0-9])|(?=.*[!@#$%^&*])/.test(afterPassword) ||
        afterPassword.length < 8)
    ) {
      openAlert(
        '새 비밀번호는 영문/숫자/특수문자 중 2가지 이상 조합, 8자 이상이어야 합니다.',
      );
      return;
    }

    if (!afterPassword && nickname === userData.nickname) {
      openAlert('변경할 정보가 없습니다.');
      return;
    }

    if (afterPassword && beforePassword === afterPassword) {
      openAlert('현재 비밀번호와 새 비밀번호가 같습니다.');
      return;
    }

    const payload = { beforePassword };
    if (nickname !== userData.nickname) payload.nickname = nickname;
    if (afterPassword) payload.afterPassword = afterPassword;

    try {
      const res = await api.patch('/user/update', payload);
      if (res.data.code === 'SU') {
        openAlert('수정이 완료되었습니다.');
        setUserData(prev => ({ ...prev, nickname }));
        setForm(prev => ({ ...prev, beforePassword: '', afterPassword: '' }));
      }
    } catch (err) {
      const res = err.response;
      const code = res?.data?.code;
      const msg = res?.data?.message;

      if (code === 'NF') openAlert('해당 사용자를 찾을 수 없습니다.');
      else if (code === 'DBE') openAlert('DB 업데이트에 실패했습니다.');
      else if (code === 'BR') openAlert(msg || '유효성 검사에 실패했습니다.');
      else openAlert(msg || '알 수 없는 오류가 발생했습니다.');
    }
  };

  // const handleLogoutClick = () => setIsLogoutModalOpen(true);
  // const confirmLogout = () => {
  //   localStorage.removeItem('auth');
  //   window.location.href = '/login';
  // };
  // const cancelLogout = () => setIsLogoutModalOpen(false);

  const openAlert = msg => {
    setAlertMessage(msg);
    setShowAlert(true);
  };

  const closeAlert = () => {
    setAlertMessage('');
    setShowAlert(false);
  };
  if (!isLogin && showLoginModal) {
    return <LoginRequired onClose={() => setShowLoginModal(false)} />;
  }

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
          <br />
          <button
            onClick={handleSubmit}
            className="submit-button bg-plog-main5 text-white py-2 px-4 rounded-md mt-4"
          >
            수정하기
          </button>
        </div>
      </div>

      {/* <button onClick={handleLogoutClick} className="logout-button mt-8">
        로그아웃
      </button> */}

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

      {showAlert && <Alert message={alertMessage} onClose={closeAlert} />}
    </div>
  );
}
