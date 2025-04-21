import React, { useState, useEffect } from 'react';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';
import Pet from '../components/Pet';
import Daily from '../components/Modal/Daily';
import Health from '../components/Modal/Health';
import { useRecoilValue } from 'recoil';
import { selectedPetProfileState } from '../recoil/petAtom';
import axios from '../api/axiosInterceptor';
import '../style/index.scss';
import '../style/addPet.scss';
import Weather from '../components/API/Weather';
import LoginRequired from '../components/Modal/LoginRequired';

const API = process.env.REACT_APP_API_SERVER;

export default function Index() {
  const [date, setDate] = useState(new Date());
  const [dailyLogs, setDailyLogs] = useState([]);
  const [healthLogs, setHealthLogs] = useState([]);
  const [showDailyModal, setShowDailyModal] = useState(false);
  const [showHealthModal, setShowHealthModal] = useState(false);
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
  const [selectedLog, setSelectedLog] = useState(null);
  const [modalMode, setModalMode] = useState('create');

  const petProfile = useRecoilValue(selectedPetProfileState);
  const [isLogin, setIsLogin] = useState(true);
  const [showLoginModal, setShowLoginModal] = useState(false);

  const fetchDailyLogs = async () => {
    if (!petProfile?.petName) return;
    try {
      const res = await axios.get(
        `${API}/logs/${encodeURIComponent(petProfile.petName)}`,
      );
      const allLogs = res.data.data || [];
      const filteredLogs = allLogs.filter(log => {
        const logDate = new Date(log.log_time).toDateString();
        return logDate === date.toDateString();
      });
      setDailyLogs(filteredLogs);
    } catch (err) {
      console.error('[일상기록 조회 실패]', err.response?.data || err.message);
    }
  };

  // 로그인 상태 확인
  useEffect(() => {
    const auth = localStorage.getItem('auth');
    if (!auth) {
      setIsLogin(false);
      setShowLoginModal(true);
    }
  }, []);

  useEffect(() => {
    const fetchDailyLogs = async () => {
      if (!petProfile?.petName) return;
      try {
        const res = await axios.get(
          `${API}/logs/${encodeURIComponent(petProfile.petName)}`,
        );
        const allLogs = res.data.data || [];
        const filteredLogs = allLogs.filter(log => {
          const logDate = new Date(log.log_time).toDateString();
          return logDate === date.toDateString();
        });
        setDailyLogs(filteredLogs);
      } catch (err) {
        console.error(
          '[일상기록 조회 실패]',
          err.response?.data || err.message,
        );
      }
    };
    fetchDailyLogs();
  }, [date, petProfile]);

  useEffect(() => {
    const fetchHealthLogs = async () => {
      if (!petProfile?.petName) return;
      try {
        const res = await axios.get(
          `${API}/logs/health/${encodeURIComponent(petProfile.petName)}`,
        );
        setHealthLogs(res.data.data || []);
      } catch (err) {
        console.error(
          '[건강 기록 조회 실패]',
          err.response?.data || err.message,
        );
      }
    };
    fetchHealthLogs();
  }, [petProfile]);

  const getLogTitle = (type, mealType) => {
    if (type === 'MEAL') {
      const korMeal =
        mealType === 'FEED' ? '사료' : mealType === 'SNACK' ? '간식' : '약';
      return `식사 (${korMeal})`;
    }
    switch (type) {
      case 'WALK':
        return '산책';
      case 'HOSPITAL':
        return '병원';
      case 'GROOMING':
        return '미용';
      case 'BATH':
        return '목욕';
      case 'ETC':
        return '기타';
      default:
        return type;
    }
  };

  const uniqueYears = Array.from(
    new Set(healthLogs.map(log => new Date(log.hospital_log).getFullYear())),
  ).sort((a, b) => b - a);

  const filteredHealthLogs = healthLogs.filter(
    log => new Date(log.hospital_log).getFullYear() === selectedYear,
  );

  const handleDailyLogClick = log => {
    setSelectedLog(log);
    setModalMode('read');
    setShowDailyModal(true);
  };

  const handleHealthLogClick = log => {
    setSelectedLog(log);
    setModalMode('read');
    setShowHealthModal(true);
  };

  // 로그인 안 되어 있으면 모달만 렌더링
  if (!isLogin && showLoginModal) {
    return <LoginRequired onClose={() => setShowLoginModal(false)} />;
  }

  return (
    <div className="detail-container flex gap-4 p-4 flex-wrap w-full lg:flex-nowrap justify-center items-start max-w-screen-xl mx-auto">
      <div className="w-full lg:w-1/4 flex flex-col items-center">
        <div className="weather-wrapper w-[280px] h-[170px] aspect-square">
          <Weather />
        </div>

        <div className="pet-wrapper bg-plog-main2/30 p-4 rounded-xl w-full h-full">
          <h1 className="text-2xl font-bold text-plog-main4 text-center mb-4 leading-tight">
            반려동물의 정보,
            <br />
            일상 생활을 기록해주세요.
          </h1>
          {petProfile ? (
            <Pet className="pet-profile" mode="read" pet={petProfile} />
          ) : (
            <p className="text-center text-red-500">
              선택된 반려동물이 없습니다.
            </p>
          )}
        </div>
      </div>

      <div className="flex flex-col gap-4 w-full max-w-[800px]">
        <div className="daily-wrapper border border-plog-main2 p-4 rounded-xl w-full">
          <h2 className="text-4xl font-semibold text-plog-main4 mb-4">
            오늘의 일상
          </h2>
          <div className="daily-content flex flex-row gap-6 flex-nowrap">
            <div className="flex flex-col justify-between w-1/2 min-w-[300px]">
              <div className="daily-card bg-white rounded flex-1 overflow-y-auto max-h-60 text-sm">
                {dailyLogs.length > 0 ? (
                  dailyLogs.map(log => (
                    <div
                      key={log.log_id}
                      onClick={() => handleDailyLogClick(log)}
                      className="daily mb-4 p-3  bg-white rounded shadow-sm cursor-pointer"
                    >
                      <div className="font-semibold text-plog-main4 mb-1">
                        📌 {getLogTitle(log.type, log.mealType)}
                      </div>
                      {log.place && <div>📍 장소: {log.place}</div>}
                      {log.price > 0 && (
                        <div>💸 비용: {log.price.toLocaleString()}원</div>
                      )}
                      {log.take_time > 0 && (
                        <div>⏱️ 소요 시간: {log.take_time}분</div>
                      )}
                      {log.memo && <div>📝 메모: {log.memo}</div>}
                    </div>
                  ))
                ) : (
                  <div>기록이 없습니다.</div>
                )}
              </div>
              <button
                className="mt-4 text-white bg-plog-main5 hover:bg-plog-main4 py-2 px-4 rounded w-fit self-end"
                onClick={() => {
                  setModalMode('create');
                  setSelectedLog(null);
                  setShowDailyModal(true);
                }}
              >
                추가하기
              </button>
            </div>
            <div className="calendar-card border border-plog-main4 rounded shadow p-2 w-1/2 min-w-[300px]">
              <Calendar
                onChange={setDate}
                value={date}
                locale="ko"
                formatDay={(locale, date) => date.getDate().toString()}
                className="custom-calendar"
              />
            </div>
          </div>
        </div>

        <div className="health-wrapper border border-plog-main2 p-4 rounded-xl w-full">
          <h3 className="text-4xl font-semibold text-plog-main4 mb-4">
            건강 정보 기록 ({selectedYear}년)
          </h3>
          <div className="mb-4">
            <label className="mr-2 font-semibold text-plog-main4">
              연도 선택:
            </label>
            <select
              value={selectedYear}
              onChange={e => setSelectedYear(parseInt(e.target.value))}
              className="border border-plog-main4 rounded px-3 py-1"
            >
              {uniqueYears.map(year => (
                <option key={year} value={year}>
                  {year}년
                </option>
              ))}
            </select>
          </div>

          <div className="health-content flex flex-row gap-6 flex-nowrap mb-4">
            <div className="flex-1 health-card bg-white text-plog-main4 p-3 rounded">
              <div className="text-lg font-semibold mb-2">예방 접종</div>
              {filteredHealthLogs.length > 0 ? (
                filteredHealthLogs.map(log => (
                  <div
                    key={log.log_id}
                    onClick={() => handleHealthLogClick(log)}
                    className="text-sm text-gray-700 border-b border-dashed border-gray-300 pb-2 mb-2 cursor-pointer hover:bg-gray-100"
                  >
                    <div className="font-semibold">💉 {log.vaccination}</div>
                    <div>🏥 병원명: {log.hospital}</div>
                    <div>
                      📅 방문일시:{' '}
                      {new Date(log.hospital_log).toLocaleString('ko-KR', {
                        year: 'numeric',
                        month: '2-digit',
                        day: '2-digit',
                        hour: '2-digit',
                        minute: '2-digit',
                      })}
                    </div>
                    <div>
                      접종 여부:{' '}
                      {log.vaccination_log ? (
                        <span className="text-green-600 font-bold">
                          ✅ 완료
                        </span>
                      ) : (
                        <span className="text-red-500 font-bold">
                          ❌ 미완료
                        </span>
                      )}
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-sm text-gray-600">
                  {selectedYear}년 접종 내역이 없습니다.
                </p>
              )}
            </div>
          </div>
          <div className="flex justify-end">
            <button
              className="text-white bg-plog-main5 hover:bg-plog-main4 py-2 px-4 rounded"
              onClick={() => {
                setModalMode('create');
                setSelectedLog(null);
                setShowHealthModal(true);
              }}
            >
              건강기록 추가
            </button>
          </div>
        </div>
      </div>

      {showDailyModal && (
        <Daily
          selectedDate={date}
          pet={petProfile}
          onClose={() => {
            setShowDailyModal(false);
            setSelectedLog(null);
            setModalMode('create');
          }}
          mode={modalMode}
          editLog={selectedLog}
          onSuccess={() => {
            fetchDailyLogs();
            setShowDailyModal(false);
            setSelectedLog(null);
            setModalMode('create');
          }}
        />
      )}

      {showHealthModal && (
        <Health
          selectedDate={date}
          pet={petProfile}
          onClose={() => {
            setShowHealthModal(false);
            setSelectedLog(null);
            setModalMode('create');
          }}
          mode={modalMode}
          editLog={selectedLog}
          setHealthLogs={setHealthLogs}
          onSuccess={() => {
            const fetchHealthLogs = async () => {
              if (!petProfile?.petName) return;
              try {
                const res = await axios.get(
                  `${API}/logs/health/${encodeURIComponent(
                    petProfile.petName,
                  )}`,
                );
                setHealthLogs(res.data.data || []);
              } catch (err) {
                console.error(
                  '[건강 기록 조회 실패]',
                  err.response?.data || err.message,
                );
              }
            };

            fetchHealthLogs();
            setShowHealthModal(false);
            setSelectedLog(null);
            setModalMode('create');
          }}
        />
      )}
    </div>
  );
}
