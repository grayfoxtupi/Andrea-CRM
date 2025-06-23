import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import AndreaLogo from '../assets/logo.png';
import RoseIllustration from '../assets/rosa.png';
import { registerUser } from '../services/authService';

const SignUp: React.FC = () => {
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      alert('As senhas não coincidem!');
      return;
    }

    try {
      await registerUser({
        name: fullName,
        email,
        password,
      });
      navigate('/login');
    } catch (error) {
      alert('Erro ao registrar. Verifique os dados e tente novamente.');
      console.error(error);
    }
  };

  const handleLoginClick = () => {
    navigate('/login');
  };

  return (
    <div className="flex h-screen bg-white font-nunito">
      <div className="flex-1 flex flex-col items-center justify-center bg-gray-50 p-8">
        <img src={AndreaLogo} alt="Andrea Logo" className="mb-4 w-48" />
        <p className="text-xl text-gray-700 mb-8">Seu lugar para trabalhar</p>
        <img src={RoseIllustration} alt="Rose Illustration" className="w-80 h-auto" />
      </div>

      <div className="flex-1 flex items-center justify-center p-8">
        <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-md">
          <h2 className="text-2xl font-bold text-gray-800 mb-6 text-center">Cadastre-se para a Andrea</h2>

          <form onSubmit={handleSubmit}>
            <div className="mb-4">
              <label htmlFor="fullName" className="block text-sm font-medium text-gray-700 mb-2">
                Nome completo
              </label>
              <input
                type="text"
                id="fullName"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Nome completo"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                required
              />
            </div>

            <div className="mb-4">
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                Endereço de email
              </label>
              <input
                type="email"
                id="email"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="seuemail@email.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>

            <div className="mb-4">
              <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
                Senha
              </label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  id="password"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 pr-10"
                  placeholder="********"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-500 hover:text-gray-700"
                >
                  👁
                </button>
              </div>
            </div>

            <div className="mb-6">
              <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 mb-2">
                Confirme sua senha
              </label>
              <div className="relative">
                <input
                  type={showConfirmPassword ? 'text' : 'password'}
                  id="confirmPassword"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 pr-10"
                  placeholder="********"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-500 hover:text-gray-700"
                >
                  👁
                </button>
              </div>
            </div>

            <div className="flex items-center justify-start mb-6">
              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="rememberMe"
                  className="h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                />
                <label htmlFor="rememberMe" className="ml-2 block text-sm text-gray-900">
                  Lembre-me
                </label>
              </div>
            </div>

            <button
              type="submit"
              className="w-full bg-custom-black text-white py-2.5 rounded-lg hover:bg-gray-800 transition-colors text-lg font-bold"
            >
              Registre-se
            </button>
          </form>

          <p className="mt-6 text-center text-sm text-gray-600">
            Já tem uma conta?{' '}
            <button
              type="button"
              onClick={handleLoginClick}
              className="text-blue-600 hover:underline font-medium"
            >
              Entre
            </button>
          </p>
        </div>
      </div>
    </div>
  );
};

export default SignUp;
