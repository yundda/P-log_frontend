import '../../style/addPet.scss';
export default function Daily() {
  return (
    <div className="add-container bg-plog-main2/40 flex-container">
      <h1 className="text-plog-main4 font-bold text-4xl mb-6">일상 기록</h1>

      <div className="content-wrapper">
        <div className="form-section flex flex-col gap-4 w-full max-w-xl">
          <div className="choose-button flex gap-2 mb-4">
            <button className="send-button">식사</button>
            <button className="send-button">산책</button>
            <button className="send-button">미용</button>
            <button className="send-button">씻기</button>
            <button className="send-button">기타</button>
          </div>

          <label htmlFor="date">날짜와 시간:</label>
          <input
            type="date"
            className="border border-plog-main1 rounded-md px-4 py-2"
          />

          <label>식사 유형</label>
          <select className="border border-plog-main1 rounded-md px-4 py-2">
            <option value="feed">사료</option>
            <option value="snack">간식</option>
            <option value="medicine">약</option>
          </select>

          <label htmlFor="place">장소:</label>
          <input
            type="text"
            className="border border-plog-main1 rounded-md px-4 py-2"
          />

          <label htmlFor="price">비용:</label>
          <input
            type="number"
            className="border border-plog-main1 rounded-md px-4 py-2"
          />

          <label htmlFor="time">소요시간:</label>
          <input
            type="number"
            className="border border-plog-main1 rounded-md px-4 py-2"
          />

          <label htmlFor="memo">메모:</label>
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
