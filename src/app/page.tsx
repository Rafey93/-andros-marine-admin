'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Eye, EyeOff, Anchor, AlertCircle } from 'lucide-react';
import { login } from '@/lib/auth';

const loginSchema = z.object({
  username: z.string().min(1, 'Username is required'),
  password: z.string().min(1, 'Password is required'),
});
type LoginForm = z.infer<typeof loginSchema>;

export default function LoginPage() {
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const [authError, setAuthError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const { register, handleSubmit, formState: { errors } } = useForm<LoginForm>({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = async (data: LoginForm) => {
    setIsLoading(true);
    setAuthError('');
    if (await login(data.username, data.password)) {
      router.push('/dashboard');
      router.refresh();
    } else {
      setAuthError('Invalid username or password. Please try again.');
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-navy">
      <div
        className="absolute inset-0 opacity-5"
        style={{
          backgroundImage: 'repeating-linear-gradient(45deg, white 0, white 1px, transparent 0, transparent 50%)',
          backgroundSize: '20px 20px',
        }}
      />
      <div className="relative z-10 w-full max-w-[360px] px-4">
        <div className="bg-white shadow-2xl overflow-hidden">
          <div className="bg-teal h-1.5 w-full" />
          <div className="px-8 pt-8 pb-10">
            <div className="flex flex-col items-center mb-6">
              <div className="w-16 h-16 bg-navy flex items-center justify-center mb-4 shadow-lg">
                <Anchor className="w-9 h-9 text-teal" />
              </div>
              <h1 className="text-xl font-bold text-navy uppercase tracking-widest text-center leading-tight">
                MAS Marine Academy
              </h1>
              <p className="text-xs text-gray-400 uppercase tracking-wider mt-1">Admin Portal</p>
            </div>
            <div className="flex items-center gap-3 mb-6">
              <div className="flex-1 h-px bg-gray-200" />
              <span className="text-xs text-gray-400 uppercase tracking-widest font-semibold">Sign In</span>
              <div className="flex-1 h-px bg-gray-200" />
            </div>
            {authError && (
              <div className="flex items-center gap-2 bg-red-50 border border-red-200 text-red-700 px-3 py-2.5 mb-4 text-sm">
                <AlertCircle className="w-4 h-4 flex-shrink-0" />
                <span>{authError}</span>
              </div>
            )}
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-gray-600 uppercase tracking-wider mb-1.5">Login</label>
                <input
                  {...register('username')}
                  type="text"
                  placeholder="Enter your username"
                  autoComplete="username"
                  className="w-full h-10 px-3 border border-gray-300 text-sm text-gray-800 placeholder-gray-400 focus:outline-none focus:border-teal focus:ring-1 focus:ring-teal transition-colors"
                />
                {errors.username && <p className="text-red-500 text-xs mt-1">{errors.username.message}</p>}
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-600 uppercase tracking-wider mb-1.5">Password</label>
                <div className="relative">
                  <input
                    {...register('password')}
                    type={showPassword ? 'text' : 'password'}
                    placeholder="Enter your password"
                    autoComplete="current-password"
                    className="w-full h-10 px-3 pr-10 border border-gray-300 text-sm text-gray-800 placeholder-gray-400 focus:outline-none focus:border-teal focus:ring-1 focus:ring-teal transition-colors"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(v => !v)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                    tabIndex={-1}
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
                {errors.password && <p className="text-red-500 text-xs mt-1">{errors.password.message}</p>}
              </div>
              <button
                type="submit"
                disabled={isLoading}
                className="w-full h-10 bg-navy text-white text-sm font-semibold uppercase tracking-wider hover:bg-navy-dark transition-colors disabled:opacity-60 disabled:cursor-not-allowed mt-2"
              >
                {isLoading ? 'Signing in...' : 'Sign In'}
              </button>
            </form>
          </div>
        </div>
        <p className="text-center text-xs text-white/40 mt-5 tracking-wide">
          2025 MAS Marine Academy. All rights reserved.
        </p>
      </div>
    </div>
  );
}
