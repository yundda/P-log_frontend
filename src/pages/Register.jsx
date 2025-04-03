import '../style/register.scss';

export default function Register() {
  return (
    <div className="register-container">
      <h3>회원가입</h3>
      <div className="register-card">
        <img src="/images/img1.png" alt="사진" className="img" />
        <form action="register-form" method="post">
          <label htmlFor="email">이메일:</label>
          <input type="email" />
          <button type="button">중복확인</button>

          <label htmlFor="nickname">닉네임:</label>
          <input type="text" />
          <button type="button">중복확인</button>

          <label htmlFor="password">비밀번호:</label>
          <input type="password" />

          <label htmlFor="password">비밀번호 확인:</label>
          <input type="password" />

          <button>회원가입</button>
          <div className="login-link">
            이미 계정이 있나요? <a href="/login">로그인</a>
          </div>
        </form>
      </div>
    </div>
  );
}
