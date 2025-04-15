import { useEffect, useState } from 'react';
import axios from 'axios';
import AcceptModal from '../components/Modal/Accept';

export default function RequestList() {
  const [requests, setRequests] = useState([]);
  const [selectedRequestId, setSelectedRequestId] = useState(null);

  // 요청 목록
  useEffect(() => {
    const fetchRequests = async () => {
      try {
        const token = JSON.parse(localStorage.getItem('auth'))?.token;

        const res = await axios.get(
          `${process.env.REACT_APP_API_SERVER}/request/pending`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          },
        );

        if (res.data.code === 'SU') {
          setRequests(res.data.data);
        } else {
          console.error('요청 목록 불러오기 실패:', res.data.message);
        }
      } catch (error) {
        console.error('요청 목록 API 에러:', error);
      }
    };

    fetchRequests();
  }, []);

  // 수락/거절 후 상태 업데이트
  const handleResult = (requestId, result) => {
    setRequests(prev =>
      prev.map(req =>
        req.requestId === requestId
          ? { ...req, status: result === 'accepted' ? 'accepted' : 'rejected' }
          : req,
      ),
    );
  };

  return (
    <div className="pt-20 w-[90%] max-w-[1200px] mx-auto">
      <div className="bg-white border rounded-xl shadow p-6">
        <h2 className="text-3xl font-bold text-plog-main4 mb-6 text-center">
          대기 중인 요청 목록
        </h2>

        {requests.filter(req => req.status === 'pending').length === 0 ? (
          <p className="text-gray-500 text-center">
            현재 대기 중인 요청이 없습니다.
          </p>
        ) : (
          <ul className="space-y-3">
            {requests
              .filter(req => req.status === 'pending')
              .map(req => (
                <li
                  key={req.requestId}
                  className="flex items-center justify-between bg-[#fefaf6] p-4 rounded-xl shadow-sm hover:shadow-md transition-shadow duration-200 cursor-pointer"
                  onClick={() => setSelectedRequestId(req.requestId)}
                >
                  <div className="text-gray-800">
                    <span className="text-sm text-gray-500 mr-2">
                      [{req.type === 'invite' ? '초대' : '등록'}]
                    </span>
                    <strong className="text-plog-main4">
                      {req.requesterNick}
                    </strong>{' '}
                    님의
                    <span className="ml-1 font-semibold">
                      {req.petName}
                    </span>{' '}
                    요청
                  </div>
                </li>
              ))}
          </ul>
        )}

        {selectedRequestId && (
          <AcceptModal
            requestId={selectedRequestId}
            onClose={() => setSelectedRequestId(null)}
            onResult={result => handleResult(selectedRequestId, result)}
          />
        )}
      </div>
    </div>
  );
}
