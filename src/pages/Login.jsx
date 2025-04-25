import { useForm } from 'react-hook-form';
import { useEffect, useState } from 'react';
import { useSetRecoilState } from 'recoil';
import { authState } from '../recoil/authAtom';
import { motion, AnimatePresence } from 'framer-motion';
import api from '../api/axiosInterceptor'; // axios interceptor
import '../style/login.scss';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEye, faEyeSlash } from '@fortawesome/free-solid-svg-icons';
import Developing from '../components/Modal/Developing';

const API = process.env.REACT_APP_API_SERVER;

export default function Login() {
  const setAuthState = useSetRecoilState(authState);
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const [serverError, setServerError] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [loggedInNickname, setLoggedInNickname] = useState('');
  const [redirectRequestId, setRedirectRequestId] = useState(null);
  const [showDeveloping, setShowDeveloping] = useState(false);

  const onSubmit = async data => {
    setServerError('');
    try {
      const response = await api.post(`${API}/auth/login`, data);
      if (response.data.code === 'SU') {
        const { nickname, token, requestId } = response.data.data;
        const newAuth = {
          isLoggedIn: true,
          nickname,
          token,
        };
        localStorage.setItem('auth', JSON.stringify(newAuth));
        setAuthState(newAuth);
        setLoggedInNickname(nickname);
        setRedirectRequestId(requestId ?? null);
        setShowModal(true);
      }
    } catch (error) {
      if (error.response) {
        const { code, message } = error.response.data;
        if (code === 'NF' || code === 'BR' || code === 'DBE') {
          setServerError(message);
        }
      } else {
        setServerError('네트워크 오류가 발생했습니다.');
      }
    }
  };

  const handleCloseModal = () => {
    setShowModal(false);
    if (redirectRequestId !== null) {
      window.location.href = `/request/pending/${redirectRequestId}`;
    } else {
      window.location.href = '/ChooseProfile';
    }
  };

  return (
    <div className="login-container">
      <h3 className="title-login text-plog-main4">로그인</h3>
      <div className="login-card">
        <img src="/images/img1.png" alt="사진" className="img" />
        <form className="login-form" onSubmit={handleSubmit(onSubmit)}>
          <label htmlFor="email">이메일:</label>
          <input
            type="email"
            id="email"
            {...register('email', { required: '이메일을 입력해주세요.' })}
          />
          {errors.email && <p className="error-msg">{errors.email.message}</p>}

          <div className="password-wrapper">
            <label htmlFor="password">비밀번호:</label>
            <div className="password-field">
              <input
                type={showPassword ? 'text' : 'password'}
                id="password"
                {...register('password', {
                  required: '비밀번호를 입력해주세요.',
                })}
              />
              <span
                className="toggle-visibility"
                onClick={() => setShowPassword(prev => !prev)}
              >
                <FontAwesomeIcon icon={showPassword ? faEyeSlash : faEye} />
              </span>
            </div>
            {errors.password && (
              <p className="error-msg">{errors.password.message}</p>
            )}
          </div>

          {serverError && <p className="error-msg">{serverError}</p>}

          <div className="find-pw">
            <span
              className="text-blue-500 cursor-pointer"
              onClick={() => setShowDeveloping(true)}
            >
              비밀번호 찾기
            </span>
          </div>

          <button type="submit">로그인</button>

          <div className="register-link">
            아직 계정이 없나요?{' '}
            <a
              href="/register"
              className="text-plog-main4 font-medium underline"
            >
              회원가입
            </a>
          </div>
        </form>
      </div>

      {showModal && (
        <WelcomeModal nickname={loggedInNickname} onClose={handleCloseModal} />
      )}

      {showDeveloping && (
        <Developing onClose={() => setShowDeveloping(false)} />
      )}
    </div>
  );
}

function WelcomeModal({ nickname, onClose }) {
  const [progress, setProgress] = useState(100);
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    const interval = setInterval(() => {
      setProgress(prev => {
        if (prev <= 0) {
          clearInterval(interval);
          return 0;
        }
        return prev - 1;
      });
    }, 5);

    const timer = setTimeout(() => {
      setVisible(false); // 트리거: 페이드아웃
    }, 1000);

    return () => {
      clearTimeout(timer);
      clearInterval(interval);
    };
  }, []);

  return (
    <AnimatePresence onExitComplete={onClose}>
      {visible && (
        <motion.div
          className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <motion.div
            className="bg-white rounded-xl shadow-lg w-[90%] max-w-xs p-6 text-center"
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            transition={{ duration: 0.3 }}
          >
            <p className="text-lg mb-4">
              <strong>{nickname}</strong>님, 환영합니다!
            </p>
            <div className="h-2 w-full bg-gray-200 rounded-full overflow-hidden">
              <div
                className="h-full bg-plog-main4 transition-all duration-30 ease-linear"
                style={{ width: `${progress}%` }}
              ></div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
