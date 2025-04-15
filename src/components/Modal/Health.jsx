import '../../style/addPet.scss';

export default function Health() {
  return (
    <div className="add-container bg-plog-main2/40 flex-container">
      <h1 className="text-plog-main4 font-bold text-4xl mb-6">건강 기록</h1>

      <div className="content-wrapper">
        <div className="form-section flex flex-col gap-4 w-full max-w-xl">
          <label htmlFor="vaccination">예방 접종 날짜:</label>
          <input
            type="date"
            className="border border-plog-main1 rounded-md px-4 py-2"
          />

          <label htmlFor="vaccination_log">예방 접종 내용:</label>
          <input
            type="text"
            className="border border-plog-main1 rounded-md px-4 py-2"
          />

          <label htmlFor="hospital">병원 이름:</label>
          <input
            type="text"
            className="border border-plog-main1 rounded-md px-4 py-2"
          />

          <label htmlFor="hospital_log">방문 기록:</label>
          <input
            type="text"
            className="border border-plog-main1 rounded-md px-4 py-2"
          />

          <label htmlFor="price">비용:</label>
          <input
            type="text"
            className="border border-plog-main1 rounded-md px-4 py-2"
          />

          <button className="send-button self-end mt-4">기록 저장</button>
        </div>
      </div>
    </div>
  );
}
