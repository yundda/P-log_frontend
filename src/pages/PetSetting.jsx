import { useState } from 'react';
import Pet from '../components/Pet';
import InviteModal from '../components/InviteModal';
import '../style/petSetting.scss';

export default function PetSetting() {
  const [collaborators, setCollaborators] = useState(
    Array(6)
      .fill(0)
      .map((_, i) => ({ id: i, nickname: `닉네임${i + 1}`, checked: false })),
  );
  const [isModalOpen, setIsModalOpen] = useState(false);

  const toggleCheck = id => {
    setCollaborators(prev =>
      prev.map(c => (c.id === id ? { ...c, checked: !c.checked } : c)),
    );
  };

  const deleteSelected = () => {
    setCollaborators(prev => prev.filter(c => !c.checked));
  };

  return (
    <div className="container mt-20 ml-40">
      <div className="pet-setting-container flex flex-row justify-center items-start min-h-screen gap-20 pt-20">
        <div className="pet-card ml-4">
          <Pet />
        </div>

        <div className="collab-card border rounded-lg p-6 flex flex-col items-center gap-10 w-full max-w-4xl">
          <div className="w-full flex justify-between items-center">
            <button className="btn-invite" onClick={() => setIsModalOpen(true)}>
              초대하기
            </button>
            <h2 className="text-5xl font-bold text-plog-main4">협업자 목록</h2>
            <button className="btn-delete" onClick={deleteSelected}>
              선택 삭제
            </button>
          </div>

          <div className="grid grid-cols-3 gap-8 collaborator-grid">
            {collaborators.map(c => (
              <label
                key={c.id}
                className="group flex flex-col items-center p-6 bg-[#fefaf6] rounded-2xl shadow-md hover:shadow-lg transition-shadow duration-300 cursor-pointer"
              >
                <input
                  type="checkbox"
                  checked={c.checked}
                  onChange={() => toggleCheck(c.id)}
                  className="mb-3 accent-[#ddb892] w-5 h-5 group-hover:scale-110 transition-transform"
                />
                <img
                  src="/images/img1.png"
                  alt="협업자"
                  className="w-28 h-28 rounded-full border-2 border-[#f1c27d] shadow-sm"
                />
                <span className="text-gray-700 mt-3 font-semibold text-base">
                  {c.nickname}
                </span>
              </label>
            ))}
          </div>
        </div>
      </div>

      {isModalOpen && <InviteModal onClose={() => setIsModalOpen(false)} />}
    </div>
  );
}
