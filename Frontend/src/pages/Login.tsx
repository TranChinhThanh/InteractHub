import { useState, useRef } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import api from '../services/api';

const Login = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const navigate = useNavigate();
    const passwordInputRef = useRef<HTMLInputElement>(null);

    const handleTogglePassword = () => {
        setShowPassword(prev => !prev);
        // Đặt timeout nhỏ để thực hiện sau khi React cập nhật DOM (đổi type password <-> text)
        setTimeout(() => {
            if (passwordInputRef.current) {
                passwordInputRef.current.focus();
                const length = passwordInputRef.current.value.length;
                passwordInputRef.current.setSelectionRange(length, length);
            }
        }, 0);
    };

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setIsLoading(true);
        try {
            const response = await api.post('/auth/login', { username, password });
            if (response.data.token) {
                localStorage.setItem('token', response.data.token);
                localStorage.setItem('username', response.data.username);
                navigate('/');
            }
        } catch (err: any) {
            setError(err.response?.data?.message || 'Login failed. Please check your credentials.');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="flex flex-col h-screen bg-surface font-body text-on-surface antialiased overflow-hidden">
            {/* Main Content Area */}
            <main className="flex flex-col md:flex-row flex-1 w-full bg-white z-10 min-h-0 overflow-hidden">
                {/* Left Side: Editorial Branding */}
                <section className="hidden md:flex md:w-1/2 lg:w-3/5 relative overflow-hidden bg-primary-dim p-12 lg:p-20 flex-col justify-center border-r border-outline-variant/10">
                    {/* Background Texture */}
                    <div className="absolute inset-0 z-0">
                        <img alt="Abstract fluid background" className="w-full h-full object-cover opacity-60 mix-blend-overlay" src="https://lh3.googleusercontent.com/aida-public/AB6AXuCAQKWkDmdcxAReTnmpehkc_82vOeGSVMxfz4-KpVYICMTFgYHs04glanOJ8-5V33dXpoECM98-2CIDI82PR6XwyM_ciLoazAUieF1Anvj93j1Oda-RlFryMuSt6nJOr8mivjTxTlsdCLbXoRvMpokzs97DXrQlktp-a_WD1J_Yulm7TaLauGqdWjvvYZPXFon4_0tUljGnosnUNQ_xOdJfcr3VvTBsLwtd9qTMEoGpYHEDLCegvfgAO2vbzWEf-5vMH4-hjW6nSypH" />
                        <div className="absolute inset-0 bg-gradient-to-br from-primary/90 via-secondary/70 to-transparent mix-blend-multiply"></div>
                    </div>

                    <div className="relative z-10 w-full max-w-xl mx-auto xl:mx-0 flex flex-col justify-center h-full">
                        {/* Logo */}
                        <div className="mb-12">
                            <span className="text-3xl lg:text-4xl font-extrabold italic text-white/95 font-headline tracking-tighter drop-shadow-sm">InteractHub</span>
                        </div>
                        
                        <h1 className="font-headline text-5xl lg:text-[4.5rem] font-extrabold text-white leading-[1.05] tracking-tight mb-10 drop-shadow-md">
                            Connect with friends and share your moments.
                        </h1>

                        <div className="flex gap-4 items-center">
                            <div className="flex -space-x-3">
                                <img alt="user" className="w-10 h-10 lg:w-12 lg:h-12 rounded-full border-[3px] border-primary-dim object-cover shadow-lg" src="https://lh3.googleusercontent.com/aida-public/AB6AXuA17cjHsnbkKto0MUDxPE0cfWzMehCQcAMmMEayfMgpW-ogrIbs5N6QE5dZuXeDFbzuJxTTDx1GtpmrvmkM1AFThpw-o3OumZb2sKQhjdOhpr0wpKqF80W5fuMCll89Y-9Ndm9A--sgzbb_AuMARLXQIGZDXQFnYnEt1xlvLyUr37MiU_Vbk3SBMxAZ2BV5DQi1ITFJbdBcHQ9bNilK9p_KFgg5aaOrP9sUQhhxkve2pYcxygzNY-AKMqKbrNTd2IfGyXyAGVoxIF_I" />
                                <img alt="user" className="w-10 h-10 lg:w-12 lg:h-12 rounded-full border-[3px] border-primary-dim object-cover shadow-lg" src="https://lh3.googleusercontent.com/aida-public/AB6AXuAdVNymoxtwXOLQDciAQtNcuz8NnkEaDEFk66eHeNNmAFFDwaAuhJjM76s6d6UBPOC_pGKwECwKotdQM4u418cLI4epUKCalX47LKm9Pe2hQjsWnh8OHkIq6yXz51Ygwd4D0Lm_6AufmHvYvH_SEi-K3tmJrzIYO_vlEUMo_YooONpZytjMqyooUfG8pTEj7ZgMX5cd1EdsuTRvK9iUDhJN_HviL7rSE1s1eI1sSMTK3LOTwCsDSDvFfcNKMrNqgAZWs9DYSlOEraya" />
                                <img alt="user" className="w-10 h-10 lg:w-12 lg:h-12 rounded-full border-[3px] border-primary-dim object-cover shadow-lg" src="https://lh3.googleusercontent.com/aida-public/AB6AXuBC9ECGYZTVOjkNV0q_ZoEXtKvH6wMAzREXGPnhe-N7_JW_LYy4pN3nbIjf_gWv8H_hXEjRFmH4TiP8do420TekuzbnHu-jX5VvBCQESSkpQWaUEYi3-Nj6A84ADnc9tOq6aqxbr92TAk3rjl9w2Ggjw1a8gp6I5TqEVMsqc0VSKkYAmookJbZK5lYf0yptfj7xcXeea2rQ0MOg1S6_teTMJUJ9YxHyoNyKIwOjNPnNRmtk8NJkZ4FioUiMz6h6LRDBq_hWQ6NNZLFP" />
                            </div>
                            <p className="text-secondary-container font-medium text-lg tracking-wide">Join 2M+ creators today</p>
                        </div>
                    </div>

                    {/* Asymmetric Floating Element */}
                    <div className="absolute bottom-12 right-12 lg:bottom-16 lg:right-16 bg-white/20 backdrop-blur-xl border border-white/15 p-6 rounded-2xl shadow-[0_16px_40px_rgba(48,41,80,0.15)] max-w-xs transform rotate-[-2deg] hover:rotate-0 hover:scale-105 transition-all duration-300">
                        <div className="flex items-center gap-2 mb-3">
                            <span className="material-symbols-outlined text-secondary-container drop-shadow-sm" style={{ fontVariationSettings: "'FILL' 1" }}>trending_up</span>
                            <span className="font-label text-xs uppercase tracking-[0.15em] text-white/90 font-bold">Trending Now</span>
                        </div>
                        <p className="text-sm font-semibold text-white leading-relaxed">"The Kinetic Editorial" design system is taking over social feeds.</p>
                    </div>
                </section>

                {/* Right Side: Login Form */}
                <section className="w-full md:w-1/2 lg:w-2/5 flex flex-col justify-center items-center py-6 px-8 md:px-12 lg:px-16 relative min-h-0 overflow-y-auto">
                    <div className="w-full max-w-sm xl:max-w-md relative z-10 py-4">
                        {/* Mobile Branding */}
                        <div className="md:hidden mb-8 flex justify-center">
                            <span className="text-3xl font-extrabold italic text-primary font-headline tracking-tighter">InteractHub</span>
                        </div>

                        <div className="mb-6 text-center md:text-left">
                            <h2 className="font-headline text-4xl font-extrabold text-on-surface tracking-tight mb-2">Welcome Back!</h2>
                            <p className="text-on-surface-variant font-body text-[14px]">Please enter your details to continue.</p>
                        </div>

                        {error && (
                            <div className="bg-red-50/80 backdrop-blur-md border-l-4 border-error-dim text-error p-3 mb-6 rounded-lg shadow-sm" role="alert">
                                <p className="font-medium text-sm">{error}</p>
                            </div>
                        )}

                        <form className="space-y-4" onSubmit={handleLogin}>
                            {/* Username Input */}
                            <div className="space-y-2">
                                <label className="block text-[11px] font-bold uppercase tracking-[0.1em] text-on-surface-variant/80 ml-1" htmlFor="username">Username</label>
                                <div className="relative flex items-center group">
                                    <div className="absolute left-4 text-on-surface-variant/50 group-focus-within:text-primary transition-colors">
                                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-[18px] h-[18px]">
                                            <path fillRule="evenodd" d="M7.5 6a4.5 4.5 0 1 1 9 0 4.5 4.5 0 0 1-9 0ZM3.751 20.105a8.25 8.25 0 0 1 16.498 0 .75.75 0 0 1-.437.695A18.683 18.683 0 0 1 12 22.5c-2.786 0-5.433-.608-7.812-1.7a.75.75 0 0 1-.437-.695Z" clipRule="evenodd" />
                                        </svg>
                                    </div>
                                    <input 
                                        className="w-full bg-[#f4eeff] text-on-surface focus:bg-white placeholder-on-surface/30 py-3.5 pl-11 pr-4 rounded-xl border border-transparent focus:border-primary/20 focus:ring-4 focus:ring-primary/10 transition-all outline-none font-medium text-[15px]" 
                                        id="username" 
                                        name="username" 
                                        placeholder="interact_user" 
                                        type="text"
                                        value={username}
                                        onChange={(e) => setUsername(e.target.value)} 
                                        required 
                                    />
                                </div>
                            </div>

                            {/* Password Input */}
                            <div className="space-y-2">
                                <div className="flex justify-between items-center px-1">
                                    <label className="block text-[11px] font-bold uppercase tracking-[0.1em] text-on-surface-variant/80" htmlFor="password">Password</label>
                                    <a className="text-[11px] font-bold text-primary hover:text-secondary transition-colors" href="#">Forgot Password?</a>
                                </div>
                                <div className="relative flex items-center group">
                                    <div className="absolute left-4 text-on-surface-variant/50 group-focus-within:text-primary transition-colors">
                                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-[18px] h-[18px]">
                                            <path fillRule="evenodd" d="M12 1.5a5.25 5.25 0 0 0-5.25 5.25v3a3 3 0 0 0-3 3v6.75a3 3 0 0 0 3 3h10.5a3 3 0 0 0 3-3v-6.75a3 3 0 0 0-3-3v-3c0-2.9-2.35-5.25-5.25-5.25Zm3.75 8.25v-3a3.75 3.75 0 1 0-7.5 0v3h7.5Z" clipRule="evenodd" />
                                        </svg>
                                    </div>
                                    <input 
                                        ref={passwordInputRef}
                                        className="w-full bg-[#f4eeff] text-on-surface focus:bg-white placeholder-on-surface/30 py-3.5 pl-11 pr-12 rounded-xl border border-transparent focus:border-primary/20 focus:ring-4 focus:ring-primary/10 transition-all outline-none font-medium text-[15px]" 
                                        id="password" 
                                        name="password" 
                                        placeholder="••••••••" 
                                        type={showPassword ? "text" : "password"}
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)} 
                                        required 
                                    />
                                    <div 
                                        className="absolute right-4 text-on-surface-variant/50 hover:text-on-surface cursor-pointer p-1 transition-colors"
                                        onMouseDown={(e) => e.preventDefault()}
                                        onClick={handleTogglePassword}
                                    >
                                        {showPassword ? (
                                            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                                <path d="M2.062 12.348a1 1 0 0 1 0-.696 10.75 10.75 0 0 1 19.876 0 1 1 0 0 1 0 .696 10.75 10.75 0 0 1-19.876 0" />
                                                <circle cx="12" cy="12" r="3" />
                                            </svg>
                                        ) : (
                                            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                                <path d="M9.88 9.88a3 3 0 1 0 4.24 4.24" />
                                                <path d="M10.73 5.08A10.43 10.43 0 0 1 12 5c7 0 10 7 10 7a13.16 13.16 0 0 1-1.67 2.68" />
                                                <path d="M6.61 6.61A13.526 13.526 0 0 0 2 12s3 7 10 7a9.74 9.74 0 0 0 5.39-1.61" />
                                                <line x1="2" x2="22" y1="2" y2="22" />
                                            </svg>
                                        )}
                                    </div>
                                </div>
                            </div>

                            <div className="flex items-center gap-3 px-1 mt-4 mb-6">
                                <input className="w-4 h-4 rounded-[4px] border-outline-variant/40 bg-[#f4eeff] text-primary focus:ring-offset-0 focus:ring-2 focus:ring-primary/20 cursor-pointer" id="remember" type="checkbox" />
                                <label className="text-[13px] font-semibold text-on-surface-variant/90 cursor-pointer select-none mt-[1px]" htmlFor="remember">Keep me signed in</label>
                            </div>

                            <button 
                                disabled={isLoading}
                                className="w-full py-3.5 bg-gradient-to-r from-primary to-secondary text-white font-bold rounded-full shadow-[0_8px_24px_rgba(70,71,211,0.25)] hover:shadow-[0_12px_32px_rgba(70,71,211,0.35)] hover:-translate-y-0.5 active:translate-y-0 transition-all duration-300 disabled:opacity-70 disabled:hover:translate-y-0 disabled:hover:shadow-none" 
                                type="submit"
                            >
                                {isLoading ? 'Verifying...' : 'Log In'}
                            </button>
                        </form>

                        <div className="my-6 relative flex items-center justify-center">
                            <div className="absolute w-full h-[1px] bg-outline-variant/20"></div>
                            <div className="bg-white px-4 relative text-[10px] font-bold uppercase tracking-[0.15em] text-on-surface-variant/60">
                                Or Join With
                            </div>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <button type="button" className="flex items-center justify-center gap-3 py-3.5 px-4 rounded-full border border-outline-variant/20 hover:bg-surface-container-low transition-colors active:scale-[0.98] bg-white">
                                <svg className="w-[18px] h-[18px]" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
                                    <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
                                    <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" />
                                    <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
                                </svg>
                                <span className="text-[13px] font-bold text-on-surface">Google</span>
                            </button>
                            <button type="button" className="flex items-center justify-center gap-3 py-3.5 px-4 rounded-full border border-outline-variant/20 hover:bg-surface-container-low transition-colors active:scale-[0.98] bg-white">
                                <svg className="w-[18px] h-[18px] fill-[#1877F2]" viewBox="0 0 24 24">
                                    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"></path>
                                </svg>
                                <span className="text-[13px] font-bold text-on-surface">Facebook</span>
                            </button>
                        </div>

                        <p className="mt-8 text-center text-[13px] font-medium text-on-surface-variant">
                            Don't have an account?{' '}
                            <Link className="text-primary font-bold hover:text-secondary transition-colors" to="/register">Sign Up Free</Link>
                        </p>
                    </div>
                </section>
            </main>

            {/* Footer full width baseline */}
            <footer className="w-full bg-[#f4eeff] py-5 z-0 lg:py-6">
                <div className="w-full max-w-[1400px] mx-auto px-6 lg:px-10 flex flex-col md:flex-row justify-between items-center gap-3">
                    <div className="flex flex-col items-center md:items-start text-center md:text-left">
                        <span className="font-headline font-extrabold text-primary italic text-[14px]">InteractHub</span>
                        <p className="font-body text-[11px] text-on-surface-variant/80 mt-1 font-medium">© 2026 InteractHub. The Kinetic Editorial.</p>
                    </div>
                    <div className="flex gap-5 md:gap-8 flex-wrap justify-center">
                        <a className="font-body text-[12px] font-semibold text-on-surface-variant hover:text-primary transition-colors" href="#">Privacy</a>
                        <a className="font-body text-[12px] font-semibold text-on-surface-variant hover:text-primary transition-colors" href="#">Terms</a>
                        <a className="font-body text-[12px] font-semibold text-on-surface-variant hover:text-primary transition-colors" href="#">Support</a>
                        <a className="font-body text-[12px] font-semibold text-on-surface-variant hover:text-primary transition-colors" href="#">Careers</a>
                    </div>
                </div>
            </footer>
        </div>
    );
};

export default Login;