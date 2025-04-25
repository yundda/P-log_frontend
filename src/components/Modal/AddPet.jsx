import { useState } from 'react';
import Pet from '../Pet';
import axios from '../../api/axiosInterceptor';
import { useNavigate } from 'react-router-dom';
import Alert from '../Modal/Alert';
import '../../style/addPet.scss';

const API = process.env.REACT_APP_API_SERVER;

export default function AddPet({ onClose }) {
  const navigate = useNavigate();
  const [nickName, setNickName] = useState('');
  const [petName, setpetName] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [requestLink, setRequestLink] = useState('');
  const [showAlert, setShowAlert] = useState(false);

  const handleSubmit = async e => {
    e.preventDefault();

    if (!nickName || !petName) {
      setErrorMessage('닉네임과 동물 이름은 필수입니다.');
      console.warn('[검증 실패] 입력값 부족', { nickName, petName });
      return;
    }

    const payload = {
      ownerNick: nickName,
      petName,
    };

    console.log('[요청 전송] payload:', payload);

    try {
      const res = await axios.post(`${API}/request/permission`, payload);
      console.log('[응답 성공]', res.data);

      const { code, data } = res.data;

      if (code === 'SU') {
        const link = `/request/pending/${data.requestId}`;
        setRequestLink(link);

        if (data.isAlreadyRequested) {
          setSuccessMessage('이미 요청을 보냈습니다. 대기 중입니다.');
          console.info('[요청 상태] 이미 요청됨', data);
        } else {
          setSuccessMessage('요청을 성공적으로 보냈습니다!');
          console.info('[요청 상태] 새 요청 성공', data);
        }
        setErrorMessage('');
      }
    } catch (err) {
      console.error('[요청 실패]', err);
      if (err.response) {
        const { code, message } = err.response.data;
        console.error('[에러 응답]', { code, message });

        if (['NF', 'BR', 'DBE'].includes(code)) {
          setErrorMessage(message);
        } else {
          setErrorMessage('요청 중 알 수 없는 오류가 발생했습니다.');
        }
      } else {
        console.error('[네트워크 오류 또는 서버 다운]', err.message);
        setErrorMessage('서버에 연결할 수 없습니다.');
      }
    }
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(`${window.location.origin}${requestLink}`);
    alert('링크가 클립보드에 복사되었습니다.');
    console.log('[클립보드 복사됨]', `${window.location.origin}${requestLink}`);
  };

  const goToRequestPage = () => {
    console.log('[요청 상세 페이지로 이동]', requestLink);
    navigate(requestLink);
  };

  const handlePetCreateSuccess = () => {
    console.log('[Pet 등록 성공]');
    setShowAlert(true);
  };

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <button className="close-button" onClick={onClose}>
          &times;
        </button>

        <div className="add-container bg-plog-main2/40 flex-container">
          <h1 className="text-plog-main4 font-bold text-4xl mb-6">
            반려동물 추가하기
          </h1>

          <div className="content-wrapper">
            {/* Pet 등록 */}
            <Pet mode="create" onSuccess={handlePetCreateSuccess} />

            <div className="vertical-line"></div>

            {/* 참여하기 */}
            <div className="participate-wrapper">
              <div className="image-and-form">
                <div className="img-card flex items-center gap-4">
                  <img
                    src="/images/img2.png"
                    className="img w-52 h-52 object-cover"
                    alt="참여 이미지"
                  />
                  <h2 className="text-plog-main4 text-3xl font-thin mb-4">
                    참여하기
                  </h2>
                </div>

                <form
                  className="input-card flex flex-col gap-4 w-full max-w-sm"
                  onSubmit={handleSubmit}
                >
                  <div className="flex flex-col gap-1">
                    <div className="flex items-center gap-4">
                      <label
                        htmlFor="nickName"
                        className="text-plog-main4 font-semibold w-20"
                      >
                        닉네임:
                      </label>
                      <input
                        type="text"
                        id="nickName"
                        petName="nickName"
                        placeholder="닉네임을 입력하세요"
                        value={nickName}
                        onChange={e => setNickName(e.target.value)}
                        required
                        className="border border-plog-main1 rounded-md px-4 py-2 flex-1"
                      />
                    </div>
                  </div>

                  <div className="flex items-center gap-4">
                    <label
                      htmlFor="petName"
                      className="text-plog-main4 font-semibold w-20"
                    >
                      동물 이름:
                    </label>
                    <input
                      type="text"
                      id="petName"
                      petName="petName"
                      value={petName}
                      onChange={e => setpetName(e.target.value)}
                      required
                      className="border border-plog-main1 rounded-md px-4 py-2 flex-1"
                    />
                  </div>

                  {errorMessage && (
                    <span className="text-red-500 text-sm self-start ml-24">
                      {errorMessage}
                    </span>
                  )}
                  {successMessage && (
                    <div className="text-green-600 text-sm self-start ml-24 flex flex-col gap-2">
                      <span>{successMessage}</span>
                      {requestLink && (
                        <div className="flex gap-4 mt-1">
                          <button
                            type="button"
                            onClick={copyToClipboard}
                            className="text-blue-500 underline"
                          >
                            링크 복사
                          </button>
                          <button
                            type="button"
                            onClick={goToRequestPage}
                            className="text-blue-500 underline"
                          >
                            바로가기
                          </button>
                        </div>
                      )}
                    </div>
                  )}

                  <button type="submit" className="send-button self-end">
                    보내기
                  </button>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 등록 성공 모달 */}
      {showAlert && (
        <Alert
          message="반려동물이 성공적으로 등록되었습니다."
          onClose={() => {
            setShowAlert(false);
            onClose();
          }}
        />
      )}
    </div>
  );
}
