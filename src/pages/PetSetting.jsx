import { useRecoilValue } from 'recoil';
import { selectedPetProfileState } from '../recoil/petAtom';
import Pet from '../components/Pet';
import InviteModal from '../components/Modal/InviteModal';
import { useState } from 'react';
import '../style/petSetting.scss';

export default function PetSetting() {
  const [collaborators, setCollaborators] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const petProfile = useRecoilValue(selectedPetProfileState);

  const toggleCheck = id => {
    setCollaborators(prev =>
      prev.map(c => (c.id === id ? { ...c, checked: !c.checked } : c)),
    );
  };

  const deleteSelected = () => {
    setCollaborators(prev => prev.filter(c => !c.checked));
  };

  const handleInviteSuccess = (nickNameOrEmail, requestId) => {
    const newCollaborator = {
      id: collaborators.length + 1,
      nickName: nickNameOrEmail,
      checked: false,
      requestId,
    };
    setCollaborators(prev => [...prev, newCollaborator]);
    setIsModalOpen(false);
  };

  return (
    <div className="container mx-auto px-4">
      <div className="pet-setting-container flex flex-col lg:flex-row justify-center items-start min-h-screen gap-8 pt-20">
        <div className="pet-card w-full lg:w-[360px]">
          <Pet mode="edit" pet={petProfile} />
        </div>

        <div className="collab-card border rounded-lg p-6 flex flex-col items-center gap-10 w-full max-w-4xl">
          <div className="w-full flex flex-col sm:flex-row justify-between items-center gap-4">
            <button className="btn-invite" onClick={() => setIsModalOpen(true)}>
              초대하기
            </button>
            <h2 className="text-3xl lg:text-5xl font-bold text-plog-main4 text-center">
              협업자 목록
            </h2>
            <button className="btn-delete" onClick={deleteSelected}>
              선택 삭제
            </button>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 gap-6 collaborator-grid w-full">
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
                  {c.nickName}
                </span>
              </label>
            ))}
          </div>
        </div>
      </div>

      {isModalOpen && (
        <InviteModal
          petName={petProfile?.petName || ''}
          onClose={() => setIsModalOpen(false)}
          onSuccess={handleInviteSuccess}
        />
      )}
    </div>
  );
}
