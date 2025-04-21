import axios from '../../api/axiosInterceptor';
import '../../style/addPet.scss';
import { useState, useEffect } from 'react';
import Alert from './Alert';

const API = process.env.REACT_APP_API_SERVER;

export default function Health({
  selectedDate,
  pet,
  onClose,
  setHealthLogs,
  mode = 'create',
  editLog,
}) {
  const [currentMode, setCurrentMode] = useState(mode);
  const isReadMode = currentMode === 'read';

  const [form, setForm] = useState({
    vaccination: '',
    hospital: '',
    hospital_log: '',
    vaccination_log: false,
  });

  const [alertMessage, setAlertMessage] = useState('');
  const [showAlert, setShowAlert] = useState(false);
  const [afterSuccess, setAfterSuccess] = useState(null); // ✅ Alert 닫고 나서 실행할 작업

  const openAlert = (msg, callback) => {
    setAlertMessage(msg);
    setAfterSuccess(() => callback); // ✅ 콜백 저장
    setShowAlert(true);
  };

  const closeAlert = () => {
    setShowAlert(false);
    setAlertMessage('');
    if (afterSuccess) {
      afterSuccess(); // ✅ 등록/수정/삭제 후 동작 실행
    }
  };

  useEffect(() => {
    if (editLog) {
      setForm({
        vaccination: editLog.vaccination || '',
        hospital: editLog.hospital || '',
        hospital_log: formatEditDate(editLog.hospital_log) || '',
        vaccination_log:
          editLog.vaccination_log === true ||
          editLog.vaccination_log === 'true',
      });
    }
  }, [editLog]);

  const formatEditDate = dateString => {
    const date = new Date(dateString);
    date.setMinutes(date.getMinutes() - date.getTimezoneOffset());
    return date.toISOString().slice(0, 16);
  };

  const handleChange = e => {
    const { name, value, type } = e.target;
    setForm(prev => ({
      ...prev,
      [name]: type === 'radio' ? value === 'true' : value,
    }));
  };

  const fetchHealthLogs = async () => {
    try {
      const res = await axios.get(`${API}/logs/health/${pet.petName}`);
      setHealthLogs(res.data.data || []);
    } catch (err) {
      console.error('[건강 기록 재조회 실패]', err.response?.data || err);
    }
  };

  const handleSubmit = async () => {
    const formattedHospitalLog =
      form.hospital_log.length === 16
        ? form.hospital_log + ':00'
        : form.hospital_log;

    if (currentMode === 'edit') {
      try {
        await axios.patch(`${API}/logs/health/update`, {
          log_id: editLog.log_id,
          vaccination: form.vaccination,
          vaccinationLog: form.vaccination_log,
          hospital: form.hospital,
          hospitalLog: formattedHospitalLog,
        });
        openAlert('건강 기록이 수정되었습니다!', () => {
          fetchHealthLogs();
          onClose();
        });
      } catch (err) {
        console.error('[건강 기록 수정 실패]', err.response?.data || err);
        openAlert(err.response?.data?.message || '서버 오류');
      }
      return;
    }

    // create
    const body = {
      petLog: {
        name: pet.petName,
        type: 'HOSPITAL',
      },
      healthLog: {
        vaccination: form.vaccination,
        vaccination_log:
          form.vaccination_log === true || form.vaccination_log === 'true',
        hospital: form.hospital,
        hospital_log: formattedHospitalLog,
      },
    };

    try {
      await axios.post(`${API}/logs/health`, body);
      openAlert('건강 기록이 저장되었습니다!', () => {
        fetchHealthLogs();
        onClose();
      });
    } catch (err) {
      console.error('[건강 기록 등록 실패]', err.response?.data || err);
      openAlert(err.response?.data?.message || '서버 오류');
    }
  };

  const handleDelete = async () => {
    if (!editLog) return;
    if (!window.confirm('정말 삭제하시겠습니까?')) return;

    try {
      await axios.delete(`${API}/logs/health/${editLog.log_id}`);
      openAlert('🗑️ 삭제되었습니다!', () => {
        fetchHealthLogs();
        onClose();
      });
    } catch (err) {
      console.error('[건강 기록 삭제 실패]', err.response?.data || err);
      openAlert(err.response?.data?.message || '서버 오류');
    }
  };

  const handleEdit = () => setCurrentMode('edit');

  const handleCancelEdit = () => {
    setCurrentMode('read');
    if (editLog) {
      setForm({
        vaccination: editLog.vaccination || '',
        hospital: editLog.hospital || '',
        hospital_log: formatEditDate(editLog.hospital_log) || '',
        vaccination_log:
          editLog.vaccination_log === true ||
          editLog.vaccination_log === 'true',
      });
    }
  };

  return (
    <div className="modal-overlay">
      <div className="modal-content relative">
        <button className="close-button" onClick={onClose}>
          &times;
        </button>
        <div className="add-container bg-plog-main2/40 flex-container p-6 rounded-xl shadow-lg">
          <h1 className="text-plog-main4 font-bold text-4xl mb-6 text-center">
            {currentMode === 'edit'
              ? '✏️ 건강 기록 수정'
              : editLog
              ? '🏥 건강 기록 보기'
              : '✏️ 건강 기록'}
          </h1>
          <div className="form-section flex flex-col gap-5 w-full max-w-xl mx-auto">
            <input
              name="vaccination"
              placeholder="예방 접종 내용 ex) 광견병, 디스템퍼 💉"
              value={form.vaccination}
              onChange={handleChange}
              className="border rounded px-4 py-2"
              readOnly={isReadMode}
            />

            <div className="flex flex-col gap-2">
              <span className="font-semibold text-plog-main4 text-lg">
                💉 예방 접종을 했나요?
              </span>
              <div className="flex gap-6 items-center text-base">
                <label className="flex items-center gap-2">
                  <input
                    type="radio"
                    name="vaccination_log"
                    value="true"
                    checked={form.vaccination_log === true}
                    onChange={handleChange}
                    disabled={isReadMode}
                  />
                  ✅ 예
                </label>
                <label className="flex items-center gap-2">
                  <input
                    type="radio"
                    name="vaccination_log"
                    value="false"
                    checked={form.vaccination_log === false}
                    onChange={handleChange}
                    disabled={isReadMode}
                  />
                  ❌ 아니요
                </label>
              </div>
            </div>

            <input
              name="hospital"
              placeholder="병원 이름 ex) 서울동물병원 🏥"
              value={form.hospital}
              onChange={handleChange}
              className="border rounded px-4 py-2"
              readOnly={isReadMode}
            />

            <div className="flex flex-col gap-1">
              <label className="text-plog-main4 font-semibold">
                📅 병원 방문 일시
              </label>
              <input
                name="hospital_log"
                type="datetime-local"
                value={form.hospital_log}
                onChange={handleChange}
                className="border rounded px-4 py-2"
                readOnly={isReadMode}
              />
            </div>

            <div className="flex justify-between mt-4 flex-wrap gap-2">
              {mode === 'read' && currentMode === 'read' && (
                <button
                  onClick={handleEdit}
                  className="bg-plog-main5 text-white py-2 px-4 rounded hover:bg-plog-main4"
                >
                  수정 모드로 전환
                </button>
              )}

              {currentMode === 'edit' && (
                <>
                  <button
                    onClick={handleSubmit}
                    className="bg-plog-main5 text-white py-2 px-4 rounded hover:bg-plog-main4"
                  >
                    수정하기
                  </button>
                  <button
                    onClick={handleCancelEdit}
                    className="border border-gray-400 text-gray-600 px-4 py-2 rounded hover:bg-gray-100"
                  >
                    취소
                  </button>
                  <button
                    className="text-red-600 border border-red-400 px-4 py-2 rounded hover:bg-red-100"
                    onClick={handleDelete}
                  >
                    🗑️ 삭제
                  </button>
                </>
              )}

              {mode === 'create' && (
                <>
                  <button
                    onClick={handleSubmit}
                    className="bg-plog-main5 text-white py-2 px-4 rounded hover:bg-plog-main4"
                  >
                    기록 등록
                  </button>
                  <button
                    onClick={onClose}
                    className="border border-gray-400 text-gray-600 px-4 py-2 rounded hover:bg-gray-100"
                  >
                    취소
                  </button>
                </>
              )}
            </div>
          </div>
        </div>
        {showAlert && <Alert message={alertMessage} onClose={closeAlert} />}
      </div>
    </div>
  );
}
