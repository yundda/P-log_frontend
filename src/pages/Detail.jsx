Detail.jsx;
import React, { useState, useEffect } from 'react';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';
import Pet from '../components/Pet';
import Daily from '../components/Modal/Daily';
import Health from '../components/Modal/Health';
import { useRecoilValue } from 'recoil';
import { selectedPetProfileState } from '../recoil/petAtom';
import axios from '../api/axiosInterceptor';
import '../style/detail.scss';
import '../style/addPet.scss';

const API = process.env.REACT_APP_API_SERVER;

export default function Detail() {
  const [date, setDate] = useState(new Date());
  const [dailyLogs, setDailyLogs] = useState([]);
  const [healthLogs, setHealthLogs] = useState([]);
  const [showDailyModal, setShowDailyModal] = useState(false);
  const [showHealthModal, setShowHealthModal] = useState(false);

  const petProfile = useRecoilValue(selectedPetProfileState);

  useEffect(() => {
    console.log('[선택된 날짜]', date.toISOString());
  }, [date]);

  useEffect(() => {
    console.log('[선택된 펫 프로필]', petProfile);
    console.log('[petProfile.id]', petProfile?.id); // 확인 로그
  }, [petProfile]);

  // 일상 기록 조회
  useEffect(() => {
    const fetchDailyLogs = async () => {
      if (!petProfile?.petName) {
        console.warn('[일상기록] petProfile.petName이 없습니다.');
        return;
      }

      try {
        const res = await axios.get(`${API}/logs/${petProfile.petName}`);
        console.log('[일상기록 전체 응답]', res.data);

        const allLogs = res.data.detailLogs;
        const filteredLogs = allLogs.filter(log => {
          const logDate = new Date(log.log_time).toDateString();
          return logDate === date.toDateString();
        });

        console.log('[선택 날짜의 일상기록]', filteredLogs);
        setDailyLogs(filteredLogs);
      } catch (err) {
        console.error('[일상기록 조회 실패]', err);
        if (err.response) console.error('[서버 응답]', err.response.data);
      }
    };

    fetchDailyLogs();
  }, [date, petProfile]);

  // 건강 기록 조회
  useEffect(() => {
    const fetchHealthLogs = async () => {
      if (!petProfile?.petName) {
        console.warn('[건강기록] petProfile.petName이 없습니다.');
        return;
      }

      try {
        const res = await axios.get(`${API}/logs/health/${petProfile.petName}`);
        console.log('[건강기록 응답]', res.data);
        setHealthLogs(res.data.healthLogs || []);
      } catch (err) {
        console.error('[건강기록 조회 실패]', err);
        if (err.response) console.error('[서버 응답]', err.response.data);
      }
    };

    fetchHealthLogs();
  }, [petProfile]);

  return (
    <div className="detail-container flex gap-4 p-4 flex-wrap w-full lg:flex-nowrap justify-center items-start max-w-screen-xl mx-auto">
      {/* 펫 카드 */}
      <div className="pet-wrapper bg-plog-main2/30 p-4 rounded-xl w-full h-full lg:w-1/4">
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

      {/* 일상 + 건강 기록 */}
      <div className="flex flex-col gap-4 w-full max-w-[800px]">
        {/* 일상 */}
        <div className="daily-wrapper border border-plog-main2 p-4 rounded-xl w-full">
          <h2 className="text-4xl font-semibold text-plog-main4 mb-4">
            오늘의 일상
          </h2>
          <div className="daily-content flex flex-row gap-6 flex-nowrap">
            <div className="flex flex-col justify-between w-1/2 min-w-[300px]">
              <div className="daily-card border border-plog-main4 text-plog-main4 p-3 bg-white rounded flex-1 overflow-y-auto max-h-60">
                {dailyLogs.length > 0 ? (
                  dailyLogs.map(log => (
                    <div key={log.id} className="mb-3">
                      <div>· {log.memo}</div>
                      <span className="text-sm text-gray-500">
                        장소: {log.place}, 비용: {log.price}원
                      </span>
                    </div>
                  ))
                ) : (
                  <div>기록이 없습니다.</div>
                )}
              </div>
              <button
                className="mt-4 text-white bg-plog-main5 hover:bg-plog-main4 py-2 px-4 rounded w-fit self-end"
                onClick={() => setShowDailyModal(true)}
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
          <h3 className="text-4xl font-semibold text-plog-main4 mb-4">
            이번달 건강 정보 기록
          </h3>
          <div className="health-content flex flex-row gap-6 flex-nowrap mb-4">
            <div className="flex-1 health-card bg-white text-plog-main4 p-3 rounded">
              <div className="text-lg font-semibold mb-2">예방 접종</div>
              {healthLogs.length > 0 ? (
                healthLogs.map(log => (
                  <p key={log.id} className="text-sm text-gray-600">
                    {log.vaccination} ({log.hospital})
                  </p>
                ))
              ) : (
                <p className="text-sm text-gray-600">
                  이번달 접종 내역이 없습니다.
                </p>
              )}
            </div>
          </div>
          <div className="flex justify-end">
            <button
              className="text-white bg-plog-main5 hover:bg-plog-main4 py-2 px-4 rounded"
              onClick={() => setShowHealthModal(true)}
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
          onClose={() => setShowDailyModal(false)}
        />
      )}
      {showHealthModal && (
        <Health
          selectedDate={date}
          pet={petProfile}
          onClose={() => setShowHealthModal(false)}
          setHealthLogs={setHealthLogs}
        />
      )}
    </div>
  );
}
