import axios from 'axios';

const API = process.env.REACT_APP_API_SERVER;

const instance = axios.create({
  baseURL: API,
  headers: {
    'Content-Type': 'application/json',
  },
});

//토큰 꺼내서 헤더에 추가
instance.interceptors.request.use(
  config => {
    const storedAuth = localStorage.getItem('auth');
    console.log('[Interceptor] auth 내용:', storedAuth);
    if (storedAuth) {
      try {
        const { token } = JSON.parse(storedAuth);
        if (token) {
          config.headers.Authorization = `Bearer ${token}`;
          console.log(
            '[Interceptor] Authorization 설정됨:',
            config.headers.Authorization,
          );
        }
      } catch (e) {
        console.warn('[Interceptor] JSON 파싱 오류', e);
      }
    }
    return config;
  },
  error => Promise.reject(error),
);

//401이면 자동 로그아웃 처리
instance.interceptors.response.use(
  response => response,
  error => {
    if (error.response?.status === 401) {
      localStorage.removeItem('auth');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  },
);

export default instance;
