import { useRef, useState } from 'react';
import '../style/pet.scss';

export default function Pet() {
  const fileInputRef = useRef(null);
  const [previewImage, setPreviewImage] = useState('');

  const handleImageClick = () => {
    fileInputRef.current.click();
  };

  const handleImageChange = e => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewImage(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="add-container flex flex-col items-center gap-10 p-6 rounded-3xl">
      <div className="img-card flex items-center gap-4">
        <img
          src={previewImage || '/images/default-pet.png'}
          alt="사진"
          className="img w-52 h-52 rounded-full object-cover"
        />
        <button
          type="button"
          className="add-button self-end"
          onClick={handleImageClick}
        >
          사진 추가하기
        </button>
        <input
          type="file"
          accept="image/*"
          ref={fileInputRef}
          onChange={handleImageChange}
          style={{ display: 'none' }}
        />
      </div>

      <form className="input-card flex flex-col gap-4 w-full max-w-sm">
        {/* 이름 */}
        <div className="flex items-center gap-4">
          <label htmlFor="name" className="text-plog-main4 font-semibold w-20">
            이름:
          </label>
          <input
            type="text"
            id="name"
            name="name"
            required
            className="border border-plog-main1 rounded-md px-4 py-2 flex-1"
          />
        </div>

        {/* 품종 */}
        <div className="flex items-center gap-4">
          <label
            htmlFor="species"
            className="text-plog-main4 font-semibold w-20"
          >
            품종:
          </label>
          <input
            type="text"
            id="species"
            name="species"
            required
            className="border border-plog-main1 rounded-md px-4 py-2 flex-1"
          />
        </div>

        {/* 나이 */}
        <div className="flex items-center gap-4">
          <label htmlFor="age" className="text-plog-main4 font-semibold w-20">
            나이:
          </label>
          <input
            type="number"
            id="age"
            name="age"
            required
            className="border border-plog-main1 rounded-md px-4 py-2 flex-1"
          />
          <select
            id="ageUnit"
            name="ageUnit"
            className="border border-plog-main1 rounded-md px-4 py-2"
          >
            <option value="month">개월</option>
            <option value="year">살</option>
          </select>
        </div>

        {/* 성별 */}
        <div className="flex items-center gap-4">
          <label
            htmlFor="gender"
            className="text-plog-main4 font-semibold w-20"
          >
            성별:
          </label>
          <select
            id="gender"
            name="gender"
            required
            className="border border-plog-main1 rounded-md px-4 py-2 flex-1"
          >
            <option value="" disabled selected>
              선택
            </option>
            <option value="man">남자</option>
            <option value="woman">여자</option>
          </select>
        </div>

        {/* 몸무게 */}
        <div className="flex items-center gap-4">
          <label
            htmlFor="weight"
            className="text-plog-main4 font-semibold w-20"
          >
            몸무게:
          </label>
          <input
            type="number"
            id="weight"
            name="weight"
            required
            className="border border-plog-main1 rounded-md px-4 py-2 flex-1"
          />
          <span className="text-plog-main4">kg</span>
        </div>

        <button type="submit" className="submit-button self-end">
          추가하기
        </button>
      </form>
    </div>
  );
}
