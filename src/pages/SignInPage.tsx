import { useEffect, useMemo, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { storage } from "../utils/storage";
import { getLoginUser, setLoginUser, User } from "../utils/auth";

type Mode = "login" | "register";

const REMEMBER_KEY = "rememberEmail";
const AUTOLOGIN_KEY = "keepLogin";

function isValidEmail(email: string) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

export default function SignInPage() {
    const navigate = useNavigate();
    const location = useLocation();
    const from = (location.state as any)?.from?.pathname || "/";

    const [mode, setMode] = useState<Mode>("login");

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState(""); // TMDB API Key로 사용
    const [password2, setPassword2] = useState("");

    const [agree, setAgree] = useState(false);
    const [rememberEmail, setRememberEmail] = useState(false);
    const [keepLogin, setKeepLogin] = useState(false);

    const users = useMemo<User[]>(() => storage.get<User[]>("users", []), []);

    // 이미 로그인되어 있으면 바로 이동
    useEffect(() => {
        const user = getLoginUser();
        if (user) navigate(from, { replace: true });
    }, [navigate, from]);

    // rememberEmail 불러오기
    useEffect(() => {
        const savedEmail = storage.get<string>(REMEMBER_KEY, "");
        const savedRemember = storage.get<boolean>(REMEMBER_KEY + ":enabled", false);
        const savedKeep = storage.get<boolean>(AUTOLOGIN_KEY, false);

        if (savedRemember && savedEmail) {
            setEmail(savedEmail);
            setRememberEmail(true);
        }
        setKeepLogin(savedKeep);
    }, []);

    const toggleMode = (next: Mode) => {
        if (next === mode) return;
        setMode(next);
        // 입력 초기화 일부
        setPassword("");
        setPassword2("");
        setAgree(false);
    };

    const handleLogin = () => {
        if (!isValidEmail(email)) return toast.error("이메일 형식이 올바르지 않습니다.");
        if (!password) return toast.error("비밀번호(TMDB API Key)를 입력하세요.");

        const currentUsers = storage.get<User[]>("users", []);
        const user = currentUsers.find((u) => u.id === email && u.password === password);

        if (!user) return toast.error("로그인 실패: 이메일 또는 비밀번호가 올바르지 않습니다.");

        setLoginUser(user);

        // remember / keepLogin 저장
        storage.set(REMEMBER_KEY + ":enabled", rememberEmail);
        if (rememberEmail) storage.set(REMEMBER_KEY, email);
        else storage.remove(REMEMBER_KEY);

        storage.set(AUTOLOGIN_KEY, keepLogin);

        toast.success("로그인 성공!");
        navigate(from, { replace: true });
    };

    const handleRegister = () => {
        if (!isValidEmail(email)) return toast.error("이메일 형식이 올바르지 않습니다.");
        if (!password) return toast.error("비밀번호(TMDB API Key)를 입력하세요.");
        if (password.length < 8) return toast.error("비밀번호는 8자 이상을 권장합니다.");
        if (password !== password2) return toast.error("비밀번호 확인이 일치하지 않습니다.");
        if (!agree) return toast.error("약관 동의는 필수입니다.");

        const currentUsers = storage.get<User[]>("users", []);
        const exists = currentUsers.some((u) => u.id === email);
        if (exists) return toast.error("이미 가입된 이메일입니다.");

        const newUser: User = { id: email, password };
        storage.set("users", [...currentUsers, newUser]);

        toast.success("회원가입 성공! 로그인 해주세요.");
        setMode("login"); // 회원가입 성공 시 로그인 화면으로 전환(요구사항)
        setPassword("");
        setPassword2("");
        setAgree(false);
    };

    return (
        <div className="auth">
            <div className={`auth__card ${mode === "register" ? "is-register" : "is-login"}`}>
                {/* 좌/우 패널 */}
                <section className="auth__panel auth__panel--info">
                    <h1 className="auth__brand">PBFLIX</h1>
                    <p className="auth__desc">
                        TMDB API로 영화 포스터를 불러오는 데모 사이트
                        <br />
                        {mode === "login" ? "처음이신가요? 회원가입을 진행해요." : "이미 계정이 있나요? 로그인해요."}
                    </p>

                    <div className="auth__switch">
                        {mode === "login" ? (
                            <button className="btn btn--ghost" onClick={() => toggleMode("register")}>
                                회원가입으로 전환
                            </button>
                        ) : (
                            <button className="btn btn--ghost" onClick={() => toggleMode("login")}>
                                로그인으로 전환
                            </button>
                        )}
                    </div>

                    <div className="auth__tip">
                        <span>TIP</span> 비밀번호는 <b>TMDB API Key</b>로 사용됩니다.
                    </div>
                </section>

                {/* 폼 패널 */}
                <section className="auth__panel auth__panel--form">
                    <div className="auth__tabs">
                        <button
                            className={`tab ${mode === "login" ? "active" : ""}`}
                            onClick={() => toggleMode("login")}
                        >
                            로그인
                        </button>
                        <button
                            className={`tab ${mode === "register" ? "active" : ""}`}
                            onClick={() => toggleMode("register")}
                        >
                            회원가입
                        </button>
                    </div>

                    <div className="auth__form">
                        <label className="field">
                            <span>이메일</span>
                            <input
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                placeholder="example@email.com"
                                autoComplete="email"
                            />
                        </label>

                        <label className="field">
                            <span>비밀번호 (TMDB API Key)</span>
                            <input
                                type="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                placeholder="TMDB API Key 입력"
                                autoComplete={mode === "login" ? "current-password" : "new-password"}
                            />
                        </label>

                        {mode === "register" && (
                            <label className="field">
                                <span>비밀번호 확인</span>
                                <input
                                    type="password"
                                    value={password2}
                                    onChange={(e) => setPassword2(e.target.value)}
                                    placeholder="비밀번호 확인"
                                    autoComplete="new-password"
                                />
                            </label>
                        )}

                        {mode === "login" ? (
                            <div className="row">
                                <label className="check">
                                    <input
                                        type="checkbox"
                                        checked={rememberEmail}
                                        onChange={(e) => setRememberEmail(e.target.checked)}
                                    />
                                    <span>Remember me (이메일 저장)</span>
                                </label>
                                <label className="check">
                                    <input
                                        type="checkbox"
                                        checked={keepLogin}
                                        onChange={(e) => setKeepLogin(e.target.checked)}
                                    />
                                    <span>Keep login</span>
                                </label>
                            </div>
                        ) : (
                            <label className="check">
                                <input type="checkbox" checked={agree} onChange={(e) => setAgree(e.target.checked)} />
                                <span>(필수) 약관에 동의합니다.</span>
                            </label>
                        )}

                        <div className="actions">
                            {mode === "login" ? (
                                <button className="btn btn--primary" onClick={handleLogin}>
                                    로그인
                                </button>
                            ) : (
                                <button className="btn btn--primary" onClick={handleRegister}>
                                    회원가입
                                </button>
                            )}
                        </div>

                        <p className="auth__foot">
                            {mode === "login" ? "계정이 없으신가요?" : "이미 계정이 있으신가요?"}{" "}
                            <button className="link" onClick={() => toggleMode(mode === "login" ? "register" : "login")}>
                                {mode === "login" ? "회원가입" : "로그인"}하기
                            </button>
                        </p>
                    </div>
                </section>
            </div>
        </div>
    );
}
