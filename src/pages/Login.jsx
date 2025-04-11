import { useForm } from 'react-hook-form';
import axios from 'axios';
import { useState } from 'react';
import '../style/login.scss';
import { useSetRecoilState } from 'recoil';
import { authState } from '../recoil/authAtom';

export default function Login() {
  const setAuthState = useSetRecoilState(authState);
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();
  const [serverError, setServerError] = useState('');

  const onSubmit = async data => {
    console.log('로그인 시도:', data);
    setServerError('');
    try {
      const response = await axios.post(
        `${process.env.REACT_APP_API_SERVER}/auth/login`,
        data,
        {
          headers: {
            'Content-Type': 'application/json',
          },
        },
      );

      if (response.data.code === 'SU') {
        const { nickname, token } = response.data.data;
        const newAuth = {
          isLoggedIn: true,
          nickname,
          token,
        };
        localStorage.setItem('auth', JSON.stringify(newAuth));
        setAuthState(newAuth);
        alert(`${nickname}님, 환영합니다!`);
        window.location.href = '/ChooseProfile';
        console.log('로그인 성공:', response.data);
      }
    } catch (error) {
      if (error.response) {
        const { code, message } = error.response.data;
        if (code === 'NF') {
          setServerError(message);
        } else if (code === 'DBE') {
          setServerError('서버 오류로 로그인에 실패했습니다.');
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

          <label htmlFor="password">비밀번호:</label>
          <input
            type="password"
            id="password"
            {...register('password', { required: '비밀번호를 입력해주세요.' })}
          />
          {errors.password && (
            <p className="error-msg">{errors.password.message}</p>
          )}

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
