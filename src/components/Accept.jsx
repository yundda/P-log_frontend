import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';
import '../style/accept.scss';

const API = process.env.REACT_APP_API_SERVER;

export default function Accept() {
  const { requestId } = useParams();
  const navigate = useNavigate();
  const [requestInfo, setRequestInfo] = useState(null);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchRequestInfo = async () => {
      try {
        const response = await axios.get(
          `${API}}/auth/requestInfo/${requestId}`,
        );
        console.log('요청 정보 응답:', response.data);
        if (response.data.code === 'SU') {
          setRequestInfo(response.data.data);
        }
      } catch (err) {
        console.error(' 요청 정보 에러:', err);
        if (err.response) {
          const { code, message } = err.response.data;
          if (code === 'NF') setError('요청 정보를 찾을 수 없습니다.');
          else if (code === 'FB') setError('요청에 대한 접근 권한이 없습니다.');
          else setError(message);
        } else {
          setError('요청 정보를 불러오는 중 문제가 발생했습니다.');
        }
      }
    };

    fetchRequestInfo();
  }, [requestId]);

  const handleAccept = async () => {
    try {
      const response = await axios.get(`${API}/request/accept/${requestId}`);
      console.log(' 요청 수락 응답:', response.data);
      if (response.data.code === 'SU') {
        alert('요청을 수락했습니다.');
        navigate('/'); // 필요한 경우 리다이렉트 경로 수정
      }
    } catch (err) {
      console.error(' 요청 수락 에러:', err);
      if (err.response) {
        const { code } = err.response.data;
        if (code === 'NF') alert('요청을 찾을 수 없습니다.');
        else if (code === 'FB') alert('접근 권한이 없습니다.');
        else if (code === 'BR') alert('이미 처리된 요청입니다.');
        else alert('요청 처리 중 오류가 발생했습니다.');
      } else {
        alert('요청 처리에 실패했습니다.');
      }
    }
  };

  if (error) {
    return (
      <div className="accept-wrapper flex items-center justify-center min-h-screen">
        <div className="text-red-500 text-xl">{error}</div>
      </div>
    );
  }

  if (!requestInfo) {
    return (
      <div className="accept-wrapper flex items-center justify-center min-h-screen">
        <div className="text-gray-500 text-lg">로딩 중...</div>
      </div>
    );
  }

  return (
    <div className="accept-wrapper flex flex-col items-center justify-center min-h-screen">
      <div className="accept-card border border-plog-main4 bg-white rounded-lg p-10 flex flex-col items-center gap-4">
        <img
          src="/images/user.png"
          alt="user-profile"
          className="user-profile w-32 h-32 rounded-full object-cover"
        />
        <h3 className="accept-alert text-2xl font-semibold text-center">
          <span className="font-bold">{requestInfo.requesterNick}</span>님이
          <br />
          초대하였습니다. 참여하시겠습니까?
        </h3>

        <div className="flex items-center gap-2 mt-2">
          <img
            src="/images/img1.png"
            alt="pet-profile"
            className="w-10 h-10 rounded-full object-cover"
          />
          <h3 className="text-xl font-bold text-color-4">
            {requestInfo.petName}
          </h3>
        </div>

        <button
          className="accept-button mt-4 bg-plog-main4 text-white px-6 py-2 rounded hover:bg-plog-main3 transition"
          onClick={handleAccept}
        >
          초대 수락
        </button>
      </div>
    </div>
  );
}
