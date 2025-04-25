import Lottie from 'react-lottie-player';
import lottieJson from '../assets/NotFound404.json';
import '../style/NotFound.scss';

export default function NotFound() {
  return (
    <div className="not-container">
      <div className="content-box">
        <p className="text-lg text-red-500 mb-4">
          앗! 찾으시는 페이지가 길을 잃었어요 🐾
        </p>
        <p className="text-lg text-yellow-800">
          대신 아래 페이지들을 구경해보시는 건 어때요? 😊
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
            onClick={() => (window.location.href = '/')}
          >
            메인 페이지
          </button>
        </div>
      </div>

      <div className="flex justify-center w-1/2">
        <Lottie loop animationData={lottieJson} play className="w-140  h-100" />
      </div>
    </div>
  );
}
