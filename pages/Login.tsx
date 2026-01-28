import React, { useState, useMemo } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { LogIn, Mail, Lock, ArrowRight, Eye, EyeOff } from 'lucide-react';

const Login: React.FC = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [touchedFields, setTouchedFields] = useState({ email: false, password: false });

    const { signIn, signInWithGoogle } = useAuth();
    const navigate = useNavigate();

    // Validation logic
    const emailValid = useMemo(() => {
        if (!touchedFields.email) return true;
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    }, [email, touchedFields.email]);

    const passwordValid = useMemo(() => {
        if (!touchedFields.password) return true;
        return password.length >= 6;
    }, [password, touchedFields.password]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');

        // Mark all fields as touched
        setTouchedFields({ email: true, password: true });

        // Validate
        const emailCheck = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
        const passwordCheck = password.length >= 6;

        if (!emailCheck || !passwordCheck) {
            setError('Por favor, corrija os erros antes de continuar');
            return;
        }

        setIsLoading(true);

        try {
            await signIn(email, password);
            navigate('/');
        } catch (err: any) {
            setError(err.message || 'Email ou senha incorretos');
            // Add shake animation to form
            const form = document.querySelector('form');
            form?.classList.add('animate-shake');
            setTimeout(() => form?.classList.remove('animate-shake'), 500);
        } finally {
            setIsLoading(false);
        }
    };

    const handleGoogleSignIn = async () => {
        setIsLoading(true);
        try {
            await signInWithGoogle();
            navigate('/');
        } catch (err: any) {
            setError(err.message || 'Falha ao entrar com Google');
        } finally {
            setIsLoading(false);
        }
    };

    const handleFieldBlur = (field: 'email' | 'password') => {
        setTouchedFields(prev => ({ ...prev, [field]: true }));
    };

    return (
        <div className="min-h-screen bg-background-dark flex items-center justify-center p-4">
            <div className="w-full max-w-md space-y-8 stagger-children">
                {/* Header */}
                <div className="text-center space-y-2">
                    <div className="inline-flex items-center justify-center w-16 h-16 rounded-sm bg-primary/20 mb-4 animate-scale-in">
                        <LogIn className="w-8 h-8 text-primary" />
                    </div>
                    <h1 className="text-4xl font-bold text-white">Bem-vindo de volta</h1>
                    <p className="text-text-secondary">Entre para continuar seu progresso</p>
                </div>

                {/* Login Form */}
                <form onSubmit={handleSubmit} className="space-y-4">
                    {/* Email Field */}
                    <div className="space-y-2">
                        <label htmlFor="email" className="block text-sm font-medium text-white">
                            Email
                        </label>
                        <div className="relative">
                            <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-text-tertiary pointer-events-none" />
                            <input
                                id="email"
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                onBlur={() => handleFieldBlur('email')}
                                className={`w-full pl-12 pr-4 py-3 bg-surface-dark border rounded-sm text-white placeholder-text-tertiary transition-all duration-250 ${!emailValid
                                    ? 'border-accent-red focus:border-accent-red'
                                    : 'border-white/10 focus:border-primary'
                                    } focus:outline-none`}
                                placeholder="seu@email.com"
                                required
                                autoComplete="email"
                                aria-invalid={!emailValid}
                                aria-describedby={!emailValid ? "email-error" : undefined}
                            />
                        </div>
                        {!emailValid && (
                            <p id="email-error" className="text-sm text-accent-red animate-fade-in" role="alert">
                                Por favor, insira um email válido
                            </p>
                        )}
                    </div>

                    {/* Password Field */}
                    <div className="space-y-2">
                        <label htmlFor="password" className="block text-sm font-medium text-white">
                            Senha
                        </label>
                        <div className="relative">
                            <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-text-tertiary pointer-events-none" />
                            <input
                                id="password"
                                type={showPassword ? 'text' : 'password'}
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                onBlur={() => handleFieldBlur('password')}
                                className={`w-full pl-12 pr-12 py-3 bg-surface-dark border rounded-sm text-white placeholder-text-tertiary transition-all duration-250 ${!passwordValid
                                    ? 'border-accent-red focus:border-accent-red'
                                    : 'border-white/10 focus:border-primary'
                                    } focus:outline-none`}
                                placeholder="••••••••"
                                required
                                autoComplete="current-password"
                                aria-invalid={!passwordValid}
                                aria-describedby={!passwordValid ? "password-error" : undefined}
                            />
                            <button
                                type="button"
                                onClick={() => setShowPassword(!showPassword)}
                                className="absolute right-4 top-1/2 -translate-y-1/2 text-text-tertiary hover:text-white transition-colors"
                                aria-label={showPassword ? "Ocultar senha" : "Mostrar senha"}
                            >
                                {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                            </button>
                        </div>
                        {!passwordValid && (
                            <p id="password-error" className="text-sm text-accent-red animate-fade-in" role="alert">
                                A senha deve ter pelo menos 6 caracteres
                            </p>
                        )}
                    </div>

                    {/* Error Message */}
                    {error && (
                        <div className="p-3 bg-accent-red/10 border border-accent-red/30 rounded-sm animate-fade-in" role="alert">
                            <p className="text-sm text-accent-red">{error}</p>
                        </div>
                    )}

                    {/* Submit Button */}
                    <button
                        type="submit"
                        disabled={isLoading}
                        className="w-full flex items-center justify-center gap-2 px-6 py-3 bg-primary text-black font-semibold rounded-sm transition-all duration-250 hover-scale disabled:opacity-50 disabled:cursor-not-allowed hover:shadow-glow-primary-sm"
                        aria-busy={isLoading}
                    >
                        {isLoading ? (
                            <>
                                <div className="w-5 h-5 border-2 border-black/20 border-t-black rounded-full animate-spin" />
                                <span>Entrando...</span>
                            </>
                        ) : (
                            <>
                                <span>Entrar</span>
                                <ArrowRight className="w-5 h-5" />
                            </>
                        )}
                    </button>
                </form>

                {/* Divider */}
                <div className="relative">
                    <div className="absolute inset-0 flex items-center">
                        <div className="w-full border-t border-white/10"></div>
                    </div>
                    <div className="relative flex justify-center text-sm">
                        <span className="px-4 bg-background-dark text-text-secondary">ou</span>
                    </div>
                </div>

                {/* Social Login Buttons */}
                <div className="space-y-3">
                    <button
                        onClick={handleGoogleSignIn}
                        disabled={isLoading}
                        className="w-full flex items-center justify-center gap-3 px-6 py-3 bg-surface-dark border border-white/10 text-white font-medium rounded-sm transition-all duration-250 hover-scale hover:border-white/20 disabled:opacity-50"
                    >
                        <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
                            <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
                            <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
                            <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" />
                            <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
                        </svg>
                        Continuar com Google
                    </button>

                    <button
                        disabled={isLoading}
                        className="w-full flex items-center justify-center gap-3 px-6 py-3 bg-surface-dark border border-white/10 text-white font-medium rounded-sm transition-all duration-250 hover-scale hover:border-white/20 disabled:opacity-50"
                    >
                        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                            <path d="M17.05 20.28c-.98.95-2.05.88-3.08.4-1.09-.5-2.08-.48-3.24 0-1.44.62-2.2.44-3.06-.4C2.79 15.25 3.51 7.59 9.05 7.31c1.35.07 2.29.74 3.08.8 1.18-.24 2.31-.93 3.57-.84 1.51.12 2.65.72 3.4 1.8-3.12 1.87-2.38 5.98.48 7.13-.57 1.5-1.31 2.99-2.54 4.09l.01-.01zM12.03 7.25c-.15-2.23 1.66-4.07 3.74-4.25.29 2.58-2.34 4.5-3.74 4.25z" />
                        </svg>
                        Continuar com Apple
                    </button>
                </div>

                {/* Sign Up Link */}
                <div className="text-center">
                    <p className="text-text-secondary">
                        Não tem uma conta?{' '}
                        <Link to="/register" className="text-primary font-medium hover:underline">
                            Cadastre-se
                        </Link>
                    </p>
                </div>
            </div>
        </div>
    );
};

export default Login;
