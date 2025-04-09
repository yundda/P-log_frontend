import { useEffect, useRef, useState } from 'react';
import axios from 'axios';
import '../style/pet.scss';

export default function Pet({ mode, petId, pet }) {
  const isCreateMode = mode === 'create';
  const isEditMode = mode === 'edit';
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

  useEffect(() => {
    if (isReadMode && petId) {
      (async () => {
        try {
          const res = await axios.get(`/api/pets/${petId}`);
          const data = res.data;
          setFormData({
            name: data.name,
            species: data.species,
            breed: data.breed,
            birthday: data.birthday,
            gender: data.gender === 'MALE' ? 'man' : 'woman',
            weight: data.weight,
          });
          setPreviewImage(data.photo || '');
        } catch (error) {
          console.error('반려동물 조회 실패:', error);
        }
      })();
    }

    if (isEditMode && pet) {
      setFormData({
        name: pet.name || '',
        species: pet.species || '',
        breed: pet.breed || '',
        birthday: pet.birthday || '',
        gender: pet.gender === 'MALE' ? 'man' : 'woman',
        weight: pet.weight || '',
      });
      setPreviewImage(pet.photo || '');
    }
  }, [isReadMode, isEditMode, pet, petId]);

  const handleImageClick = () => {
    if (isReadMode) return;
    fileInputRef.current.click();
  };

  const handleImageChange = e => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onloadend = () => {
      setPreviewImage(reader.result);
    };
    reader.readAsDataURL(file);
  };

  const handleChange = e => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async e => {
    e.preventDefault();
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
      if (isCreateMode) {
        const response = await axios.post('/api/pets/', petData);
        alert(response.data?.message || '등록 완료');
      }

      if (isEditMode && petId) {
        const response = await axios.put(`/api/pets/${petId}`, petData);
        alert(response.data?.message || '수정 완료');
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
          src={previewImage || '/default-pet.png'}
          alt="사진"
          className="img w-52 h-52 rounded-full object-cover"
        />
        {!isReadMode && (
          <>
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
          </>
        )}
      </div>

      <form
        className="input-card flex flex-col gap-4 w-full max-w-sm"
        onSubmit={handleSubmit}
      >
        {[
          { label: '이름', name: 'name', type: 'text' },
          { label: '품종', name: 'species', type: 'text' },
          { label: '견종', name: 'breed', type: 'text' },
          { label: '생일', name: 'birthday', type: 'date' },
        ].map(({ label, name, type }) => (
          <div className="flex items-center gap-4" key={name}>
            <label
              htmlFor={name}
              className="text-plog-main4 font-semibold w-20"
            >
              {label}:
            </label>
            <input
              type={type}
              id={name}
              name={name}
              required
              value={formData[name]}
              onChange={handleChange}
              className="border border-plog-main1 rounded-md px-4 py-2 flex-1"
              disabled={isReadMode}
            />
          </div>
        ))}

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
            disabled={isReadMode}
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
            step="0.1"
            required
            value={formData.weight}
            onChange={handleChange}
            className="border border-plog-main1 rounded-md px-4 py-2 flex-1"
            disabled={isReadMode}
          />
          <span className="text-plog-main4">kg</span>
        </div>

        {!isReadMode && (
          <button type="submit" className="submit-button self-end">
            {isCreateMode ? '추가하기' : '수정하기'}
          </button>
        )}
      </form>
    </div>
  );
}
