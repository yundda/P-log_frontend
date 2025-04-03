import Lottie from 'react-lottie-player';
import lottieJson from '../assets/NotFound404.json';
import '../style/NotFound.scss';

export default function NotFound() {
  return (
    <div className="container">
      <div className="content-box">
        <p className="text-lg text-gray-600 mb-4">
          요청하신 페이지를 찾을 수 없습니다.
        </p>
        <p className="text-lg text-gray-600">
          대신 아래 페이지를 확인해 보세요.
        </p>

        <div className="button-group">
          <button className="button" onClick={() => window.history.back()}>
            이전으로 가기
          </button>
          <button
            className="button"
            onClick={() => (window.location.href = '/login')}
          >
            로그인하기
          </button>
          <button
            className="button"
            onClick={() => (window.location.href = '/register')}
          >
            회원가입하기
          </button>
          <button
            className="button"
            onClick={() => (window.location.href = '/details')}
          >
            상세 페이지
          </button>
        </div>
      </div>

      <div className="flex justify-center w-1/2">
        <Lottie loop animationData={lottieJson} play className="w-140  h-100" />
      </div>
    </div>
  );
}
