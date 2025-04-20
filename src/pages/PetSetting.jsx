import { useRecoilValue } from 'recoil';
import { selectedPetProfileState } from '../recoil/petAtom';
import Pet from '../components/Pet';
import InviteModal from '../components/Modal/InviteModal';
import { useState, useEffect } from 'react';
import axios from '../api/axiosInterceptor';
import '../style/petSetting.scss';
import { useLocation } from 'react-router-dom';
import Developing from '../components/Modal/Developing';

const API = process.env.REACT_APP_API_SERVER;

export default function PetSetting() {
  const [collaborators, setCollaborators] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [inviteResult, setInviteResult] = useState(null);

  const petProfile = useRecoilValue(selectedPetProfileState);
  const location = useLocation();
  const { petName } = location.state || {};
  const [showDeveloping, setShowDeveloping] = useState(false);

  // 협업자 목록 불러오기
  useEffect(() => {
    if (!petProfile || !petProfile.petName) return;

    const fetchCollaborators = async () => {
      try {
        const res = await axios.get(`${API}/user/family/${petProfile.petName}`);
        if (res.data.code === 'SU') {
          const familyList = res.data.data.familyList;

          const formattedList = familyList.map((nickName, idx) => ({
            id: idx + 1,
            nickName,
            checked: false,
          }));

          console.log('[가져온 협업자 목록]', formattedList);
          setCollaborators(formattedList);
        }
      } catch (err) {
        console.error('[협업자 목록 불러오기 오류]', err);
      }
    };

    fetchCollaborators();
  }, [petProfile]);

  const toggleCheck = id => {
    setCollaborators(prev =>
      prev.map(c => (c.id === id ? { ...c, checked: !c.checked } : c)),
    );
  };

  // const deleteSelected = () => {
  //   const deleted = collaborators.filter(c => c.checked);
  //   console.log('[삭제할 협업자]', deleted);
  //   setCollaborators(prev => prev.filter(c => !c.checked));
  // };

  const handleInviteSuccess = result => {
    setInviteResult(result);
    setIsModalOpen(false);
  };

  return (
    <div className="container mx-auto px-4">
      <h1 className="text-2xl font-bold text-plog-main5">
        {petProfile?.petName || '🐾'} 설정 페이지
      </h1>

      <div className="pet-setting-container flex flex-col lg:flex-row justify-center items-start min-h-screen gap-8 pt-20">
        {/* 펫 정보 카드 */}
        <div className="pet-card w-full lg:w-[360px]">
          <Pet mode="edit" pet={petProfile} />
        </div>

        {/* 협업자 카드 */}
        <div className="collab-card border rounded-lg p-6 flex flex-col items-center gap-10 w-full max-w-4xl">
          <div className="w-full flex flex-col sm:flex-row justify-between items-center gap-4">
            <button className="btn-invite" onClick={() => setIsModalOpen(true)}>
              초대하기
            </button>
            <h2 className="text-3xl lg:text-5xl font-bold text-plog-main4 text-center">
              협업자 목록
            </h2>
            <button
              onClick={() => setShowDeveloping(true)}
              className="btn-delete"
            >
              삭제하기
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
                  src={
                    localStorage.getItem('profileIcon') ||
                    '/images/default-user.png'
                  }
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

      {/* 초대 모달 */}
      {isModalOpen && (
        <InviteModal
          petName={petProfile.petName}
          onClose={() => setIsModalOpen(false)}
          onSuccess={handleInviteSuccess}
        />
      )}

      {/* 초대 성공 결과 링크 출력 */}
      {inviteResult && (
        <div className="mt-6 p-4 bg-gray-100 rounded text-sm text-gray-800 shadow-md max-w-xl mx-auto">
          <p>
            ✅ <strong>{inviteResult.target}</strong> 님에게 초대가
            전송되었습니다.
          </p>
          <p>
            🔗 요청 링크:{' '}
            <a
              href={`/request/pending/${inviteResult.requestId}`}
              className="text-blue-600 underline"
              target="_blank"
              rel="noopener noreferrer"
            >
              /request/pending/{inviteResult.requestId}
            </a>
          </p>
          {inviteResult.receiverEmail && (
            <p>📧 이메일: {inviteResult.receiverEmail}</p>
          )}
        </div>
      )}
      {showDeveloping && (
        <Developing onClose={() => setShowDeveloping(false)} />
      )}
    </div>
  );
}
