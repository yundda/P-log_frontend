export default function Alert({ message, onClose }) {
  return (
    <div className="modal-overlay">
      <div
        className="modal-content relative p-6 bg-white rounded-xl shadow-lg mx-auto text-center"
        style={{ width: '280px', maxWidth: '100%' }}
      >
        <p className="text-base text-gray-800 whitespace-pre-wrap">{message}</p>
        <button
          className="mt-6 px-4 py-2 bg-plog-main5 text-white rounded hover:bg-plog-main4"
          onClick={onClose}
        >
          확인
        </button>
      </div>
    </div>
  );
}
