import { useForm } from 'react-hook-form';
import { useState } from 'react';
import { useSetRecoilState } from 'recoil';
import { authState } from '../recoil/authAtom';
import api from '../api/axiosInterceptor'; // axios interceptor
import '../style/login.scss';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEye, faEyeSlash } from '@fortawesome/free-solid-svg-icons';

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
        alert(`${nickname}님, 환영합니다!`);

        if (requestId !== undefined && requestId !== null) {
          window.location.href = `/request/pending/${requestId}`;
        } else {
          window.location.href = '/ChooseProfile';
        }
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

  return (
    <div className="login-container">
      <h3 className="title">로그인</h3>
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
            <a href="/find-password">비밀번호 찾기</a>
          </div>

          <button type="submit">로그인</button>

          <div className="register-link">
            아직 계정이 없나요? <a href="/register">회원가입</a>
          </div>
        </form>
      </div>
    </div>
  );
}
