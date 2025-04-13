import { useState } from 'react';
import Pet from './Pet';
import axios from 'axios';
import '../style/addPet.scss';

const API = process.env.REACT_APP_API_SERVER;

export default function AddPet({ onClose }) {
  const [nickname, setNickname] = useState('');
  const [petName, setPetName] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  const handleSubmit = async e => {
    e.preventDefault();

    if (!nickname || !petName) {
      setErrorMessage('닉네임과 동물 이름은 필수입니다.');
      return;
    }

    const payload = {
      familyNick: nickname,
      petName,
    };

    try {
      const res = await axios.post(`${API}/request/invite`, payload);
      const { code, data } = res.data;

      if (code === 'SU') {
        if (data.isAlreadyRequested) {
          setSuccessMessage(
            `이미 요청을 보냈습니다. 대기 중입니다. 링크: /request/pending/${data.requestId}`,
          );
        } else {
          setSuccessMessage('요청을 성공적으로 보냈습니다!');
        }
        setErrorMessage('');
      }
    } catch (err) {
      if (err.response) {
        const { code, message } = err.response.data;
        if (code === 'NF' || code === 'BR' || code === 'DBE') {
          setErrorMessage(message);
        } else {
          setErrorMessage('요청 중 오류가 발생했습니다.');
        }
      } else {
        setErrorMessage('서버에 연결할 수 없습니다.');
      }
    }
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
            <Pet mode="create" />
            <div className="vertical-line"></div>

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
                        htmlFor="nickname"
                        className="text-plog-main4 font-semibold w-20"
                      >
                        닉네임:
                      </label>
                      <input
                        type="text"
                        id="nickname"
                        name="nickname"
                        placeholder="닉네임을 입력하세요"
                        value={nickname}
                        onChange={e => setNickname(e.target.value)}
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
                      name="petName"
                      value={petName}
                      onChange={e => setPetName(e.target.value)}
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
                    <span className="text-green-600 text-sm self-start ml-24">
                      {successMessage}
                    </span>
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
    </div>
  );
}
