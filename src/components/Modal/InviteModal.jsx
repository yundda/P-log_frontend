import { useState } from 'react';
import axios from '../../api/axiosInterceptor';
import '../../style/inviteModal.scss';

const API = process.env.REACT_APP_API_SERVER;

export default function InviteModal({ petName, onClose, onSuccess }) {
  const [nick, setNick] = useState('');
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  const [responseMsg, setResponseMsg] = useState('');
  const [requestId, setRequestId] = useState(null);
  const [receiverEmail, setReceiverEmail] = useState('');
  const [isSending, setIsSending] = useState(false);

  const validateEmailFormat = email => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

  const handleSend = async () => {
    setError('');
    setResponseMsg('');

    if (!petName) {
      setError('펫 이름이 없어 초대를 보낼 수 없습니다.');
      return;
    }

    if (!nick && !email) {
      setError('닉네임 또는 이메일 중 하나는 반드시 입력해야 합니다.');
      return;
    }

    if (!nick && email && !validateEmailFormat(email)) {
      setError('올바른 이메일 형식을 입력해주세요.');
      return;
    }

    const payload = {
      familyNick: nick || undefined,
      familyEmail: email || undefined,
      petName,
    };

    try {
      setIsSending(true);
      const token = JSON.parse(localStorage.getItem('auth'))?.token;
      const headers = { Authorization: `Bearer ${token}` };

      const res = await axios.post(`${API}/request/invite`, payload, {
        headers,
      });
      const data = res.data.data;

      setRequestId(data.requestId);
      setReceiverEmail(data.receiverEmail || '');
      setResponseMsg('초대가 성공적으로 전송되었습니다.');

      if (onSuccess) {
        onSuccess(nick || email, data.requestId);
      }
    } catch (err) {
      const { message } = err.response?.data || {};
      setError(message || '초대 요청 실패');
    } finally {
      setIsSending(false);
    }
  };

  const handleGoToSignup = () => {
    if (receiverEmail) {
      window.location.href = `/signup?email=${encodeURIComponent(
        receiverEmail,
      )}`;
    }
  };

  const copyToClipboard = async text => {
    try {
      await navigator.clipboard.writeText(text);
      alert('링크가 클립보드에 복사되었습니다!');
    } catch (err) {
      alert('복사에 실패했습니다. 다시 시도해주세요.');
    }
  };

  return (
    <div className="invite-modal-overlay fixed inset-0 bg-black/40 flex justify-center items-center z-50">
      <div className="invite-modal bg-white p-8 rounded-xl w-[400px] max-w-full">
        <h2 className="text-xl font-bold mb-4 text-center">가족 초대하기</h2>

        <label className="block mb-2 text-sm font-medium">
          닉네임 (가입자)
        </label>
        <input
          type="text"
          placeholder="닉네임을 입력하세요"
          value={nick}
          onChange={e => setNick(e.target.value)}
          className="w-full p-3 mb-4 border border-gray-300 rounded"
          disabled={isSending}
        />

        <label className="block mb-2 text-sm font-medium">
          또는 이메일 (미가입자)
        </label>
        <input
          type="email"
          placeholder="이메일을 입력하세요"
          value={email}
          onChange={e => setEmail(e.target.value)}
          className="w-full p-3 border border-gray-300 rounded"
          disabled={isSending}
        />

        {error && <p className="text-red-500 text-sm mt-2">{error}</p>}
        {responseMsg && (
          <p className="text-green-500 text-sm mt-2">{responseMsg}</p>
        )}

        {requestId && (
          <div className="text-sm mt-3">
            <p className="text-blue-500">
              초대 링크:
              <a
                href={`/request/pending/${requestId}`}
                className="underline ml-1"
                target="_blank"
                rel="noopener noreferrer"
              >
                /request/pending/{requestId}
              </a>
            </p>
            <button
              className="mt-2 text-sm text-white bg-blue-500 px-3 py-1 rounded hover:bg-blue-600"
              onClick={() =>
                copyToClipboard(
                  `${window.location.origin}/request/pending/${requestId}`,
                )
              }
            >
              링크 복사하기
            </button>

            {receiverEmail && (
              <div className="mt-2">
                <p className="text-gray-700">
                  아직 가입되지 않은 사용자입니다.
                </p>
                <button
                  className="mt-2 text-white bg-plog-main4 px-4 py-2 rounded hover:bg-plog-main5"
                  onClick={handleGoToSignup}
                >
                  회원가입 하러 가기
                </button>
              </div>
            )}
          </div>
        )}

        <div className="flex justify-between mt-6">
          <button onClick={onClose} className="btn-cancel" disabled={isSending}>
            취소
          </button>
          <button
            onClick={handleSend}
            className="btn-send"
            disabled={isSending}
          >
            {isSending ? '전송 중...' : '전송'}
          </button>
        </div>
      </div>
    </div>
  );
}
