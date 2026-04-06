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
        <main className="min-h-screen flex flex-col md:flex-row bg-surface font-body text-on-surface antialiased overflow-hidden w-full">
            {/* Left Side: Editorial Branding */}
            <section className="hidden md:flex md:w-1/2 lg:w-3/5 relative overflow-hidden bg-primary-dim items-center justify-center p-12">
                <div className="absolute inset-0 z-0">
                    <img alt="Abstract fluid background" className="w-full h-full object-cover opacity-40" src="https://lh3.googleusercontent.com/aida-public/AB6AXuCAQKWkDmdcxAReTnmpehkc_82vOeGSVMxfz4-KpVYICMTFgYHs04glanOJ8-5V33dXpoECM98-2CIDI82PR6XwyM_ciLoazAUieF1Anvj93j1Oda-RlFryMuSt6nJOr8mivjTxTlsdCLbXoRvMpokzs97DXrQlktp-a_WD1J_Yulm7TaLauGqdWjvvYZPXFon4_0tUljGnosnUNQ_xOdJfcr3VvTBsLwtd9qTMEoGpYHEDLCegvfgAO2vbzWEf-5vMH4-hjW6nSypH" />
                    <div className="absolute inset-0 bg-gradient-to-br from-primary via-secondary/40 to-transparent"></div>
                </div>
                <div className="relative z-10 max-w-xl">
                    <div className="mb-12">
                        <span className="text-4xl font-black italic bg-gradient-to-r from-primary-container to-secondary-container bg-clip-text text-transparent font-headline tracking-tight">InteractHub</span>
                    </div>
                    <h1 className="font-headline text-6xl lg:text-7xl font-extrabold text-on-primary leading-tight tracking-tighter mb-8">
                        Join our digital magazine.
                    </h1>
                    <div className="flex gap-4 items-center">
                        <div className="flex -space-x-4">
                            <img alt="user 1" className="w-12 h-12 rounded-full border-4 border-primary-dim" src="https://lh3.googleusercontent.com/aida-public/AB6AXuA17cjHsnbkKto0MUDxPE0cfWzMehCQcAMmMEayfMgpW-ogrIbs5N6QE5dZuXeDFbzuJxTTDx1GtpmrvmkM1AFThpw-o3OumZb2sKQhjdOhpr0wpKqF80W5fuMCll89Y-9Ndm9A--sgzbb_AuMARLXQIGZDXQFnYnEt1xlvLyUr37MiU_Vbk3SBMxAZ2BV5DQi1ITFJbdBcHQ9bNilK9p_KFgg5aaOrP9sUQhhxkve2pYcxygzNY-AKMqKbrNTd2IfGyXyAGVoxIF_I" />
                            <img alt="user 2" className="w-12 h-12 rounded-full border-4 border-primary-dim" src="https://lh3.googleusercontent.com/aida-public/AB6AXuAdVNymoxtwXOLQDciAQtNcuz8NnkEaDEFk66eHeNNmAFFDwaAuhJjM76s6d6UBPOC_pGKwECwKotdQM4u418cLI4epUKCalX47LKm9Pe2hQjsWnh8OHkIq6yXz51Ygwd4D0Lm_6AufmHvYvH_SEi-K3tmJrzIYO_vlEUMo_YooONpZytjMqyooUfG8pTEj7ZgMX5cd1EdsuTRvK9iUDhJN_HviL7rSE1s1eI1sSMTK3LOTwCsDSDvFfcNKMrNqgAZWs9DYSlOEraya" />
                            <img alt="user 3" className="w-12 h-12 rounded-full border-4 border-primary-dim" src="https://lh3.googleusercontent.com/aida-public/AB6AXuBC9ECGYZTVOjkNV0q_ZoEXtKvH6wMAzREXGPnhe-N7_JW_LYy4pN3nbIjf_gWv8H_hXEjRFmH4TiP8do420TekuzbnHu-jX5VvBCQESSkpQWaUEYi3-Nj6A84ADnc9tOq6aqxbr92TAk3rjl9w2Ggjw1a8gp6I5TqEVMsqc0VSKkYAmookJbZK5lYf0yptfj7xcXeea2rQ0MOg1S6_teTMJUJ9YxHyoNyKIwOjNPnNRmtk8NJkZ4FioUiMz6h6LRDBq_hWQ6NNZLFP" />
                        </div>
                        <p className="text-primary-container font-medium text-lg">Join 2M+ creators today</p>
                    </div>
                </div>

                <div className="absolute bottom-12 right-12 kinetic-glass p-6 rounded-xl shadow-2xl shadow-on-surface/10 max-w-xs transform rotate-3">
                    <div className="flex items-center gap-3 mb-2">
                        <span className="material-symbols-outlined text-secondary">verified</span>
                        <span className="font-label text-xs uppercase tracking-widest text-on-surface-variant">The Kinetic Editorial</span>
                    </div>
                    <p className="text-sm font-semibold text-on-surface">Experience a social platform that treats content like a premium magazine.</p>
                </div>
            </section>

            {/* Right Side: Register Form */}
            <section className="w-full md:w-1/2 lg:w-2/5 flex items-center justify-center bg-surface-container-lowest p-8 md:p-16 lg:p-24 overflow-y-auto">
                <div className="w-full max-w-md">
                    <div className="md:hidden mb-12 flex justify-center">
                        <span className="text-3xl font-black italic bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent font-headline tracking-tight">InteractHub</span>
                    </div>
                    <div className="mb-10">
                        <h2 className="font-headline text-4xl font-extrabold text-on-surface tracking-tight mb-2">Create Account</h2>
                        <p className="text-on-surface-variant font-body">Sign up to get started.</p>
                    </div>

                    {error && (
                        <div className="bg-red-50 border border-red-200 text-red-700 p-4 mb-6 rounded-xl shadow-sm text-sm" role="alert">
                            {error}
                        </div>
                    )}
                    {success && (
                        <div className="bg-green-50 border border-green-200 text-green-700 p-4 mb-6 rounded-xl shadow-sm text-sm" role="alert">
                            Registration successful! Redirecting to login...
                        </div>
                    )}

                    <form className="space-y-6" onSubmit={handleRegister}>
                        <div>
                            <label htmlFor="fullName" className="block font-label text-xs uppercase tracking-widest text-on-surface-variant mb-2 ml-1">Full Name</label>
                            <div className="relative group">
                                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                    <span className="material-symbols-outlined text-on-surface-variant group-focus-within:text-primary transition-colors">badge</span>
                                </div>
                                <input 
                                    className="block w-full pl-12 pr-4 py-4 bg-surface-container-low border-none outline-none rounded-xl focus:ring-2 focus:ring-primary/20 focus:bg-surface-container-lowest transition-all text-on-surface placeholder:text-on-surface/30" 
                                    id="fullName" 
                                    placeholder="John Doe" 
                                    type="text"
                                    value={fullName}
                                    onChange={(e) => setFullName(e.target.value)} 
                                    required 
                                />
                            </div>
                        </div>

                        <div>
                            <label htmlFor="username" className="block font-label text-xs uppercase tracking-widest text-on-surface-variant mb-2 ml-1">Username</label>
                            <div className="relative group">
                                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                    <span className="material-symbols-outlined text-on-surface-variant group-focus-within:text-primary transition-colors">person</span>
                                </div>
                                <input 
                                    className="block w-full pl-12 pr-4 py-4 bg-surface-container-low border-none outline-none rounded-xl focus:ring-2 focus:ring-primary/20 focus:bg-surface-container-lowest transition-all text-on-surface placeholder:text-on-surface/30" 
                                    id="username" 
                                    placeholder="johndoe_123" 
                                    type="text"
                                    value={username}
                                    onChange={(e) => setUsername(e.target.value)} 
                                    required 
                                />
                            </div>
                        </div>
                        
                        <div>
                            <label htmlFor="email" className="block font-label text-xs uppercase tracking-widest text-on-surface-variant mb-2 ml-1">Email Address</label>
                            <div className="relative group">
                                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                    <span className="material-symbols-outlined text-on-surface-variant group-focus-within:text-primary transition-colors">mail</span>
                                </div>
                                <input 
                                    className="block w-full pl-12 pr-4 py-4 bg-surface-container-low border-none outline-none rounded-xl focus:ring-2 focus:ring-primary/20 focus:bg-surface-container-lowest transition-all text-on-surface placeholder:text-on-surface/30" 
                                    id="email" 
                                    placeholder="hello@example.com" 
                                    type="email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)} 
                                    required 
                                />
                            </div>
                        </div>

                        <div>
                            <label htmlFor="password" className="block font-label text-xs uppercase tracking-widest text-on-surface-variant ml-1 mb-2">Password</label>
                            <div className="relative group">
                                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                    <span className="material-symbols-outlined text-on-surface-variant group-focus-within:text-primary transition-colors">lock</span>
                                </div>
                                <input 
                                    className="block w-full pl-12 pr-12 py-4 bg-surface-container-low border-none outline-none rounded-xl focus:ring-2 focus:ring-primary/20 focus:bg-surface-container-lowest transition-all text-on-surface placeholder:text-on-surface/30" 
                                    id="password" 
                                    placeholder="••••••••" 
                                    type="password"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)} 
                                    required 
                                />
                                <div className="absolute inset-y-0 right-0 pr-4 flex items-center cursor-pointer">
                                    <span className="material-symbols-outlined text-on-surface-variant hover:text-on-surface transition-colors">visibility</span>
                                </div>
                            </div>
                        </div>

                        <button 
                            disabled={isLoading || success}
                            className="w-full py-4 mt-6 bg-gradient-to-r from-primary to-secondary text-on-primary font-bold rounded-full shadow-lg shadow-primary/20 hover:opacity-90 active:scale-95 transition-all duration-200 disabled:opacity-70 disabled:scale-100" 
                            type="submit"
                        >
                            {isLoading ? 'Processing...' : 'Sign Up Free'}
                        </button>
                    </form>

                    <p className="mt-12 text-center text-sm font-body text-on-surface-variant">
                        Already have an account?{' '}
                        <Link className="text-primary font-bold hover:underline" to="/login">Log In</Link>
                    </p>
                </div>
            </section>
        </main>
    );
};

export default Register;