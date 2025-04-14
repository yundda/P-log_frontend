import { useState } from 'react';
import { mockRequestList } from './mockRequestData';
import AcceptModal from '../components/Accept';

export default function RequestList() {
  const [selectedRequestId, setSelectedRequestId] = useState(null);
  const [requests, setRequests] = useState(mockRequestList);

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
    <div className="request-list-wrapper p-4">
      <h2 className="text-xl font-bold mb-4">대기 중인 요청 목록</h2>

      {requests.filter(req => req.status === 'pending').length === 0 ? (
        <p className="text-gray-500">현재 대기 중인 요청이 없습니다.</p>
      ) : (
        <ul className="request-list space-y-3">
          {requests
            .filter(req => req.status === 'pending')
            .map(req => (
              <li
                key={req.requestId}
                className="flex items-center justify-between bg-white p-3 rounded shadow hover:bg-gray-50 cursor-pointer"
                onClick={() => setSelectedRequestId(req.requestId)}
              >
                <div>
                  <span className="text-sm text-gray-500 mr-2">
                    [{req.type === 'invite' ? '초대' : '등록'}]
                  </span>
                  <strong className="text-plog-main4">
                    {req.requesterNick}
                  </strong>
                  님의
                  <span className="ml-1 font-semibold">{req.petName}</span> 요청
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
  );
}
