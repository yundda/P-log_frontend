import React, { useState } from 'react';
import Calendar from 'react-calendar';
// import { ko } from 'date-fns/locale';
import 'react-calendar/dist/Calendar.css';
import Pet from '../components/Pet';
import '../style/detail.scss';

export default function Detail() {
  const [date, setDate] = useState(new Date());

  return (
    <div className="detail-container flex gap-4 p-4 flex-wrap lg:flex-nowrap justify-center items-start">
      {/* 반려동물 정보 */}
      <div className="pet-wrapper bg-plog-main2/30 p-4 rounded-xl w-full h- full lg:w-1/4">
        <h1 className="text-2xl font-bold text-plog-main4 text-center mb-4 leading-tight">
          반려동물의 정보,
          <br />
          일상 생활을 기록해주세요.
        </h1>
        <Pet className="pet-profile" mode="read" />
      </div>

      <div className="flex flex-col gap-4 w-[800px] ">
        {/* 오늘의 일상 */}

        <div className="daily-wrapper border border-plog-main2 p-4 rounded-xl w-full">
          <h2 className="text-4xl font-semibold text-plog-main4 mb-4">
            오늘의 일상
          </h2>
          <div className="flex flex-row justify-between items-start gap-6 flex-wrap lg:flex-nowrap">
            <div className="flex flex-col gap-4 w-full lg:w-1/2">
              <div className="daily-card border border-plog-main4 text-plog-main4 p-3 bg-white rounded">
                <div>· 산책했음</div>
                <span>...님이 작성하셨습니다.</span>
              </div>
              <button className="text-white bg-plog-main5 hover:bg-plog-main4 py-2 px-4 rounded w-fit self-end">
                추가하기
              </button>
            </div>
            <div className="calendar-card border border-plog-main4 rounded shadow p-2 w-full lg:w-1/2">
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
        <div className="health-wrapper border border-plog-main2 p-4 rounded-xl w-full lg:w-4/4">
          <h3 className="text-xl font-semibold text-plog-main4 mb-4">
            이번달 건강 정보 기록
          </h3>

          <div className="flex flex-row justify-between items-start gap-4">
            <div className="vacc-card w-1/2 border-r border-plog-main4 pr-4">
              <div className="text-plog-main4 font-semibold">예방 접종</div>
              <p className="text-sm text-gray-600"></p>
            </div>

            <div className="hospital-card w-1/2 pl-4">
              <div className="text-plog-main4 font-semibold">
                병원 방문 내역
              </div>
              <p className="text-sm text-gray-600"></p>
            </div>
          </div>
          <button className="text-white bg-plog-main5 hover:bg-plog-main4 py-2 px-4 rounded w-fit self-end mt-4">
            건강 추가하기
          </button>
        </div>
      </div>
    </div>
  );
}
