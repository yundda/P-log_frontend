import React, { useState, useEffect, useRef } from 'react';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';
import Pet from '../components/Pet';
import Daily from '../components/Modal/Daily';
import Health from '../components/Modal/Health';
import { useRecoilState, useRecoilValue } from 'recoil';
import { selectedPetProfileState } from '../recoil/petAtom';
import { dailyLogsState, healthLogsState } from '../recoil/petLogAtom';
import axios from '../api/axiosInterceptor';
import '../style/index.scss';
import '../style/addPet.scss';
import Weather from '../components/API/Weather';
import { motion } from 'framer-motion';

const API = process.env.REACT_APP_API_SERVER;

export const fetchDailyLogs = async (petName, setDailyLogs) => {
  try {
    const res = await axios.get(`${API}/logs/${encodeURIComponent(petName)}`);
    setDailyLogs(res.data.data || []);
  } catch (err) {
    console.error('[일상기록 조회 실패]', err.response?.data || err.message);
  }
};

export const fetchHealthLogs = async (petName, setHealthLogs) => {
  try {
    const res = await axios.get(
      `${API}/logs/health/${encodeURIComponent(petName)}`,
    );
    setHealthLogs(res.data.data || []);
  } catch (err) {
    console.error('[건강 기록 조회 실패]', err.response?.data || err.message);
  }
};

