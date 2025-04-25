import { useRecoilValue } from 'recoil';
import { selectedPetProfileState } from '../recoil/petAtom';
import Pet from '../components/Pet';
import InviteModal from '../components/Modal/InviteModal';
import { useState, useEffect } from 'react';
import axios from '../api/axiosInterceptor';
import '../style/petSetting.scss';
import Developing from '../components/Modal/Developing';
import LoginRequired from '../components/Modal/LoginRequired';
import PetBreeds from '../components/API/PetBreeds';
import Alert from '../components/Modal/Alert';

const API = process.env.REACT_APP_API_SERVER;

export default function PetSetting() {
  const [collaborators, setCollaborators] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [inviteResult, setInviteResult] = useState(null);
  const [showDeveloping, setShowDeveloping] = useState(false);
  const [isLogin, setIsLogin] = useState(true);
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [showAlert, setShowAlert] = useState(false);

  const petProfile = useRecoilValue(selectedPetProfileState);

  const handlePetEditSuccess = () => {
    setShowAlert(true);
  };

  useEffect(() => {
    const auth = localStorage.getItem('auth');
    if (!auth) {
      setIsLogin(false);
      setShowLoginModal(true);
    }
  }, []);

  useEffect(() => {
    if (!petProfile || !petProfile.petName) return;

    const fetchCollaborators = async () => {
      try {
        const res = await axios.get(`${API}/user/family/${petProfile.petName}`);
        if (res.data.code === 'SU') {
          const formattedList = res.data.data.familyList.map((member, idx) => ({
            id: idx + 1,
            nickName: member.nickName,
            profileImage: member.profileImage
              ? `/images/${member.profileImage}.png`
              : '/images/profile1.png',
            checked: false,
          }));
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

  const handleInviteSuccess = result => {
    setInviteResult(result);
    setIsModalOpen(false);
  };

  if (!isLogin && showLoginModal) {
    return <LoginRequired onClose={() => setShowLoginModal(false)} />;
  }

  return (
    <div className="petsetting-bigcontainer mx-auto px-40">
      <div className="pet-setting-container">
        <div className="pet-card-read">
          <Pet mode="edit" pet={petProfile} onSuccess={handlePetEditSuccess} />
        </div>

        <div className="right-section flex flex-col gap-8">
          <div className="collab-card">
            <div className="w-full flex justify-between items-center gap-4 mb-4">
              <div className="flex-1 flex justify-start">
                <button
                  className="btn-invite"
                  onClick={() => setIsModalOpen(true)}
                >
                  초대하기
                </button>
              </div>
              <div className="flex-1 text-center">
                <h2 className="text-2xl font-bold text-plog-main4">
                  협업자 목록
                </h2>
              </div>
              <div className="flex-1 flex justify-end">
                <button
                  className="btn-delete"
                  onClick={() => setShowDeveloping(true)}
                >
                  삭제하기
                </button>
              </div>
            </div>

            <div className="collaborator-grid">
              {collaborators.length > 0 ? (
                collaborators.map(c => (
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
                      src={c.profileImage}
                      alt="협업자"
                      className="w-28 h-28 rounded-full border-2 border-[#f1c27d] shadow-sm"
                    />
                    <span className="text-gray-700 mt-3 font-semibold text-base">
                      {c.nickName}
                    </span>
                  </label>
                ))
              ) : (
                <p className="text-gray-400 ">협업자가 없습니다.</p>
              )}
            </div>
          </div>

          <div className="pet-breed-card">
            <PetBreeds />
          </div>
        </div>
      </div>

      {isModalOpen && (
        <InviteModal
          petName={petProfile.petName}
          onClose={() => setIsModalOpen(false)}
          onSuccess={handleInviteSuccess}
        />
      )}

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

      {showAlert && (
        <Alert
          message="반려동물 정보가 성공적으로 수정되었습니다."
          onClose={() => setShowAlert(false)}
        />
      )}
    </div>
  );
}
