import { useState } from 'react';
import Pet from './Pet';
import '../style/addPet.scss';

export default function AddPet({ onClose }) {
  const [email, setEmail] = useState('');
  const [emailError, setEmailError] = useState('');

  const handleSubmit = e => {
    e.preventDefault();

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setEmailError('올바른 이메일 주소를 입력해주세요.');
      return;
    }

    setEmailError('');
    alert('폼이 제출되었습니다!');
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
            <Pet />

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
                        htmlFor="email"
                        className="text-plog-main4 font-semibold w-20"
                      >
                        이메일:
                      </label>
                      <input
                        type="text"
                        id="email"
                        name="email"
                        value={email}
                        onChange={e => setEmail(e.target.value)}
                        required
                        className="border border-plog-main1 rounded-md px-4 py-2 flex-1"
                      />
                    </div>
                    {emailError && (
                      <span className="text-red-500 text-sm ml-24">
                        {emailError}
                      </span>
                    )}
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
                      required
                      className="border border-plog-main1 rounded-md px-4 py-2 flex-1"
                    />
                  </div>
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
