import React, { useEffect, useState } from 'react';
import InputWeb from './InputWeb';
import InputFile from './InputFile';
import { useAuth } from '../hooks/useAuth';
import { updateUser } from '../services/userService';

const Profile: React.FC = () => {
  const { user } = useAuth();
  const [avatarUri, setAvatarUri] = useState('https://img.freepik.com/vetores-premium/avatar-de-perfil-padrao-de-silhueta-preta_664995-355.jpg');
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    cargo: '',
    empresa: '',
    localizacao: '',
    dataDeNascimento: '',
    telefone: '',
    senha: '',
    confirmarSenha: '',
  });

  useEffect(() => {
    if (user) {
      setFormData({
        name: user.name || '',
        email: user.email || '',
        cargo: '',
        empresa: '',
        localizacao: '',
        dataDeNascimento: '',
        telefone: '',
        senha: user.password || '',
        confirmarSenha: user.password || '',
      });
    }
  }, [user]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (file: File | null) => {
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setAvatarUri(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.senha !== formData.confirmarSenha) {
      alert('As senhas não coincidem!');
      return;
    }
  
    try {
      const updatedUser = {
        ...user,
        name: formData.name,
        email: formData.email,
        password: formData.senha,
        avatar: avatarUri, // <-- Adicione esta linha para salvar o avatar
      };
  
      await updateUser(user.userId, updatedUser);
      localStorage.setItem('loggedUser', JSON.stringify(updatedUser));
      alert('Perfil atualizado com sucesso!');
    } catch (err) {
      alert('Erro ao atualizar perfil.');
      console.error(err);
    }
  };
  return (
    <div className="w-full bg-white rounded-lg shadow-sm border border-gray-200 p-8 font-nunito max-w-4xl mx-auto">
      <h2 className="text-2xl font-bold text-custom-black mb-8 text-center">Perfil</h2>

      <form onSubmit={handleSave}>
        <div className="flex flex-col items-center mb-8">
          <InputFile
            label=""
            onFileChange={handleFileChange}
            currentImageUrl={avatarUri}
          />
        </div>

        <h3 className="text-lg font-bold text-custom-black mb-4">Informações pessoais</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-4 mb-8">
          <InputWeb
            label="Nome completo"
            name="name"
            value={formData.name}
            onChange={handleInputChange}
            placeholder="Seu nome"
          />
          <InputWeb
            label="Cargo"
            name="cargo"
            value={formData.cargo}
            onChange={handleInputChange}
            placeholder="Ex: Designer"
          />
          <InputWeb
            label="Empresa"
            name="empresa"
            value={formData.empresa}
            onChange={handleInputChange}
            placeholder="Nome da empresa"
          />
          <InputWeb
            label="Localização"
            name="localizacao"
            value={formData.localizacao}
            onChange={handleInputChange}
            placeholder="Cidade, Estado"
          />
          <div>
            <label htmlFor="dataDeNascimento" className="block text-sm font-medium text-custom-black mb-1">
              Data de nascimento
            </label>
            <div className="relative">
              <input
                type="date"
                id="dataDeNascimento"
                name="dataDeNascimento"
                value={formData.dataDeNascimento}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-custom-black focus:border-transparent pr-10"
              />
              <span className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400">
                📅
              </span>
            </div>
          </div>
        </div>

        <h3 className="text-lg font-bold text-custom-black mb-4">Informações de contato</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-4 mb-8">
          <InputWeb
            label="E-mail"
            name="email"
            type="email"
            value={formData.email}
            onChange={handleInputChange}
            placeholder="seuemail@email.com"
          />
          <InputWeb
            label="Telefone"
            name="telefone"
            type="tel"
            value={formData.telefone}
            onChange={handleInputChange}
            placeholder="+55 (11) 99999-9999"
          />
        </div>

        <h3 className="text-lg font-bold text-custom-black mb-4">Informações da conta</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-4 mb-8">
          <InputWeb
            label="Editar senha"
            name="senha"
            type="password"
            value={formData.senha}
            onChange={handleInputChange}
            placeholder="********"
          />
          <InputWeb
            label="Confirmar senha"
            name="confirmarSenha"
            type="password"
            value={formData.confirmarSenha}
            onChange={handleInputChange}
            placeholder="********"
          />
        </div>

        <div className="flex justify-end pt-4">
          <button
            type="submit"
            className="px-6 py-3 bg-custom-black text-white rounded-lg hover:bg-gray-800 transition-colors font-bold shadow-lg"
          >
            Salvar
          </button>
        </div>
      </form>
    </div>
  );
};

export default Profile;
