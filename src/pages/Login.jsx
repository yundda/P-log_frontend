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
    console.log('[로그인 요청 데이터]', data);

    try {
      const response = await api.post(`${API}/auth/login`, data);
      console.log('[로그인 응답]', response.data);

      if (response.data.code === 'SU') {
        const { nickname, token, requestId } = response.data.data;
        const newAuth = {
          isLoggedIn: true,
          nickname,
          token,
        };

        localStorage.setItem('auth', JSON.stringify(newAuth));
        console.log('[로컬스토리지 저장된 auth]', newAuth);

        setAuthState(newAuth);
        alert(`${nickname}님, 환영합니다!`);

        if (requestId !== undefined && requestId !== null) {
          console.log('[요청 ID 있음] → 초대 요청 대기 화면 이동:', requestId);
          window.location.href = `/request/pending/${requestId}`;
        } else {
          console.log('[요청 ID 없음] → ChooseProfile로 이동');
          window.location.href = '/ChooseProfile';
        }
      } else {
        console.warn('[로그인 실패 응답]', response.data);
      }
    } catch (error) {
      console.error('[로그인 에러]', error);

      if (error.response) {
        const { code, message } = error.response.data;
        console.error('[에러 응답 코드]', code);
        console.error('[에러 응답 메시지]', message);

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
          {/* 이메일 */}
          <label htmlFor="email">이메일:</label>
          <input
            type="email"
            id="email"
            {...register('email', { required: '이메일을 입력해주세요.' })}
          />
          {errors.email && <p className="error-msg">{errors.email.message}</p>}

          {/* 비밀번호 */}
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

          {/* 서버 에러 메시지 */}
          {serverError && <p className="error-msg">{serverError}</p>}

          <div className="find-pw">
            <a href="/find-password">비밀번호 찾기</a>
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
    </div>
  );
}
