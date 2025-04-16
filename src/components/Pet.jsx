import { useEffect, useRef, useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import '../style/pet.scss';

const API = process.env.REACT_APP_API_SERVER;

export default function Pet({ mode, pet }) {
  const isCreateMode = mode === 'create';
  const isEditMode = mode === 'edit';
  const isReadMode = mode === 'read';
  const fileInputRef = useRef(null);
  const navigate = useNavigate();

  const [previewImage, setPreviewImage] = useState('');
  const [formData, setFormData] = useState({
    petName: '',
    species: '',
    breed: '',
    birthday: '',
    gender: '',
    weight: '',
  });

  const storedAuth = localStorage.getItem('auth');
  const token = storedAuth ? JSON.parse(storedAuth).token : '';

  const authHeader = useMemo(() => {
    return token ? { Authorization: `Bearer ${token}` } : {};
  }, [token]);

  useEffect(() => {
    if ((isReadMode || isEditMode) && pet) {
      setFormData({
        petName: pet.petName || '',
        species: pet.petSpecies || '',
        breed: pet.petBreed || '',
        birthday: pet.petBirthday?.slice(0, 10) || '',
        gender: pet.petGender === 'MALE' ? 'man' : 'woman',
        weight: pet.petWeight?.toString() || '',
      });
      setPreviewImage(
        pet.petImageUrl || pet.petPhoto || '/images/default-pet.png',
      );
    }

    if (isCreateMode) {
      setPreviewImage('/images/default-pet.png');
    }
  }, [isReadMode, isEditMode, isCreateMode, pet]);

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

    if (!formData.birthday) {
      alert('생일을 입력해주세요.');
      return;
    }

    const petRequest = {
      name: pet?.petName,
      petName: formData.petName,
      petSpecies: formData.species,
      petBreed: formData.breed,
      petBirthday: formData.birthday,
      petGender: formData.gender === 'man' ? 'MALE' : 'FEMALE',
      petWeight: parseFloat(formData.weight),
      petPhoto: previewImage || '/images/default-pet.png',
    };

    try {
      if (isCreateMode) {
        const response = await axios.post(`${API}/pets`, petRequest, {
          headers: authHeader,
        });
        alert(response.data?.message || '등록 완료');
        navigate('/ChooseProfile');
      }

      if (isEditMode) {
        const response = await axios.patch(`${API}/pets/update`, petRequest, {
          headers: authHeader,
        });
        alert(response.data?.message || '수정 완료');
      }
    } catch (error) {
      console.error('요청 실패:', error);
      alert(error.response?.data?.message || '에러가 발생했습니다.');
    }
  };

  return (
    <div className="add-container flex flex-col items-center gap-10 p-6 rounded-3xl">
      <div className="img-card flex items-center gap-4 flex-wrap justify-center">
        <img
          src={previewImage || '/images/default-pet.png'}
          alt="사진"
          className="img w-52 h-52 rounded-full object-cover"
        />
        {!isReadMode && (
          <>
            <button
              type="button"
              className="add-button self-start"
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
        className="input-card flex flex-col gap-4 w-full"
        onSubmit={handleSubmit}
      >
        {[
          { label: '이름', name: 'petName', type: 'text' },
          { label: '품종', name: 'species', type: 'text' },
          { label: '견종', name: 'breed', type: 'text' },
          { label: '생일', name: 'birthday', type: 'date' },
        ].map(({ label, name, type }) => (
          <div
            className="flex flex-col sm:flex-row items-start sm:items-center gap-2 sm:gap-4 w-full"
            key={name}
          >
            <label
              htmlFor={name}
              className="text-plog-main4 font-semibold sm:w-20 min-w-[64px] flex-shrink-0"
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
              className="border border-plog-main1 rounded-md px-4 py-2 w-full"
              disabled={isReadMode}
            />
          </div>
        ))}

        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2 sm:gap-4 w-full">
          <label
            htmlFor="gender"
            className="text-plog-main4 font-semibold sm:w-20 min-w-[64px] flex-shrink-0"
          >
            성별:
          </label>
          <select
            id="gender"
            name="gender"
            required
            value={formData.gender}
            onChange={handleChange}
            className="border border-plog-main1 rounded-md px-4 py-2 w-full"
            disabled={isReadMode}
          >
            <option value="" disabled>
              선택
            </option>
            <option value="man">남자</option>
            <option value="woman">여자</option>
          </select>
        </div>

        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2 sm:gap-4 w-full">
          <label
            htmlFor="weight"
            className="text-plog-main4 font-semibold sm:w-20 min-w-[64px] flex-shrink-0"
          >
            몸무게:
          </label>
          <div className="flex w-full gap-2">
            <input
              type="number"
              id="weight"
              name="weight"
              step="0.1"
              required
              value={formData.weight}
              onChange={handleChange}
              className="border border-plog-main1 rounded-md px-4 py-2 w-full"
              disabled={isReadMode}
            />
            <span className="text-plog-main4 self-center">kg</span>
          </div>
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
