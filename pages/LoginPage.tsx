import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Sprout, Lock, User, AlertCircle } from 'lucide-react';
import { api } from '../services/api'; // Import dari folder sebelah
import { useAppContext } from '../App'; // Import dari file luar
import { GoogleLogin } from '@react-oauth/google';
import toast from 'react-hot-toast';

export const LoginPage: React.FC = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const navigate = useNavigate();

    // Mengambil fungsi login dari Context (pastikan di App.tsx sudah ada)
    // Jika belum ada di App.tsx, hapus baris ini dulu biar nggak error
    const { login } = useAppContext();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setIsLoading(true);

        // Di dalam handleSubmit
        try {
            const data = await api.login(username, password);
            await login(data.token);

            // GANTI alert DENGAN INI:
            toast.success(`Selamat datang kembali!`);

            navigate('/');
        } catch (err: any) {
            // GANTI setError/alert DENGAN INI:
            toast.error(err.message || 'Gagal login, cek username/password.');
        }
    };
    const handleGoogleSuccess = async (credentialResponse: any) => {
        if (credentialResponse.credential) {
            try {
                setIsLoading(true);
                // Kirim token google ke backend kita
                const data = await api.loginWithGoogle(credentialResponse.credential);

                // Sama seperti login biasa
                localStorage.setItem('token', data.token);
                if (login) login(data.token);
                navigate('/');
            } catch (err) {
                setError('Google Login Failed');
            } finally {
                setIsLoading(false);
            }
        }
    };

    return (
        <div className="min-h-screen bg-melon-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
            <div className="sm:mx-auto sm:w-full sm:max-w-md">
                <div className="flex justify-center">
                    <div className="bg-melon-500 p-2 rounded-xl">
                        <Sprout className="h-10 w-10 text-white" />
                    </div>
                </div>
                <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
                    Masuk ke Central Melon
                </h2>
                <p className="mt-2 text-center text-sm text-gray-600">
                    Atau <Link to="/register" className="font-medium text-melon-600 hover:text-melon-500">buat akun baru</Link>
                </p>
            </div>

            <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
                <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10 border border-gray-100">
                    <form className="space-y-6" onSubmit={handleSubmit}>
                        {error && (
                            <div className="bg-red-50 border-l-4 border-red-400 p-4 flex items-center">
                                <AlertCircle className="h-5 w-5 text-red-400 mr-2" />
                                <p className="text-sm text-red-700">{error}</p>
                            </div>
                        )}

                        <div>
                            <label className="block text-sm font-medium text-gray-700">Username</label>
                            <div className="mt-1 relative rounded-md shadow-sm">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                    <User className="h-5 w-5 text-gray-400" />
                                </div>
                                <input type="text" required value={username} onChange={(e) => setUsername(e.target.value)} className="focus:ring-melon-500 focus:border-melon-500 block w-full pl-10 sm:text-sm border-gray-300 rounded-md py-2 border" placeholder="Username" />
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700">Password</label>
                            <div className="mt-1 relative rounded-md shadow-sm">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                    <Lock className="h-5 w-5 text-gray-400" />
                                </div>
                                <input type="password" required value={password} onChange={(e) => setPassword(e.target.value)} className="focus:ring-melon-500 focus:border-melon-500 block w-full pl-10 sm:text-sm border-gray-300 rounded-md py-2 border" placeholder="••••••••" />
                            </div>
                        </div>

                        <div>
                            <button type="submit" disabled={isLoading} className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-melon-600 hover:bg-melon-700 disabled:opacity-50">
                                {isLoading ? 'Signing in...' : 'Sign in'}
                            </button>
                        </div>
                        <div className="mt-6">
                            <div className="relative">
                                <div className="absolute inset-0 flex items-center">
                                    <div className="w-full border-t border-gray-300" />
                                </div>
                                <div className="relative flex justify-center text-sm">
                                    <span className="px-2 bg-white text-gray-500">Or continue with</span>
                                </div>
                            </div>

                            <div className="mt-6 flex justify-center">
                                <GoogleLogin
                                    onSuccess={handleGoogleSuccess}
                                    onError={() => setError('Google Login Failed')}
                                />
                            </div>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};