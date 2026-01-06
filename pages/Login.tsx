import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Dumbbell, Mail, Lock, ArrowRight, Eye, EyeOff } from 'lucide-react';

const Login: React.FC = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const { signIn, signInWithGoogle } = useAuth();
    const navigate = useNavigate();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            await signIn(email, password);
            navigate('/');
        } catch (err: any) {
            setError(err.message || 'Failed to sign in');
        }
    };

    const handleGoogleSignIn = async () => {
        try {
            await signInWithGoogle();
            navigate('/');
        } catch (err: any) {
            setError(err.message || 'Failed to sign in with Google');
        }
    };

    return (
        <div className="relative flex min-h-screen w-full flex-col overflow-x-hidden bg-background-light dark:bg-background-dark font-display antialiased text-[#111418] dark:text-white">
            <div className="flex flex-1 flex-col justify-center items-center px-4 py-6 md:px-6">
                <div className="w-full max-w-[480px] flex flex-col gap-6">
                    <div className="flex flex-col items-center gap-2 pt-8">
                        <div className="h-12 w-12 flex items-center justify-center rounded-full bg-primary/20 text-primary mb-2">
                            <Dumbbell size={32} />
                        </div>
                        <h1 className="text-3xl font-bold tracking-tight text-center text-[#111418] dark:text-white">PPL PRO</h1>
                    </div>

                    <div className="w-full overflow-hidden rounded-xl h-48 relative shadow-lg">
                        <div className="absolute inset-0 bg-gradient-to-t from-background-dark/90 to-transparent z-10"></div>
                        <div
                            className="w-full h-full bg-center bg-cover"
                            style={{ backgroundImage: 'url("https://lh3.googleusercontent.com/aida-public/AB6AXuBhWdm8IbTLY2LMdvGkRao7-a8XtFvPmJH6GHlk2uisZagDNVOT8DMtLuVWhExIKdYMfE9ae0kmZZEa_TT8dIFzrUBOK8LK6aV16D2QftfqxtlJp7e3tvzItBMlylv79Q1j7vDwZOxcNrCiN5iSY31xqy-UIXxq8cQlldW3N6L8_MtPohnzwIaaxLMwavyg_-o1c2qP1ZIoAORP7oaxGcHsiCpFjqzb6WYF0309XEPkLBDhk3Hg6sFuHngjd8jQtIox04-FuywL9r6L")' }}
                        ></div>
                        <div className="absolute bottom-4 left-4 z-20">
                            <h2 className="text-white text-xl font-bold">Bem-vindo de volta</h2>
                            <p className="text-gray-300 text-sm">Pronto para o treino de hoje?</p>
                        </div>
                    </div>

                    {error && <div className="p-3 text-sm text-red-500 bg-red-100 rounded-lg">{error}</div>}

                    <form onSubmit={handleSubmit} className="flex flex-col gap-4 mt-2">
                        <div className="flex flex-col gap-1.5">
                            <label className="text-sm font-medium text-[#111418] dark:text-gray-200" htmlFor="email">E-mail</label>
                            <div className="relative">
                                <input
                                    id="email"
                                    type="email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    className="w-full rounded-xl border border-gray-300 dark:border-[#2a402a] bg-white dark:bg-[#162e16] p-4 text-base text-[#111418] dark:text-white placeholder:text-gray-400 dark:placeholder:text-[#9db99d] focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all"
                                    placeholder="exemplo@email.com"
                                    required
                                />
                                <div className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 dark:text-[#9db99d]">
                                    <Mail />
                                </div>
                            </div>
                        </div>

                        <div className="flex flex-col gap-1.5">
                            <div className="flex justify-between items-center">
                                <label className="text-sm font-medium text-[#111418] dark:text-gray-200" htmlFor="password">Senha</label>
                                <a href="#" className="text-sm font-medium text-primary hover:text-primary/80 transition-colors">Esqueceu a senha?</a>
                            </div>
                            <div className="relative">
                                <input
                                    id="password"
                                    type={showPassword ? "text" : "password"}
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    className="w-full rounded-xl border border-gray-300 dark:border-[#2a402a] bg-white dark:bg-[#162e16] p-4 pr-12 text-base text-[#111418] dark:text-white placeholder:text-gray-400 dark:placeholder:text-[#9db99d] focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all"
                                    placeholder="Digite sua senha"
                                    required
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 dark:text-[#9db99d] hover:text-primary transition-colors flex items-center justify-center"
                                >
                                    {showPassword ? <EyeOff /> : <Eye />}
                                </button>
                            </div>
                        </div>

                        <button type="submit" className="mt-4 w-full rounded-xl bg-primary py-4 text-base font-bold text-[#102210] shadow-md hover:bg-[#0fd60f] active:scale-[0.98] transition-all flex items-center justify-center gap-2">
                            <span>ENTRAR</span>
                            <ArrowRight size={20} />
                        </button>
                    </form>

                    <div className="relative flex py-2 items-center">
                        <div className="flex-grow border-t border-gray-300 dark:border-[#2a402a]"></div>
                        <span className="flex-shrink-0 mx-4 text-sm text-gray-500 dark:text-gray-400">Ou continue com</span>
                        <div className="flex-grow border-t border-gray-300 dark:border-[#2a402a]"></div>
                    </div>

                    <div className="flex gap-4 justify-center">
                        <button className="flex-1 flex items-center justify-center gap-2 rounded-xl border border-gray-300 dark:border-[#2a402a] bg-white dark:bg-[#162e16] p-3 hover:bg-gray-50 dark:hover:bg-[#1f3f1f] transition-colors group">
                            {/* Apple Logo SVG placeholder */}
                            <span className="material-symbols-outlined dark:text-white group-hover:scale-110 transition-transform">ios</span>
                            <span className="text-sm font-medium dark:text-white">Apple</span>
                        </button>
                        <button
                            onClick={handleGoogleSignIn}
                            className="flex-1 flex items-center justify-center gap-2 rounded-xl border border-gray-300 dark:border-[#2a402a] bg-white dark:bg-[#162e16] p-3 hover:bg-gray-50 dark:hover:bg-[#1f3f1f] transition-colors group"
                        >
                            {/* Google Logo SVG placeholder using generic icon for simplicity */}
                            <span className="material-symbols-outlined dark:text-white group-hover:scale-110 transition-transform">language</span>
                            <span className="text-sm font-medium dark:text-white">Google</span>
                        </button>
                    </div>

                    <div className="mt-4 text-center">
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                            Não tem uma conta?
                            <Link to="/register" className="font-bold text-primary hover:underline ml-1">Criar conta</Link>
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Login;
