import axios from '../../api/axiosInterceptor';
import '../../style/addPet.scss';
import { useState } from 'react';

const API = process.env.REACT_APP_API_SERVER;

// export default function Health({ selectedDate, pet, onClose }) {
//   const [form, setForm] = useState({
//     vaccination: '',
//     hospital: '',
//     price: '',
//   });

//   const handleChange = e => {
//     setForm({ ...form, [e.target.name]: e.target.value });
//   };

//   const handleSubmit = async () => {
//     const body = {
//       petLog: {
//         name: pet.petName,
//         type: 'HEALTH',
//       },
//       healthLog: {
//         vaccination: form.vaccination,
//         vaccination_log: true,
//         hospital: form.hospital,
//         hospital_log: new Date(selectedDate).toISOString(),
//         price: parseInt(form.price),
//       },
//     };

//     console.log('[건강 기록 전송 데이터]', body);

//     try {
//       const res = await axios.post(`${API}/logs/health`, body);
//       console.log('[건강 기록 등록 성공]', res.data);
//       alert('건강 기록이 저장되었습니다!');
//       onClose();
//     } catch (err) {
//       console.error('[건강 기록 등록 실패]', err);
//       if (err.response) {
//         console.error('[서버 응답]', err.response.data);
//         alert('건강 기록 저장에 실패했습니다: ' + err.response.data.message);
//       } else {
//         alert('서버에 연결할 수 없습니다.');
//       }
//     }
//   };
export default function Health({ selectedDate, pet, onClose, setHealthLogs }) {
  const [form, setForm] = useState({
    vaccination: '',
    hospital: '',
    price: '',
  });

  const handleChange = e => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async () => {
    const body = {
      petLog: {
        name: pet.petName,
        type: 'HOSPITAL',
      },
      healthLog: {
        vaccination: form.vaccination,
        vaccination_log: true,
        hospital: form.hospital,
        hospital_log: new Date(selectedDate).toISOString(),
        price: parseInt(form.price),
      },
    };

    try {
      const res = await axios.post(`${API}/logs/health`, body);
      alert('건강 기록이 저장되었습니다!');

      const logsRes = await axios.get(`${API}/logs/health/${pet.petId}`);
      setHealthLogs(logsRes.data);

      onClose();
    } catch (err) {
      console.error('[건강 기록 등록 실패]', err);
      if (err.response) {
        alert('저장 실패: ' + err.response.data.message);
      } else {
        alert('서버 연결 오류');
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
          <h1 className="text-plog-main4 font-bold text-4xl mb-6">건강 기록</h1>
          <div className="content-wrapper">
            <div className="form-section flex flex-col gap-4 w-full max-w-xl">
              <input
                name="vaccination"
                placeholder="예방 접종 내용"
                value={form.vaccination}
                onChange={handleChange}
                className="border rounded px-4 py-2"
              />
              <input
                name="hospital"
                placeholder="병원 이름"
                value={form.hospital}
                onChange={handleChange}
                className="border rounded px-4 py-2"
              />
              <input
                name="price"
                type="number"
                placeholder="비용"
                value={form.price}
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
