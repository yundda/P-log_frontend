export default function MyPage() {
  return (
    <div className="flex justify-center items-center min-h-screen p-8">
      {/* 프로필 카드 */}
      <div className="bg-white p-6 border-plog-main4 rounded-xl shadow-lg w-80 flex flex-col ">
        <div className="w-40 h-40 rounded-full bg-gray-300 mb-4 "></div>
        <button className="bg-plog-main5 text-white w-40 py-2 px-4 rounded-md mb-0">
          사진 수정하기
        </button>
        <label className="text-gray-700 w-full">닉네임</label>
        <input type="text" className="w-full border p-2 rounded-md mb-2" />

        <label className="text-gray-700 w-full">현재 비밀번호</label>
        <input type="password" className="w-full border p-2 rounded-md mb-2" />

        <label className="text-gray-700 w-full">새 비밀번호</label>
        <input type="password" className="w-full border p-2 rounded-md mb-2" />

        <button className="bg-plog-main5 text-white py-2 px-4 rounded-md mt-4">
          수정하기
        </button>
      </div>

      {/* 반려동물 카드 */}
      <div className="bg-white p-6 border-plog-main4 rounded-xl shadow-lg ml-8 w-[500px]">
        <h3 className="text-plog-main4 text-3xl font-bold mb-4">
          나의 반려동물
        </h3>
        <div className="grid grid-cols-2 gap-4">
          {[1, 2, 3, 4].map(item => (
            <div key={item} className="flex flex-col items-center">
              <div className="w-24 h-24 rounded-full bg-gray-300 mb-2"></div>
              <span className="bg-plog-main1 text-gray-700 px-2 py-1 rounded">
                이름
              </span>
              <button className="bg-plog-main5 text-white py-1 px-3 rounded-md mt-2">
                삭제하기
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* 로그아웃 버튼 */}
      <button className="bg-plog-main5 text-white py-2 px-6 rounded-md absolute bottom-10">
        로그아웃
      </button>
    </div>
  );
}
