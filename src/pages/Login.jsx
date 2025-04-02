import '../style/login.scss';

export default function Login() {
  return (
    <div className="login-container">
      <h3 className="title">로그인</h3>
      <div className="login-card">
        <img src="../../public/images/img1.png" alt="사진" className="img" />
        <form className="login-form">
          <label htmlFor="email">이메일:</label>
          <input type="email" id="email" name="email" required />

          <label htmlFor="password">비밀번호:</label>
          <input type="password" id="password" name="password" required />

          <div className="find-pw">
            <a href="/find-password">비밀번호 찾기</a>
          </div>

          <button type="submit">로그인</button>

          <div className="register-link">
            아직 계정이 없나요? <a href="/register">회원가입</a>
          </div>
        </form>
      </div>
    </div>
  );
}
