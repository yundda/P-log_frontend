import { useEffect, useState } from 'react';
import axios from '../../api/axiosInterceptor';
import '../../style/accept.scss';

const API = process.env.REACT_APP_API_SERVER;

export default function AcceptModal({ requestId, onClose, onResult }) {
  const [requestInfo, setRequestInfo] = useState(null);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [isProcessing, setIsProcessing] = useState(false); // 중복 방지

  useEffect(() => {
    const fetchRequestInfo = async () => {
      setIsLoading(true);
      try {
        console.log('[요청 정보 조회 시작]', requestId);
        const response = await axios.get(`${API}/request/pending/${requestId}`);
        console.log('[요청 정보 조회 응답]', response.data);

        if (response.data.code === 'SU') {
          setRequestInfo(response.data.data);
        }
      } catch (err) {
        console.error('[요청 정보 조회 오류]', err);
        if (err.response) {
          const { code, message } = err.response.data;
          console.error('[에러 응답]', { code, message });

          if (code === 'NF') setError('요청 정보를 찾을 수 없습니다.');
          else if (code === 'FB') setError('요청에 대한 접근 권한이 없습니다.');
          else setError(message || '알 수 없는 오류입니다.');
        } else {
          setError('요청 정보를 불러오는 중 문제가 발생했습니다.');
        }
      } finally {
        setIsLoading(false);
      }
    };

    if (requestId) fetchRequestInfo();
  }, [requestId]);

  const handleAccept = async () => {
    if (isProcessing) return;
    setIsProcessing(true);
    try {
      console.log('[요청 수락 시도]', requestId);
      const response = await axios.get(`${API}/request/accept/${requestId}`);
      console.log('[요청 수락 응답]', response.data);

      if (response.data.code === 'SU') {
        alert('요청을 수락했습니다.');
        onResult?.('accepted');
        onClose();
      }
    } catch (err) {
      console.error('[수락 오류]', err);
      handleError(err);
    } finally {
      setIsProcessing(false);
    }
  };

  const handleReject = async () => {
    if (isProcessing) return;
    setIsProcessing(true);
    try {
      console.log('[요청 거절 시도]', requestId);
      const response = await axios.get(`${API}/request/reject/${requestId}`);
      console.log('[요청 거절 응답]', response.data);

      if (response.data.code === 'SU') {
        alert('요청을 거절했습니다.');
        onResult?.('rejected');
        onClose();
      }
    } catch (err) {
      console.error('[거절 오류]', err);
      handleError(err);
    } finally {
      setIsProcessing(false);
    }
  };

  const handleError = err => {
    if (err.response) {
      const { code, message } = err.response.data;
      console.error('[처리 중 에러 응답]', { code, message });

      if (code === 'NF') alert('요청을 찾을 수 없습니다.');
      else if (code === 'FB') alert('접근 권한이 없습니다.');
      else if (code === 'BR') alert('이미 처리된 요청입니다.');
      else alert('요청 처리 중 오류가 발생했습니다.');
    } else {
      console.error('[서버 응답 없음 또는 네트워크 오류]', err);
      alert('요청 처리에 실패했습니다.');
    }
  };

  axios.interceptors.request.use(config => {
    console.log('[요청 헤더]', config.headers); // 여기에 Authorization 헤더 출력됨
    return config;
  });

  if (isLoading) {
    return (
      <div className="accept-modal fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
        <div className="accept-card bg-white p-6 rounded-lg shadow-md text-center max-w-md w-full">
          <div className="text-gray-500">로딩 중...</div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="accept-modal fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
        <div className="accept-card bg-white p-6 rounded-lg shadow-md text-center max-w-md w-full">
          <p className="text-red-500 text-lg mb-4">{error}</p>
          <button onClick={onClose} className="bg-gray-300 px-4 py-2 rounded">
            닫기
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="accept-modal fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
      <div className="accept-card bg-white p-6 rounded-lg shadow-md text-center max-w-md w-full">
        <img
          src="/images/user.png"
          alt="user-profile"
          className="w-24 h-24 rounded-full mx-auto mb-4"
        />
        <h2 className="text-xl font-bold mb-2">
          <span className="text-plog-main4">{requestInfo.requesterNick}</span>
          님이
          <br />
          <span className="font-bold">{requestInfo.petName}</span>의 가족으로
          초대했습니다.
        </h2>
        <div className="flex justify-center gap-4 mt-4">
          <button
            className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600 disabled:opacity-50"
            onClick={handleAccept}
            disabled={isProcessing}
          >
            {isProcessing ? '처리 중...' : '수락'}
          </button>
          <button
            className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600 disabled:opacity-50"
            onClick={handleReject}
            disabled={isProcessing}
          >
            {isProcessing ? '처리 중...' : '거절'}
          </button>
        </div>
        <button
          onClick={onClose}
          className="mt-4 text-gray-500 hover:underline text-sm"
        >
          닫기
        </button>
      </div>
    </div>
  );
}
