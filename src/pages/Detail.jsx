import React, { useState } from 'react';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';
import Pet from '../components/Pet';
import Daily from '../components/Modal/Daily';
import Health from '../components/Modal/Health';
import { useRecoilValue } from 'recoil';
import { selectedPetProfileState } from '../recoil/petAtom';
import '../style/detail.scss';
import '../style/addPet.scss';

export default function Detail() {
  const [date, setDate] = useState(new Date());
  const [showDailyModal, setShowDailyModal] = useState(false);
  const [showHealthModal, setShowHealthModal] = useState(false);

  const petProfile = useRecoilValue(selectedPetProfileState);

  return (
    <div className="detail-container flex gap-4 p-4 flex-wrap w-full lg:flex-nowrap justify-center items-start max-w-screen-xl mx-auto">
      <div className="pet-wrapper bg-plog-main2/30 p-4 rounded-xl w-full h-full lg:w-1/4">
        <h1 className="text-2xl font-bold text-plog-main4 text-center mb-4 leading-tight">
          반려동물의 정보,
          <br />
          일상 생활을 기록해주세요.
        </h1>
        <Pet className="pet-profile" mode="read" pet={petProfile} />
      </div>

      <div className="flex flex-col gap-4 w-full max-w-[800px]">
        <div className="daily-wrapper border border-plog-main2 p-4 rounded-xl w-full">
          <h2 className="text-4xl font-semibold text-plog-main4 mb-4">
            오늘의 일상
          </h2>
          <div className="daily-content flex flex-row gap-6 flex-nowrap">
            <div className="flex flex-col justify-between w-1/2 min-w-[300px]">
              <div className="daily-card border border-plog-main4 text-plog-main4 p-3 bg-white rounded flex-1">
                <div>· 산책했음</div>
                <span>...님이 작성하셨습니다.</span>
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

        <div className="health-wrapper border border-plog-main2 p-4 rounded-xl w-full">
          <h3 className="text-4xl font-semibold text-plog-main4 mb-4">
            이번달 건강 정보 기록
          </h3>
          <div className="health-content flex flex-row gap-6 flex-nowrap mb-4">
            <div className="flex flex-col justify-between w-1/2 min-w-[300px] pr-4">
              <div className="health-card flex-1 bg-white text-plog-main4 p-3 rounded">
                <div className="text-lg font-semibold mb-2">예방 접종</div>
                <p className="text-sm text-gray-600">
                  이번달 접종 내역이 없습니다.
                </p>
              </div>
            </div>

            <div className="flex flex-col justify-between w-1/2 min-w-[300px] pl-4 border-l-2 border-plog-main4">
              <div className="health-card flex-1 bg-white text-plog-main4 p-3 rounded">
                <div className="text-lg font-semibold mb-2">병원 방문 내역</div>
                <p className="text-sm text-gray-600">
                  최근 병원 방문 기록이 없습니다.
                </p>
              </div>
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

      {showDailyModal && (
        <div className="modal-overlay">
          <div className="modal-content">
            <button
              className="close-button"
              onClick={() => setShowDailyModal(false)}
            >
              &times;
            </button>
            <Daily />
          </div>
        </div>
      )}

      {showHealthModal && (
        <div className="modal-overlay">
          <div className="modal-content">
            <button
              className="close-button"
              onClick={() => setShowHealthModal(false)}
            >
              &times;
            </button>
            <Health />
          </div>
        </div>
      )}
    </div>
  );
}
