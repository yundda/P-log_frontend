import '../style/accept.scss';

export default function Accept() {
  return (
    <div className="accept-wrapper flex flex-col items-center justify-center min-h-screen">
      <div className="accept-card border border-plog-main4 bg-white rounded-lg p-10 flex flex-col items-center gap-4">
        <img
          src="/images/user.png"
          alt="user-profile"
          className="user-profile w-32 h-32 rounded-full object-cover"
        />
        <h3 className="accept-alert text-2xl font-semibold">
          <span className="font-bold">nickname</span>님이
          초대하였습니다./참여하고 싶습니다.
        </h3>

        <div className="flex items-center gap-2 mt-2">
          <img
            src="/images/img1.png"
            alt="pet-profile"
            className="w-10 h-10 rounded-full object-cover"
          />
          <h3 className="text-xl font-bold text-color-4">Julie</h3>
        </div>

        <button className="accept-button mt-4">초대 수락</button>
      </div>
    </div>
  );
}
