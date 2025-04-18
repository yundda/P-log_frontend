import axios from '../../api/axiosInterceptor';
import '../../style/addPet.scss';
import { useState } from 'react';

const API = process.env.REACT_APP_API_SERVER;
export default function Daily({ selectedDate, pet, onClose }) {
  console.log('[전송되는 pet 이름]', pet?.petName);
  console.log('[전송되는 pet 객체]', pet?.petId);

  const auth = JSON.parse(localStorage.getItem('auth'));
  console.log('[현재 로그인 정보]', auth);

  const [form, setForm] = useState({
    meal_type: 'FEED',
    place: '',
    price: '',
    take_time: '',
    memo: '',
  });

  const handleChange = e => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async () => {
    const body = {
      petLog: {
        petId: pet.petId,
        name: pet.petName,
        type: 'MEAL',
      },
      detailLog: {
        logTime: new Date(selectedDate).toTimeString().slice(0, 8),
        mealType: form.meal_type,
        place: form.place,
        price: parseInt(form.price),
        takeTime: parseInt(form.take_time),
        memo: form.memo,
      },
    };

    console.log('[일상 기록 전송 데이터]', body);

    try {
      const res = await axios.post(`${API}/logs`, body);
      console.log('[일상 기록 등록 성공]', res.data);
      alert('일상 기록이 저장되었습니다!');
      onClose();
    } catch (err) {
      console.error('[일상 기록 등록 실패]', err);
      if (err.response) {
        console.error('[서버 응답]', err.response.data);
      }
    }
  };

  return (
    <div className="modal-overlay">
      <div className="modal-content relative">
        <button
          className="close-button absolute top-2 right-2 text-2xl"
          onClick={onClose}
        >
          &times;
        </button>
        <div className="add-container bg-plog-main2/40 flex-container">
          <h1 className="text-plog-main4 font-bold text-4xl mb-6">일상 기록</h1>
          <div className="content-wrapper">
            <div className="form-section flex flex-col gap-4 w-full max-w-xl">
              <label>식사 유형</label>
              <select
                name="meal_type"
                value={form.meal_type}
                onChange={handleChange}
                className="border rounded px-4 py-2"
              >
                <option value="FEED">사료</option>
                <option value="SNACK">간식</option>
                <option value="MEDICINE">약</option>
              </select>

              <input
                name="place"
                placeholder="장소"
                onChange={handleChange}
                className="border rounded px-4 py-2"
              />
              <input
                name="price"
                _type="number"
                placeholder="비용"
                onChange={handleChange}
                className="border rounded px-4 py-2"
              />
              <input
                name="take_time"
                _type="number"
                placeholder="소요 시간"
                onChange={handleChange}
                className="border rounded px-4 py-2"
              />
              <input
                name="memo"
                placeholder="메모"
                onChange={handleChange}
                className="border rounded px-4 py-2"
              />

              <button
                onClick={handleSubmit}
                className="send-button self-end mt-4"
              >
                기록 저장
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
