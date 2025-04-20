export default function Developing({ onClose }) {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl shadow-lg w-[90%] max-w-xs p-6 text-center">
        <p className="text-lg font-medium mb-4">
          멍멍! 아직 준비 중이에요 🐶 조금만 기다려 주세요!
        </p>
        <button
          onClick={onClose}
          className="bg-plog-main5 text-white px-4 py-2 rounded-md hover:bg-plog-main4 transition"
        >
          닫기
        </button>
      </div>
    </div>
  );
}
