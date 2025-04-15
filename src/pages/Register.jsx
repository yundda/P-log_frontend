import { useForm } from 'react-hook-form';
import '../style/register.scss';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { useState } from 'react';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEye, faEyeSlash } from '@fortawesome/free-solid-svg-icons';

const API = process.env.REACT_APP_API_SERVER;

export default function Register() {
  const navigate = useNavigate();
  const [apiError, setApiError] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showPasswordConfirm, setShowPasswordConfirm] = useState(false);
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm({ mode: 'onChange' });

  const password = watch('password');

  const onSubmit = async data => {
    try {
      const response = await axios.post(`${API}/auth/signup`, data);
      if (response.data.code === 'SU') {
        alert(`${data.nickname}님! 회원가입 성공하셨습니다🥳`);
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
  };

  return (
    <div className="register-container">
      <h3 className="title">회원가입</h3>
      <div className="register-card">
        <img src="/images/img1.png" alt="사진" className="img" />
        <form className="register-form" onSubmit={handleSubmit(onSubmit)}>
          <label htmlFor="email">이메일:</label>
          <input
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
          {errors.email && <p className="error-msg">{errors.email.message}</p>}

          <label htmlFor="nickname">닉네임:</label>
          <input
            type="text"
            placeholder="닉네임을 입력해주세요"
            {...register('nickname', {
              required: '닉네임을 입력해주세요.',
            })}
          />
          {errors.nickname && (
            <p className="error-msg">{errors.nickname.message}</p>
          )}

          <div className="password-wrapper">
            <label htmlFor="password">비밀번호:</label>
            <div className="password-field">
              <input
                type={showPassword ? 'text' : 'password'}
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

          <div className="password-wrapper">
            <label htmlFor="passwordConfirm">비밀번호 확인:</label>
            <div className="password-field">
              <input
                type={showPasswordConfirm ? 'text' : 'password'}
                placeholder="비밀번호를 다시 입력해주세요"
                {...register('passwordConfirm', {
                  required: '비밀번호 확인을 입력해주세요.',
                  validate: value =>
                    value === password || '비밀번호가 일치하지 않습니다.',
                })}
              />
              <span
                className="toggle-visibility"
                onClick={() => setShowPasswordConfirm(prev => !prev)}
              >
                <FontAwesomeIcon
                  icon={showPasswordConfirm ? faEyeSlash : faEye}
                />
              </span>
            </div>
            {errors.passwordConfirm && (
              <p className="error-msg">{errors.passwordConfirm.message}</p>
            )}
          </div>

          {apiError && <p className="error-msg">{apiError}</p>}

          <button type="submit">회원가입</button>

          <div className="login-link">
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
