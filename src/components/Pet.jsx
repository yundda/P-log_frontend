import { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSetRecoilState } from 'recoil';
import axios from '../api/axiosInterceptor';
import { selectedPetState } from '../recoil/petAtom';
import '../style/pet.scss';

const API = process.env.REACT_APP_API_SERVER;
const S3_URL = process.env.REACT_APP_S3;

export default function Pet({ mode, pet, onSuccess }) {
  const isCreateMode = mode === 'create';
  const isEditMode = mode === 'edit';
  const isReadMode = mode === 'read';
  const fileInputRef = useRef(null);
  const navigate = useNavigate();
  const setSelectedPet = useSetRecoilState(selectedPetState);

  const [previewImage, setPreviewImage] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [formData, setFormData] = useState({
    petName: '',
    species: '',
    breed: '',
    birthday: '',
    gender: '',
    weight: '',
  });

  useEffect(() => {
    if (isCreateMode) {
      setFormData({
        petName: '',
        species: '',
        breed: '',
        birthday: '',
        gender: '',
        weight: '',
      });
      setPreviewImage('/images/default-pet.png');
      setImageUrl('');
    }
  }, [isCreateMode]);

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
      setImageUrl(pet.petImageUrl || pet.petPhoto || '');
    }
  }, [pet, isEditMode, isReadMode]);

  const handleImageClick = () => {
    if (isReadMode) {
      navigate('/petSetting', { state: { petName: pet?.petName } });
      return;
    }
    fileInputRef.current?.click();
  };

  const handleImageChange = e => {
    const file = e.target.files[0];
    if (!file) return;

    if (file.size > 5 * 1024 * 1024) {
      alert('5MB 이하 파일만 업로드 가능합니다.');
      return;
    }

    const reader = new FileReader();
    reader.onloadend = () => setPreviewImage(reader.result);
    reader.readAsDataURL(file);

    const s3ImageUrl = `${S3_URL}/${file.name}`;
    setImageUrl(s3ImageUrl);
  };

  const handleChange = e => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async e => {
    e.preventDefault();
    if (!formData.birthday) {
      alert('생일을 입력해주세요.');
      return;
    }

    const petRequest = {
      petName: formData.petName,
      petSpecies: formData.species,
      petBreed: formData.breed,
      petBirthday: formData.birthday,
      petGender: formData.gender === 'man' ? 'MALE' : 'FEMALE',
      petWeight: parseFloat(formData.weight),
      petPhoto: formData.petImageUrl,
    };

    const form = new FormData();
    form.append(
      'info',
      new Blob([JSON.stringify(petRequest)], { type: 'application/json' }),
    );

    if (fileInputRef.current?.files[0]) {
      form.append('image', fileInputRef.current.files[0]);
    } else if (isCreateMode) {
      alert('이미지를 선택해주세요.');
      return;
    }

    try {
      if (isCreateMode) {
        await axios.post(`${API}/pets`, form, {
          headers: { 'Content-Type': 'multipart/form-data' },
        });
      }

      if (isEditMode) {
        await axios.patch(`${API}/pets/update`, form, {
          headers: { 'Content-Type': 'multipart/form-data' },
        });

        const updatedPet = {
          ...petRequest,
          petImageUrl: imageUrl,
        };

        setSelectedPet(updatedPet);
        localStorage.setItem('selectedPet', JSON.stringify(updatedPet));
      }

      setShowSuccessModal(true);
      if (typeof onSuccess === 'function') onSuccess();
    } catch (error) {
      console.error('[요청 실패]', error);
      alert(error.response?.data?.message || '에러가 발생했습니다.');
    }
  };

  return (
    <div className="add-container flex flex-col items-center gap-10 p-6 rounded-3xl relative">
      {showSuccessModal && (
        <div className="modal-overlay fixed inset-0 bg-black bg-opacity-40 flex justify-center items-center z-50">
          <div className="modal-content bg-white rounded-xl p-6 shadow-xl w-80 text-center">
            <p className="text-lg font-semibold text-plog-main4 mb-4">
              수정이 완료되었습니다!
            </p>
            <button
              className="px-4 py-2 bg-plog-main4 text-white rounded hover:bg-plog-main3"
              onClick={() => setShowSuccessModal(false)}
            >
              확인
            </button>
          </div>
        </div>
      )}

      <div className="img-card flex items-center gap-4 flex-wrap justify-center">
        <img
          src={previewImage || '/images/default-pet.png'}
          alt="사진"
          onClick={handleImageClick}
          className="img w-52 h-52 rounded-full object-cover cursor-pointer"
        />
        {!isReadMode && (
          <>
            <button
              type="button"
              className="add-button self-start"
              onClick={handleImageClick}
            >
              {isCreateMode
                ? '사진 추가하기'
                : isEditMode
                ? ' 사진 수정하기'
                : ''}
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
              className={`border border-plog-main1 rounded-md px-4 py-2 ${
                isReadMode && name === 'birthday' ? 'w-40' : 'w-full'
              }`}
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
          {isReadMode ? (
            <input
              type="text"
              value={
                formData.gender === 'man'
                  ? '남자'
                  : formData.gender === 'woman'
                  ? '여자'
                  : ''
              }
              readOnly
              className="border border-plog-main1 rounded-md px-4 py-2 w-40 bg-gray-100/20"
            />
          ) : (
            <select
              id="gender"
              name="gender"
              required
              value={formData.gender}
              onChange={handleChange}
              className="border border-plog-main1 rounded-md px-4 py-2 w-full"
            >
              <option value="" disabled>
                선택
              </option>
              <option value="man">남자</option>
              <option value="woman">여자</option>
            </select>
          )}
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
            {isCreateMode ? '추가하기' : isEditMode ? '수정하기' : ''}
          </button>
        )}
      </form>
    </div>
  );
}
