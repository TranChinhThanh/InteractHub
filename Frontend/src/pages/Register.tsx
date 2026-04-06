import { useState, useRef } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import api from '../services/api';

const Register = () => {
    const [fullName, setFullName] = useState('');
    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const navigate = useNavigate();
    const passwordInputRef = useRef<HTMLInputElement>(null);

    const handleTogglePassword = () => {
        setShowPassword(prev => !prev);
        setTimeout(() => {
            if (passwordInputRef.current) {
                passwordInputRef.current.focus();
                const length = passwordInputRef.current.value.length;
                passwordInputRef.current.setSelectionRange(length, length);
            }
        }, 0);
    };

    const handleRegister = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setIsLoading(true);
        try {
            const response = await api.post('/auth/register', { username, email, password, fullName });
            if (response.data.status === 'Success') {
                setSuccess(true);
                setTimeout(() => navigate('/login'), 2000);
            }
        } catch (err: any) {
            setError(err.response?.data?.message || 'Registration failed. Try a different username/email.');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="flex flex-col h-screen bg-surface font-body text-on-surface antialiased overflow-hidden transition-opacity duration-300">
            <main className="flex flex-col md:flex-row flex-1 w-full bg-white z-10 min-h-0 overflow-hidden">
                {/* Left Side: Registration Form (Order 2 on Mobile, Order 1 on Desktop) */}
                <section className="w-full md:w-1/2 lg:w-2/5 flex flex-col items-center justify-center bg-surface-container-lowest py-2 px-6 md:px-10 lg:px-12 overflow-y-auto order-2 md:order-1 relative min-h-0 animate-slide-in-left">
                    <div className="w-full max-w-sm xl:max-w-md relative z-10 py-2">
                        {/* Mobile Branding */}
                        <div className="md:hidden mb-4 flex justify-center">
                            <span className="text-3xl font-extrabold italic text-[#10b981] font-headline tracking-tighter">InteractHub</span>
                        </div>
                        <div className="mb-4 text-center md:text-left">
                            <h2 className="font-headline text-[2.25rem] font-extrabold text-on-surface tracking-tight mb-1">Create Account</h2>
                            <p className="text-on-surface-variant font-body text-[13px]">Sign up to get started.</p>
                        </div>

                        {error && (
                            <div className="bg-red-50/80 backdrop-blur-md border-l-4 border-[#b92902] text-[#b02500] p-2.5 mb-4 rounded-lg shadow-sm" role="alert">
                                <p className="font-medium text-sm">{error}</p>
                            </div>
                        )}
                        {success && (
                            <div className="bg-green-50/80 backdrop-blur-md border-l-4 border-[#10b981] text-[#10b981] p-2.5 mb-4 rounded-lg shadow-sm" role="alert">
                                <p className="font-medium text-sm">Registration successful! Redirecting to login...</p>
                            </div>
                        )}

                        <form className="space-y-3" onSubmit={handleRegister}>
                            {/* Full Name Input */}
                            <div className="space-y-1.5">
                                <label className="block text-[11px] font-bold uppercase tracking-[0.1em] text-on-surface-variant/80 ml-1" htmlFor="fullName">Full Name</label>
                                <div className="relative flex items-center group">
                                    <div className="absolute left-4 text-on-surface-variant/50 group-focus-within:text-[#10b981] transition-colors">
                                        <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 0, 'wght' 400, 'GRAD' 0, 'opsz' 24" }}>person</span>
                                    </div>
                                    <input 
                                        className="w-full bg-[#e6fff0] text-on-surface focus:bg-white placeholder-[#043620]/30 py-4 pl-12 pr-4 rounded-xl border border-transparent focus:border-[#10b981]/20 focus:ring-4 focus:ring-[#10b981]/10 transition-all outline-none font-medium text-[15px]" 
                                        id="fullName" 
                                        placeholder="John Doe" 
                                        type="text"
                                        value={fullName}
                                        onChange={(e) => setFullName(e.target.value)} 
                                        required 
                                    />
                                </div>
                            </div>

                            {/* Username Input */}
                            <div className="space-y-1.5">
                                <label className="block text-[11px] font-bold uppercase tracking-[0.1em] text-on-surface-variant/80 ml-1" htmlFor="username">Username</label>
                                <div className="relative flex items-center group">
                                    <div className="absolute left-4 text-on-surface-variant/50 group-focus-within:text-[#10b981] transition-colors">
                                        <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 0, 'wght' 400, 'GRAD' 0, 'opsz' 24" }}>alternate_email</span>
                                    </div>
                                    <input 
                                        className="w-full bg-[#e6fff0] text-on-surface focus:bg-white placeholder-[#043620]/30 py-4 pl-12 pr-4 rounded-xl border border-transparent focus:border-[#10b981]/20 focus:ring-4 focus:ring-[#10b981]/10 transition-all outline-none font-medium text-[15px]" 
                                        id="username" 
                                        placeholder="johndoe_123" 
                                        type="text"
                                        value={username}
                                        onChange={(e) => setUsername(e.target.value)} 
                                        required 
                                    />
                                </div>
                            </div>

                            {/* Email Input */}
                            <div className="space-y-1.5">
                                <label className="block text-[11px] font-bold uppercase tracking-[0.1em] text-on-surface-variant/80 ml-1" htmlFor="email">Email Address</label>
                                <div className="relative flex items-center group">
                                    <div className="absolute left-4 text-on-surface-variant/50 group-focus-within:text-[#10b981] transition-colors">
                                        <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 0, 'wght' 400, 'GRAD' 0, 'opsz' 24" }}>mail</span>
                                    </div>
                                    <input 
                                        className="w-full bg-[#e6fff0] text-on-surface focus:bg-white placeholder-[#043620]/30 py-4 pl-12 pr-4 rounded-xl border border-transparent focus:border-[#10b981]/20 focus:ring-4 focus:ring-[#10b981]/10 transition-all outline-none font-medium text-[15px]" 
                                        id="email" 
                                        placeholder="hello@example.com" 
                                        type="email"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)} 
                                        required 
                                    />
                                </div>
                            </div>

                            {/* Password Input */}
                            <div className="space-y-1.5">
                                <label className="block text-[11px] font-bold uppercase tracking-[0.1em] text-on-surface-variant/80 ml-1" htmlFor="password">Password</label>
                                <div className="relative flex items-center group">
                                    <div className="absolute left-4 text-on-surface-variant/50 group-focus-within:text-[#10b981] transition-colors">
                                        <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 0, 'wght' 400, 'GRAD' 0, 'opsz' 24" }}>lock</span>
                                    </div>
                                    <input 
                                        ref={passwordInputRef}
                                        className="w-full bg-[#e6fff0] text-on-surface focus:bg-white placeholder-[#043620]/30 py-4 pl-12 pr-12 rounded-xl border border-transparent focus:border-[#10b981]/20 focus:ring-4 focus:ring-[#10b981]/10 transition-all outline-none font-medium text-[15px]" 
                                        id="password" 
                                        placeholder="••••••••" 
                                        type={showPassword ? "text" : "password"}
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)} 
                                        required 
                                    />
                                    <div 
                                        className="absolute right-4 text-on-surface-variant/50 hover:text-on-surface cursor-pointer p-1 transition-colors flex items-center"
                                        onMouseDown={(e) => e.preventDefault()}
                                        onClick={handleTogglePassword}
                                    >
                                        <span className="material-symbols-outlined select-none" style={{ fontVariationSettings: "'FILL' 1, 'wght' 400, 'GRAD' 0, 'opsz' 24" }}>
                                            {showPassword ? 'visibility_off' : 'visibility'}
                                        </span>
                                    </div>
                                </div>
                            </div>

                            <div className="pt-4 pb-2">
                                <button 
                                    disabled={isLoading || success}
                                    className="w-full py-4 bg-gradient-to-r from-[#10b981] to-[#059669] text-white font-bold rounded-full shadow-[0_8px_24px_rgba(16,185,129,0.25)] hover:shadow-[0_12px_32px_rgba(16,185,129,0.35)] hover:-translate-y-0.5 active:translate-y-0 transition-all duration-300 disabled:opacity-70 disabled:hover:translate-y-0 disabled:hover:shadow-none" 
                                    type="submit"
                                >
                                    {isLoading ? 'Creating Account...' : 'Sign Up Free'}
                                </button>
                            </div>

                            <p className="mt-4 text-center text-[13px] font-medium text-on-surface-variant">
                                Already have an account?{' '}
                                <Link className="text-[#10b981] font-bold hover:text-[#059669] transition-colors hover:underline" to="/login">Log In</Link>
                            </p>
                        </form>
                    </div>
                </section>

                {/* Right Side: Editorial Branding (Order 1 on Mobile, Order 2 on Desktop) */}
                <section className="hidden md:flex md:w-1/2 lg:w-3/5 relative overflow-hidden bg-primary-dim p-12 lg:p-20 flex-col justify-center order-1 md:order-2 border-l border-outline-variant/10 animate-fade-overlay">
                    {/* Background Texture */}
                    <div className="absolute inset-0 z-0">
                        <img alt="Abstract fluid background" className="w-full h-full object-cover opacity-60 mix-blend-overlay animate-color-shift" src="https://lh3.googleusercontent.com/aida-public/AB6AXuCAQKWkDmdcxAReTnmpehkc_82vOeGSVMxfz4-KpVYICMTFgYHs04glanOJ8-5V33dXpoECM98-2CIDI82PR6XwyM_ciLoazAUieF1Anvj93j1Oda-RlFryMuSt6nJOr8mivjTxTlsdCLbXoRvMpokzs97DXrQlktp-a_WD1J_Yulm7TaLauGqdWjvvYZPXFon4_0tUljGnosnUNQ_xOdJfcr3VvTBsLwtd9qTMEoGpYHEDLCegvfgAO2vbzWEf-5vMH4-hjW6nSypH" />
                        <div className="absolute inset-0 bg-gradient-to-br from-[#10b981]/90 via-[#059669]/70 to-transparent mix-blend-multiply transition-colors duration-1000"></div>
                    </div>

                    <div className="relative z-10 w-full max-w-xl mx-auto xl:mx-0 flex flex-col justify-center h-full">
                        {/* Logo */}
                        <div className="mb-12">
                            <span className="text-3xl lg:text-4xl font-extrabold italic text-white/95 font-headline tracking-tighter drop-shadow-sm">InteractHub</span>
                        </div>
                        
                        <h1 className="font-headline text-5xl lg:text-[4.5rem] lg:leading-[1.05] font-extrabold text-white tracking-tight mb-10 drop-shadow-md">
                            Join our digital magazine.
                        </h1>

                        <div className="flex gap-4 items-center">
                            <div className="flex -space-x-3">
                                <img alt="user" className="w-10 h-10 lg:w-12 lg:h-12 rounded-full border-[3px] border-[#059669] object-cover shadow-lg" src="https://lh3.googleusercontent.com/aida-public/AB6AXuA17cjHsnbkKto0MUDxPE0cfWzMehCQcAMmMEayfMgpW-ogrIbs5N6QE5dZuXeDFbzuJxTTDx1GtpmrvmkM1AFThpw-o3OumZb2sKQhjdOhpr0wpKqF80W5fuMCll89Y-9Ndm9A--sgzbb_AuMARLXQIGZDXQFnYnEt1xlvLyUr37MiU_Vbk3SBMxAZ2BV5DQi1ITFJbdBcHQ9bNilK9p_KFgg5aaOrP9sUQhhxkve2pYcxygzNY-AKMqKbrNTd2IfGyXyAGVoxIF_I" />
                                <img alt="user" className="w-10 h-10 lg:w-12 lg:h-12 rounded-full border-[3px] border-[#059669] object-cover shadow-lg" src="https://lh3.googleusercontent.com/aida-public/AB6AXuAdVNymoxtwXOLQDciAQtNcuz8NnkEaDEFk66eHeNNmAFFDwaAuhJjM76s6d6UBPOC_pGKwECwKotdQM4u418cLI4epUKCalX47LKm9Pe2hQjsWnh8OHkIq6yXz51Ygwd4D0Lm_6AufmHvYvH_SEi-K3tmJrzIYO_vlEUMo_YooONpZytjMqyooUfG8pTEj7ZgMX5cd1EdsuTRvK9iUDhJN_HviL7rSE1s1eI1sSMTK3LOTwCsDSDvFfcNKMrNqgAZWs9DYSlOEraya" />
                                <img alt="user" className="w-10 h-10 lg:w-12 lg:h-12 rounded-full border-[3px] border-[#059669] object-cover shadow-lg" src="https://lh3.googleusercontent.com/aida-public/AB6AXuBC9ECGYZTVOjkNV0q_ZoEXtKvH6wMAzREXGPnhe-N7_JW_LYy4pN3nbIjf_gWv8H_hXEjRFmH4TiP8do420TekuzbnHu-jX5VvBCQESSkpQWaUEYi3-Nj6A84ADnc9tOq6aqxbr92TAk3rjl9w2Ggjw1a8gp6I5TqEVMsqc0VSKkYAmookJbZK5lYf0yptfj7xcXeea2rQ0MOg1S6_teTMJUJ9YxHyoNyKIwOjNPnNRmtk8NJkZ4FioUiMz6h6LRDBq_hWQ6NNZLFP" />
                            </div>
                            <p className="text-[#a7f3d0] font-medium text-lg tracking-wide">Join 2M+ creators today</p>
                        </div>
                    </div>

                    {/* Asymmetric Floating Element */}
                    <div className="absolute bottom-12 right-12 lg:bottom-16 lg:right-16 bg-white/20 backdrop-blur-xl border border-white/15 p-6 rounded-2xl shadow-[0_16px_40px_rgba(4,54,32,0.15)] max-w-xs transform rotate-3 hover:rotate-0 hover:scale-105 transition-all duration-300">
                        <div className="flex items-center gap-2 mb-3">
                            <span className="material-symbols-outlined text-[#10b981] drop-shadow-sm" style={{ fontVariationSettings: "'FILL' 1" }}>verified</span>
                            <span className="font-label text-xs uppercase tracking-[0.15em] text-white/90 font-bold">The Kinetic Editorial</span>
                        </div>
                        <p className="text-sm font-semibold text-white leading-relaxed">Experience a social platform that treats content like a premium magazine.</p>
                    </div>
                </section>
            </main>

            {/* Footer full width baseline */}
            <footer className="w-full bg-[#e0fbe9] py-3 lg:py-4 z-0">
                <div className="w-full max-w-[1400px] mx-auto px-4 lg:px-8 flex flex-col md:flex-row justify-between items-center gap-2">
                    <div className="flex flex-col items-center md:items-start text-center md:text-left">
                        <span className="font-headline font-extrabold text-[#10b981] italic text-[13px]">InteractHub</span>
                        <p className="font-body text-[10px] text-[#043620]/60 mt-0.5 font-medium">© 2026 InteractHub. The Kinetic Editorial.</p>
                    </div>
                    <div className="flex gap-4 md:gap-6 flex-wrap justify-center">
                        <a className="font-body text-[11px] font-semibold text-[#043620]/60 hover:text-[#10b981] transition-colors" href="#">Privacy</a>
                        <a className="font-body text-[11px] font-semibold text-[#043620]/60 hover:text-[#10b981] transition-colors" href="#">Terms</a>
                        <a className="font-body text-[11px] font-semibold text-[#043620]/60 hover:text-[#10b981] transition-colors" href="#">Support</a>
                        <a className="font-body text-[11px] font-semibold text-[#043620]/60 hover:text-[#10b981] transition-colors" href="#">Careers</a>
                    </div>
                </div>
            </footer>
        </div>
    );
};

export default Register;