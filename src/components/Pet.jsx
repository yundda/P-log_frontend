import { useRef, useState } from 'react';
import axios from 'axios';
import '../style/pet.scss';

export default function Pet({ mode }) {
  const isCreateMode = mode === 'create';
  const isReadMode = mode === 'read';
  const fileInputRef = useRef(null);
  const [previewImage, setPreviewImage] = useState('');

  const [formData, setFormData] = useState({
    name: '',
    species: '',
    breed: '',
    birthday: '',
    gender: '',
    weight: '',
  });

  const handleImageClick = () => {
    fileInputRef.current.click();
  };

  const handleImageChange = e => {};

  const handleChange = e => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async e => {
    e.preventDefault();
    if (!isCreateMode) return;

    const petData = {
      name: formData.name,
      species: formData.species,
      breed: formData.breed,
      birthday: formData.birthday,
      gender: formData.gender === 'man' ? 'MALE' : 'FEMALE',
      weight: parseFloat(formData.weight),
      photo: previewImage || '',
    };

    try {
      const response = await axios.post('/api/pets/', petData);

      if (response.data?.message) {
        alert(response.data.message);
      } else {
        alert('등록 완료');
      }
    } catch (error) {
      console.error(error);
      alert(error.response?.data?.message || '에러가 발생했습니다.');
    }
  };

  return (
    <div className="add-container flex flex-col items-center gap-10 p-6 rounded-3xl">
      <div className="img-card flex items-center gap-4">
        <img
          src={previewImage}
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

      <form
        className="input-card flex flex-col gap-4 w-full max-w-sm"
        onSubmit={handleSubmit}
      >
        <div className="flex items-center gap-4">
          <label htmlFor="name" className="text-plog-main4 font-semibold w-20">
            이름:
          </label>
          <input
            type="text"
            id="name"
            name="name"
            required
            value={formData.name}
            onChange={handleChange}
            className="border border-plog-main1 rounded-md px-4 py-2 flex-1"
          />
        </div>

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
            value={formData.species}
            onChange={handleChange}
            className="border border-plog-main1 rounded-md px-4 py-2 flex-1"
          />
        </div>

        <div className="flex items-center gap-4">
          <label htmlFor="breed" className="text-plog-main4 font-semibold w-20">
            견종:
          </label>
          <input
            type="text"
            id="breed"
            name="breed"
            required
            value={formData.breed}
            onChange={handleChange}
            className="border border-plog-main1 rounded-md px-4 py-2 flex-1"
          />
        </div>

        <div className="flex items-center gap-4">
          <label
            htmlFor="birthday"
            className="text-plog-main4 font-semibold w-20"
          >
            생일:
          </label>
          <input
            type="date"
            id="birthday"
            name="birthday"
            required
            value={formData.birthday}
            onChange={handleChange}
            className="border border-plog-main1 rounded-md px-4 py-2 flex-1"
          />
        </div>

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
            value={formData.gender}
            onChange={handleChange}
            className="border border-plog-main1 rounded-md px-4 py-2 flex-1"
          >
            <option value="" disabled>
              선택
            </option>
            <option value="man">남자</option>
            <option value="woman">여자</option>
          </select>
        </div>

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
            value={formData.weight}
            onChange={handleChange}
            className="border border-plog-main1 rounded-md px-4 py-2 flex-1"
          />
          <span className="text-plog-main4">kg</span>
        </div>

        {!isReadMode && (
          <button type="submit" className="submit-button self-end">
            {isCreateMode ? '수정하기' : '추가하기'}
          </button>
        )}
      </form>
    </div>
  );
}
