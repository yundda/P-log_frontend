import { useState } from 'react';
import axios from 'axios';
import '../../style/inviteModal.scss';

const API = process.env.REACT_APP_API_SERVER;

export default function InviteModal({ petName, onClose, onSuccess }) {
  const [email, setEmail] = useState('');
  const [responseMsg, setResponseMsg] = useState('');
  const [error, setError] = useState('');
  const [requestId, setRequestId] = useState(null);
  const [isNewUser, setIsNewUser] = useState(false);

  const validateEmail = email => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

  const handleSend = async () => {
    setError('');
    setResponseMsg('');
    setRequestId(null);
    setIsNewUser(false);

    if (!validateEmail(email)) {
      setError('올바른 이메일 형식을 입력해주세요.');
      return;
    }

    try {
      const res = await axios.post(`${API}/request/invite`, {
        familyEmail: email,
        petName,
      });

      const { code, data } = res.data;
      if (code === 'SU') {
        setRequestId(data.requestId);

        const nicknameOrEmail = data.receiverEmail || email;
        onSuccess?.(nicknameOrEmail, data.requestId);

        if (data.receiverEmail) {
          setIsNewUser(true);
          setResponseMsg('가입이 필요합니다. 초대 이메일을 보냈습니다.');
        } else if (data.isAlreadyRequested) {
          setResponseMsg('이미 초대 요청이 대기 중입니다.');
        } else {
          setResponseMsg('초대 요청을 성공적으로 보냈습니다!');
        }
      }
    } catch (err) {
      if (err.response) {
        const { code, message } = err.response.data;
        if (code === 'NF' || code === 'BR') {
          setError(message);
        } else {
          setError('요청 중 오류가 발생했습니다.');
        }
      } else {
        setError('서버에 연결할 수 없습니다.');
      }
    }
  };

  return (
    <div className="invite-modal-overlay fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
      <div className="invite-modal bg-white p-8 rounded-2xl w-[400px] max-w-full flex flex-col gap-5">
        <h2 className="text-2xl font-bold text-center">협업자 초대</h2>
        <input
          type="email"
          placeholder="이메일을 입력하세요"
          value={email}
          onChange={e => setEmail(e.target.value)}
          className="border border-gray-300 rounded-lg p-3 w-full"
        />
        {error && <p className="text-red-500 text-sm">{error}</p>}
        {responseMsg && <p className="text-green-500 text-sm">{responseMsg}</p>}
        {requestId && (
          <p className="text-blue-500 text-sm">
            초대 링크: <br />
            <a
              href={`/request/pending/${requestId}`}
              className="underline"
              target="_blank"
              rel="noopener noreferrer"
            >
              /request/pending/{requestId}
            </a>
          </p>
        )}
        <div className="flex justify-between mt-4">
          <button className="btn-cancel" onClick={onClose}>
            취소
          </button>
          <button className="btn-send" onClick={handleSend}>
            전송
          </button>
        </div>
      </div>
    </div>
  );
}
