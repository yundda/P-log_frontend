import { useForm } from 'react-hook-form';
import '../style/register.scss';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { useState } from 'react';

export default function Register() {
  const navigate = useNavigate();
  const [apiError, setApiError] = useState('');

  const {
    register,
    handleSubmit,
    watch, //input 값 실시간 감지
    formState: { errors },
  } = useForm({
    mode: 'onChange',
  });

  const password = watch('password');

  const onSubmit = async data => {
    try {
      const response = await axios.post(
        `${process.env.REACT_APP_API_SERVER}/auth/signup`,
        data,
      );
      if (response.data.code === 'SU') {
        alert(`${data.nickname}님! 회원가입 성공하셨습니다🥳 `);
        navigate('/login');
      }
    } catch (error) {
      if (error.response && error.response.data) {
        const { code, message } = error.response.data;
        if (code === 'VF' || code === 'DBE') {
          setApiError(message);
        }
      } else {
        setApiError('알 수 없는 오류가 발생했습니다.');
      }
    }
    console.log(data);
  };

  return (
    <div className="register-container flex flex-col items-center px-4 py-10">
      <h3 className="text-3xl font-semibold mb-10">회원가입</h3>
      <div className="register-card flex bg-plog-main2/30 p-10 rounded-xl shadow-md">
        <img
          src="/images/img1.png"
          alt="사진"
          className="img w-64 h-64 object-contain mr-10"
        />
        <form
          className="register-form flex flex-col gap-4"
          onSubmit={handleSubmit(onSubmit)}
        >
          <div className="form-group flex items-center gap-2">
            <label htmlFor="email" className="w-24 text-right font-semibold">
              이메일:
            </label>
            <input
              className="input"
              type="email"
              placeholder="test@email.com"
              {...register('email', {
                required: '이메일을 입력해주세요.',
                pattern: {
                  value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                  message: '이메일 형식이 올바르지 않습니다.',
                },
              })}
            />
            {/* <button type="button" className="btn-small">
              중복확인
            </button> */}
          </div>
          {errors.email && (
            <p className="text-red-500 text-sm text-center">
              {errors.email.message}
            </p>
          )}

          <div className="form-group flex items-center gap-2">
            <label htmlFor="nickname" className="w-24 text-right font-semibold">
              닉네임:
            </label>
            <input
              type="text"
              className="input"
              placeholder="닉네임을 입력해주세요"
              {...register('nickname', {
                required: '닉네임을 입력해주세요.',
              })}
            />
            {/* <button type="button" className="btn-small">
              중복확인
            </button> */}
          </div>
          {errors.nickname && (
            <p className="text-red-500 text-sm text-center">
              {errors.nickname.message}
            </p>
          )}

          <div className="form-group flex items-center gap-2">
            <label htmlFor="password" className="w-24 text-right font-semibold">
              비밀번호:
            </label>
            <input
              type="password"
              className="input"
              placeholder="8자 이상, 문자+숫자 또는 특수문자 조합"
              {...register('password', {
                required: '비밀번호를 입력해주세요.',
                minLength: {
                  value: 8,
                  message: '비밀번호는 최소 8자 이상이어야 합니다.',
                },
                validate: {
                  complexity: value =>
                    (/[A-Za-z]/.test(value) && /[\d!@#$%^&*]/.test(value)) ||
                    '문자 + 숫자/특수문자 조합으로 입력해주세요.',
                },
              })}
            />
          </div>
          {errors.password && (
            <p className="text-red-500 text-sm text-center">
              {errors.password.message}
            </p>
          )}

          <div className="form-group flex items-center gap-2">
            <label
              htmlFor="passwordConfirm"
              className="w-24 text-right font-semibold"
            >
              비밀번호 확인:
            </label>
            <input
              type="password"
              className="input"
              {...register('passwordConfirm', {
                required: '비밀번호 확인을 입력해주세요.',
                validate: value =>
                  value === password || '비밀번호가 일치하지 않습니다.',
              })}
            />
          </div>
          {errors.passwordConfirm && (
            <p className="text-red-500 text-sm text-center">
              {errors.passwordConfirm.message}
            </p>
          )}

          {apiError && (
            <p className="text-red-500 text-sm text-center mt-2">{apiError}</p>
          )}

          <button type="submit" className="btn w-full self-center mt-4">
            회원가입
          </button>
          <div className="login-link text-sm text-center text-gray-700 mt-2">
            이미 계정이 있나요?{' '}
            <a href="/login" className="text-plog-main4 font-medium underline">
              로그인
            </a>
          </div>
        </form>
      </div>
    </div>
  );
}
