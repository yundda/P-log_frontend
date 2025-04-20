import axios from '../../api/axiosInterceptor';
import '../../style/addPet.scss';
import { useState } from 'react';
import Alert from './Alert';

const API = process.env.REACT_APP_API_SERVER;

const LOG_TYPES = [
  { type: 'MEAL', label: '식사', icon: '/images/meal.png' },
  { type: 'WALK', label: '산책', icon: '/images/walk.png' },
  { type: 'HOSPITAL', label: '병원', icon: '/images/hospital.png' },
  { type: 'GROOMING', label: '미용', icon: '/images/grooming.png' },
  { type: 'BATH', label: '목욕', icon: '/images/bath.png' },
  { type: 'ETC', label: '기타', icon: '/images/etc.png' },
];

export default function Daily({
  selectedDate,
  pet,
  onClose,
  mode = 'create',
  editLog,
}) {
  const [logType, setLogType] = useState(editLog?.type || 'MEAL');
  const [currentMode, setCurrentMode] = useState(mode);

  const [form, setForm] = useState({
    meal_type: editLog?.mealType || 'FEED',
    place: editLog?.place || '',
    price: editLog?.price?.toString() || '',
    take_time: editLog?.takeTime?.toString() || '',
    memo: editLog?.memo || '',
  });

  const [alertMessage, setAlertMessage] = useState('');
  const [showAlert, setShowAlert] = useState(false);

  const openAlert = msg => {
    setAlertMessage(msg);
    setShowAlert(true);
  };

  const closeAlert = () => {
    setAlertMessage('');
    setShowAlert(false);
  };

  const isReadOnly = currentMode === 'read';

  const handleChange = e => {
    if (isReadOnly) return;
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const formatLocalDateTime = date => {
    return new Date(date.getTime() - date.getTimezoneOffset() * 60000)
      .toISOString()
      .slice(0, 19);
  };

  const handleSubmit = async () => {
    const body = {
      petLog: {
        name: pet.petName,
        type: logType,
      },
      detailLog: {
        logTime: formatLocalDateTime(selectedDate),
        ...(logType === 'MEAL' && { mealType: form.meal_type }),
        ...(logType !== 'ETC' && logType !== 'MEAL' && { place: form.place }),
        ...((logType === 'HOSPITAL' ||
          logType === 'GROOMING' ||
          logType === 'BATH') && {
          price: parseInt(form.price) || 0,
        }),
        ...((logType === 'WALK' ||
          logType === 'GROOMING' ||
          logType === 'BATH') && {
          takeTime: parseInt(form.take_time) || 0,
        }),
        memo: form.memo,
      },
    };
    console.log('editLog', editLog);

    try {
      if (currentMode === 'edit') {
        const patchData = {
          log_id: editLog.log_id,
          newType: logType,
          newLogTime: body.detailLog.logTime,
          mealType: body.detailLog.mealType ?? null,
          place: body.detailLog.place ?? null,
          price: body.detailLog.price ?? null,
          takeTime: body.detailLog.takeTime ?? null,
          memo: body.detailLog.memo ?? null,
        };

        const res = await axios.patch(`${API}/logs/update`, patchData);
        console.log('[기록 수정 응답]', res.data);
        openAlert('기록이 수정되었습니다.');
      } else {
        const res = await axios.post(`${API}/logs`, body);
        console.log('[기록 등록 응답]', res.data);
        openAlert('일상 기록이 저장되었습니다!');
      }
    } catch (err) {
      console.error('[기록 저장 실패]', err.response?.data || err);
      openAlert(err.response?.data?.message || '서버 오류');
    }
  };

  const handleDelete = async () => {
    try {
      await axios.delete(`${API}/logs/${editLog.log_id}`);
      openAlert('기록이 삭제되었습니다.');
    } catch (err) {
      console.error('[기록 삭제 실패]', err.response?.data || err);
      openAlert(err.response?.data?.message || '서버 오류');
    }
  };

  const handleEdit = () => setCurrentMode('edit');

  const handleCancelEdit = () => {
    setCurrentMode('read');
    setForm({
      meal_type: editLog?.mealType || 'FEED',
      place: editLog?.place || '',
      price: editLog?.price?.toString() || '',
      take_time: editLog?.takeTime?.toString() || '',
      memo: editLog?.memo || '',
    });
  };

  const renderInputsByType = () => {
    switch (logType) {
      case 'MEAL':
        return (
          <div className="flex gap-2">
            {['FEED', 'SNACK', 'MEDICINE'].map(value => {
              const labelMap = { FEED: '사료', SNACK: '간식', MEDICINE: '약' };
              const iconMap = {
                FEED: '/images/feed.png',
                SNACK: '/images/snack.png',
                MEDICINE: '/images/medicine.png',
              };
              return (
                <button
                  key={value}
                  type="button"
                  disabled={isReadOnly}
                  onClick={() =>
                    !isReadOnly && setForm({ ...form, meal_type: value })
                  }
                  className={`flex items-center gap-1 px-3 py-2 border rounded ${
                    form.meal_type === value
                      ? 'bg-plog-main4 text-white'
                      : 'bg-white text-plog-main4'
                  } ${isReadOnly ? 'opacity-50 cursor-not-allowed' : ''}`}
                >
                  <img
                    src={iconMap[value]}
                    alt={labelMap[value]}
                    className="w-5 h-5"
                  />
                  <span>{labelMap[value]}</span>
                </button>
              );
            })}
          </div>
        );
      case 'WALK':
      case 'HOSPITAL':
      case 'GROOMING':
      case 'BATH':
        return (
          <>
            {['WALK', 'HOSPITAL', 'GROOMING'].includes(logType) && (
              <input
                name="place"
                value={form.place}
                placeholder={logType === 'HOSPITAL' ? '병원 이름' : '장소'}
                onChange={handleChange}
                readOnly={isReadOnly}
                className="border rounded px-4 py-2"
              />
            )}
            {['WALK', 'GROOMING', 'BATH'].includes(logType) && (
              <input
                name="take_time"
                value={form.take_time}
                placeholder="소요 시간 (분)"
                onChange={handleChange}
                readOnly={isReadOnly}
                className="border rounded px-4 py-2"
              />
            )}
            {['HOSPITAL', 'GROOMING', 'BATH'].includes(logType) && (
              <input
                name="price"
                value={form.price}
                placeholder="비용 (원)"
                onChange={handleChange}
                readOnly={isReadOnly}
                className="border rounded px-4 py-2"
              />
            )}
          </>
        );
      default:
        return null;
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
              <div className="flex gap-2 flex-wrap mb-4">
                {LOG_TYPES.map(({ type, label, icon }) => (
                  <button
                    key={type}
                    type="button"
                    onClick={() => !isReadOnly && setLogType(type)}
                    className={`flex items-center gap-2 px-3 py-2 rounded border transition ${
                      logType === type
                        ? 'bg-plog-main4 text-white'
                        : 'bg-white text-plog-main4'
                    } ${isReadOnly ? 'opacity-50 cursor-not-allowed' : ''}`}
                    disabled={isReadOnly}
                  >
                    <img src={icon} alt={label} className="w-5 h-5" />
                    <span>{label}</span>
                  </button>
                ))}
              </div>

              {renderInputsByType()}

              <textarea
                name="memo"
                placeholder="메모"
                onChange={handleChange}
                readOnly={isReadOnly}
                value={form.memo}
                rows={4}
                className="border rounded px-4 py-2 resize-none"
              />

              <div className="flex gap-2 justify-end mt-4">
                {currentMode === 'create' && (
                  <>
                    <button
                      onClick={handleSubmit}
                      className="px-4 py-2 rounded bg-plog-main5 text-white hover:bg-plog-main4 transition"
                    >
                      등록
                    </button>
                    <button
                      onClick={onClose}
                      className="px-4 py-2 rounded border border-gray-400 text-gray-600 hover:bg-gray-100 transition"
                    >
                      취소
                    </button>
                  </>
                )}

                {currentMode === 'read' && (
                  <>
                    <button
                      onClick={handleEdit}
                      className="px-4 py-2 rounded bg-plog-main5 text-white hover:bg-plog-main4 transition"
                    >
                      수정하기
                    </button>
                    <button
                      className="text-red-600 border border-red-400 px-4 py-2 rounded hover:bg-red-100"
                      onClick={handleDelete}
                    >
                      🗑️ 삭제
                    </button>
                  </>
                )}

                {currentMode === 'edit' && (
                  <>
                    <button
                      onClick={handleSubmit}
                      className="px-4 py-2 rounded bg-plog-main5 text-white hover:bg-plog-main4 transition"
                    >
                      수정
                    </button>
                    <button
                      onClick={handleCancelEdit}
                      className="px-4 py-2 rounded border border-gray-400 text-gray-600 hover:bg-gray-100 transition"
                    >
                      취소
                    </button>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
        {showAlert && <Alert message={alertMessage} onClose={closeAlert} />}
      </div>
    </div>
  );
}