export default function Index() {
  const [date, setDate] = useState(new Date());
  const [showDailyModal, setShowDailyModal] = useState(false);
  const [showHealthModal, setShowHealthModal] = useState(false);
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
  const [selectedLog, setSelectedLog] = useState(null);
  const [modalMode, setModalMode] = useState('create');

  const petProfile = useRecoilValue(selectedPetProfileState);
  const [dailyLogs, setDailyLogs] = useRecoilState(dailyLogsState);
  const [healthLogs, setHealthLogs] = useRecoilState(healthLogsState);

  const [isLogin, setIsLogin] = useState(true);
  const [showLoginModal, setShowLoginModal] = useState(false);

  const sectionRefs = useRef([]);

  useEffect(() => {
    const auth = localStorage.getItem('auth');
    if (!auth) {
      setIsLogin(false);
      setShowLoginModal(true);
    }
  }, []);

  useEffect(() => {
    if (!petProfile?.petName) return;

    setDailyLogs([]);
    setHealthLogs([]);

    fetchDailyLogs(petProfile.petName, setDailyLogs);
    fetchHealthLogs(petProfile.petName, setHealthLogs);
  }, [petProfile]);

  useEffect(() => {
    if (healthLogs.length > 0) {
      const years = Array.from(
        new Set(
          healthLogs.map(log => new Date(log.hospital_log).getFullYear()),
        ),
      ).filter(year => !isNaN(year));

      setSelectedYear(
        years.length > 0 ? Math.max(...years) : new Date().getFullYear(),
      );
    }
  }, [healthLogs]);

  useEffect(() => {
    if (!isLogin) {
      let currentIndex = 0;

      const interval = setInterval(() => {
        if (sectionRefs.current[currentIndex]) {
          sectionRefs.current[currentIndex].scrollIntoView({
            behavior: 'smooth',
            block: 'start',
          });
          currentIndex = (currentIndex + 1) % sectionRefs.current.length;
        }
      }, 5000);

      return () => clearInterval(interval);
    }
  }, [isLogin]);

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

  const filteredHealthLogs = healthLogs.filter(
    log => new Date(log.hospital_log).getFullYear() === selectedYear,
  );

  const filteredDailyLogs = dailyLogs.filter(
    log => new Date(log.log_time).toDateString() === date.toDateString(),
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

  const handleLogin = () => {
    window.location.href = '/login';
  };
  const handleSignup = () => {
    window.location.href = '/register';
  };

  const fadeIn = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0, transition: { duration: 0.7 } },
  };

  // 로그인 안 했을 때
  if (!isLogin) {
    return (
      <div className="w-full min-h-screen text-gray-800 flex flex-col scroll-smooth relative">
        {/* Navigation Dots */}
        <div className="fixed right-6 top-1/2 transform -translate-y-1/2 z-50 flex flex-col items-center gap-2">
          {[0, 1, 2].map((_, index) => (
            <div
              key={index}
              className="w-3 h-3 rounded-full bg-gray-300 hover:bg-plog-main4 transition-all cursor-pointer"
              onClick={() =>
                sectionRefs.current[index]?.scrollIntoView({
                  behavior: 'smooth',
                })
              }
            />
          ))}
        </div>

        {/* Section 0 */}
        <motion.section
          ref={el => (sectionRefs.current[0] = el)}
          className="w-full max-w-7xl px-6 py-20 flex flex-col lg:flex-row-reverse items-center gap-10 text-center lg:text-left mx-auto"
          initial="hidden"
          whileInView="show"
          viewport={{ once: true }}
          variants={fadeIn}
        >
          <div className="w-full lg:w-2/3">
            <img
              src="/images/main2.jpg"
              alt="반려동물 메인 이미지"
              className="rounded-3xl shadow-xl w-full object-cover max-h-[400px]"
            />
          </div>

          <div className="w-full lg:w-1/3 flex flex-col items-center gap-6">
            <img
              src="/images/main1.gif"
              alt="반려동물 캐릭터"
              className="w-28 h-28 rounded-full shadow-lg"
            />
            <div className="bg-white px-6 py-4 rounded-xl shadow-md text-lg relative max-w-md">
              <p>
                요기요~ 🪽{' '}
                <span className="font-bold text-plog-main4">
                  일상 기록 요정
                </span>{' '}
                등장!
                <br />
                오늘 있었던 일들, 다~ 기록해줄게요!
                <br />
                같이 해볼까요? 😎
              </p>
              <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-full w-0 h-0 border-l-[10px] border-l-transparent border-r-[10px] border-r-transparent border-b-[20px] border-b-white" />
            </div>
            <div className="flex gap-3">
              <button
                onClick={handleLogin}
                className="bg-plog-main5 hover:bg-plog-main4 text-white font-semibold px-6 py-3 rounded-full shadow transition-all"
              >
                로그인하러 가기 🚀
              </button>
              <button
                onClick={handleSignup}
                className="bg-white border border-plog-main5 text-plog-main5 font-semibold px-6 py-3 rounded-full shadow hover:bg-plog-main5 hover:text-white transition-all"
              >
                회원가입
              </button>
            </div>
          </div>
        </motion.section>

        {/* Section 1 */}
        <motion.section
          ref={el => (sectionRefs.current[1] = el)}
          className="flex flex-col lg:flex-row items-center justify-center gap-10 px-6 py-20 max-w-7xl w-full relative"
          initial="hidden"
          whileInView="show"
          viewport={{ once: true }}
          variants={fadeIn}
        >
          <div className="relative w-full lg:w-2/3 h-[400px]">
            <img
              src="/images/main3-1.gif"
              alt="세계 반려동물의 날"
              className="absolute top-0 left-0 w-1/2 h-auto rounded-3xl shadow-xl object-contain"
            />
            <img
              src="/images/main3-2.gif"
              alt="세계 반려동물의 날"
              className="absolute bottom-0 right-0 w-1/2 h-auto rounded-3xl shadow-xl object-contain"
            />
          </div>
          <div className="w-full lg:w-1/3 flex flex-col gap-6">
            <h2 className="text-3xl lg:text-4xl font-bold text-plog-main4 leading-snug">
              4월 11일은 세계 반려동물의 날! 🐾
            </h2>
            <p className="text-gray-600">
              사람과 동물이 함께 살아가는 아름다운 세상을 위한 날이에요.
              <br />
              오늘도 우리 가족 같은 반려동물과의 하루를 소중하게 남겨볼까요?
            </p>
          </div>
        </motion.section>

        {/* Section 2 */}
        <motion.section
          ref={el => (sectionRefs.current[2] = el)}
          className="flex flex-col items-center justify-between gap-10 px-6 py-20 max-w-7xl w-full border-t border-gray-200"
          initial="hidden"
          whileInView="show"
          viewport={{ once: true }}
          variants={fadeIn}
        >
          <div className="w-full flex flex-col gap-6">
            <h2 className="text-3xl lg:text-4xl font-bold text-plog-main4 leading-snug text-center">
              반려동물의 일상부터 건강까지
              <br />
              하나도 놓치지 마세요 🐶💉
            </h2>
            <p className="text-gray-600 text-center">
              산책, 식사, 목욕부터 병원 방문과 예방접종까지!
              <br />
              다양한 활동과 건강 기록을 쉽게 남기고,
              <br />
              연도별로 정리해 한눈에 확인할 수 있어요.
            </p>
          </div>
          <div className="grid grid-cols-2 gap-6 w-full">
            {['main4-1.gif', 'main4-2.gif', 'main4-3.gif', 'main4-4.gif'].map(
              (img, idx) => (
                <img
                  key={idx}
                  src={`/images/${img}`}
                  alt="기록 통합 이미지"
                  className="rounded-3xl shadow-xl object-contain max-h-[240px] w-full"
                />
              ),
            )}
          </div>
        </motion.section>
      </div>
    );
  }

  return (
    <div className="detail-container flex gap-4 p-4 flex-wrap w-full lg:flex-nowrap justify-center items-start max-w-screen-xl mx-auto">
      {/* 좌측: 날씨 + 펫 정보 */}
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

      {/* 우측: 일상 및 건강 기록 */}
      <div className="flex flex-col gap-4 w-full max-w-[800px]">
        {/* 일상 기록 */}
        <div className="daily-wrapper border border-plog-main2 p-4 rounded-xl w-full">
          <h2 className="text text-4xl font-semibold text-plog-main4 mb-4">
            오늘의 일상
          </h2>
          <div className="daily-content flex flex-row gap-6 flex-nowrap">
            <div className="flex flex-col justify-between w-1/2 min-w-[300px]">
              <div className="daily-card bg-white rounded flex-1 overflow-y-auto max-h-60 text-sm">
                {filteredDailyLogs.length > 0 ? (
                  filteredDailyLogs.map(log => (
                    <div
                      key={log.log_id}
                      onClick={() => handleDailyLogClick(log)}
                      className="daily mb-4 p-3 bg-white rounded shadow-sm cursor-pointer"
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
                  <div className="text-gray-500">
                    📭 아직 기록이 없습니다. 첫 기록을 추가해보세요!
                  </div>
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

        {/* 건강 기록 */}
        <div className="health-wrapper border border-plog-main2 p-4 rounded-xl w-full">
          <h3 className="text text-4xl font-semibold text-plog-main4 mb-4">
            예방 접종 기록 ({selectedYear}년)
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
              {Array.from(
                new Set(
                  healthLogs.map(log =>
                    new Date(log.hospital_log).getFullYear(),
                  ),
                ),
              )
                .filter(year => !isNaN(year))
                .sort((a, b) => b - a)
                .map(year => (
                  <option key={year} value={year}>
                    {year}년
                  </option>
                ))}
            </select>
          </div>

          <div className="health-content flex flex-row gap-6 flex-nowrap mb-4">
            <div className="flex-1 health-card bg-white text-plog-main4 p-3 rounded">
              <div className="text-lg font-semibold mb-2">
                예방 접종 / 예방접종 예정
              </div>
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

      {/* 모달 */}
      {showDailyModal && (
        <Daily
          selectedDate={date}
          pet={petProfile}
          onClose={() => {
            fetchDailyLogs(petProfile.petName, setDailyLogs);
            setShowDailyModal(false);
            setSelectedLog(null);
            setModalMode('create');
          }}
          mode={modalMode}
          editLog={selectedLog}
        />
      )}

      {showHealthModal && (
        <Health
          selectedDate={date}
          pet={petProfile}
          onClose={() => {
            fetchHealthLogs(petProfile.petName, setHealthLogs);
            setShowHealthModal(false);
            setSelectedLog(null);
            setModalMode('create');
          }}
          mode={modalMode}
          editLog={selectedLog}
        />
      )}
    </div>
  );
}
