import { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

export default function MyPage() {
  const navigate = useNavigate();
  const [userData, setUserData] = useState({
    nickname: '',
    email: '',
  });
  const [form, setForm] = useState({
    nickname: '',
    beforePassword: '',
    afterPassword: '',
  });
  const [message, setMessage] = useState('');

  // 유저 정보 조회
  useEffect(() => {
    axios
      .get('/api/user/mypage', { withCredentials: true })
      .then(res => {
        const { nickname, email } = res.data.data;
        setUserData({ nickname, email });
        setForm(prev => ({ ...prev, nickname }));
      })
      .catch(err => {
        if (err.response?.status === 401) {
          setMessage('인증이 필요합니다.');
        } else if (err.response?.status === 404) {
          setMessage('사용자 정보를 찾을 수 없습니다.');
        }
      });
  }, []);

  const handleChange = e => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
  };

  // 유효성 검사
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

    try {
      const payload = {
        beforePassword: form.beforePassword,
      };
      if (form.nickname !== userData.nickname) payload.nickname = form.nickname;
      if (form.afterPassword) payload.afterPassword = form.afterPassword;

      const res = await axios.patch('/api/user/update', payload, {
        withCredentials: true,
      });

      if (res.data.code === 'SU') {
        setMessage('수정이 완료되었습니다.');
        setUserData(prev => ({
          ...prev,
          nickname: form.nickname,
        }));
        setForm(prev => ({ ...prev, afterPassword: '' }));
      }
    } catch (err) {
      const res = err.response;
      if (res.status === 400) {
        setMessage(res.data.message);
      } else if (res.status === 404) {
        setMessage('사용자를 찾을 수 없습니다.');
      } else {
        setMessage('서버 오류가 발생했습니다.');
      }
    }
  };

  // 로그아웃
  const handleLogout = async () => {
    try {
      await axios.post('/api/user/logout', {}, { withCredentials: true });
      navigate('/');
    } catch (err) {
      setMessage('로그아웃에 실패했습니다. 다시 시도해주세요.');
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen p-8 relative">
      {/* 유저 정보 카드 */}
      <div className="bg-white p-6 border-plog-main4 rounded-xl shadow-lg w-80 flex flex-col">
        <div className="w-40 h-40 rounded-full bg-gray-300 mb-4"></div>
        <button className="bg-plog-main5 text-white w-40 py-2 px-4 rounded-md mb-0">
          사진 수정하기
        </button>

        {/* 이메일 - 읽기 전용 */}
        <label className="text-gray-700 w-full mt-2">이메일</label>
        <input
          name="email"
          type="email"
          value={userData.email}
          readOnly
          className="w-full border p-2 rounded-md mb-2 bg-gray-100 text-gray-500 cursor-not-allowed"
        />

        {/* 닉네임 */}
        <label className="text-gray-700 w-full mt-2">닉네임</label>
        <input
          name="nickname"
          value={form.nickname}
          onChange={handleChange}
          className="w-full border p-2 rounded-md mb-2"
        />

        {/* 현재 비밀번호 */}
        <label className="text-gray-700 w-full">현재 비밀번호</label>
        <input
          name="beforePassword"
          type="password"
          value={form.beforePassword}
          onChange={handleChange}
          className="w-full border p-2 rounded-md mb-2"
        />

        {/* 새 비밀번호 */}
        <label className="text-gray-700 w-full">새 비밀번호</label>
        <input
          name="afterPassword"
          type="password"
          value={form.afterPassword}
          onChange={handleChange}
          className="w-full border p-2 rounded-md mb-2"
        />

        {message && (
          <p className="text-red-500 text-sm mt-1 whitespace-pre-wrap">
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
      <div className="bg-white p-6 border-plog-main4 rounded-xl shadow-lg ml-8 w-[500px]">
        <h3 className="text-plog-main4 text-3xl font-bold mb-4">
          나의 반려동물
        </h3>
        <div className="grid grid-cols-2 gap-4">
          {[1, 2, 3, 4].map(item => (
            <div key={item} className="flex flex-col items-center">
              <div className="w-24 h-24 rounded-full bg-gray-300 mb-2"></div>
              <span className="bg-plog-main1 text-gray-700 px-2 py-1 rounded">
                이름
              </span>
              <button className="bg-plog-main5 text-white py-1 px-3 rounded-md mt-2">
                삭제하기
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* 로그아웃 버튼 */}
      <button
        onClick={handleLogout}
        className="bg-plog-main5 text-white py-2 px-6 rounded-md absolute bottom-10"
      >
        로그아웃
      </button>
    </div>
  );
}
