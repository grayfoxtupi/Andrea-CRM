import React, { useState } from 'react';
import InputWeb from './InputWeb';
import { createLead } from '../services/leadService';

interface FormLeadProps {
  onClose: () => void;
  onSubmit: (data: any) => void;
}

const FormLead: React.FC<FormLeadProps> = ({ onClose, onSubmit }) => {
  const [formData, setFormData] = useState({
    nomeEmpresaOuCliente: '',
    meioDeContato: '',
    localDeContato: '',
    razaoSocial: '',
    cnpjCpf: '',
    servicosOuProdutos: '',
    email: '',
    telefone: '',
    areaDeAtuacao: '',
    descricao: '',
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await createLead(formData);
      onSubmit(response); // envia o novo lead
      onClose();
    } catch (error) {
      console.error('Erro ao criar lead:', error);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 font-nunito">
      <div className="bg-white rounded-lg p-8 w-full max-w-3xl max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-custom-black">Novo Lead</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600 transition-colors">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-4">
            {[
              ['Nome da empresa/cliente', 'nomeEmpresaOuCliente'],
              ['Meio de contato', 'meioDeContato'],
              ['Local de contato', 'localDeContato'],
              ['Razão Social', 'razaoSocial'],
              ['CNPJ/CPF', 'cnpjCpf'],
              ['Serviços/Produtos', 'servicosOuProdutos'],
              ['Email', 'email'],
              ['Telefone', 'telefone'],
              ['Área de Atuação', 'areaDeAtuacao'],
            ].map(([label, name]) => (
              <InputWeb
                key={name}
                label={label}
                name={name}
                value={(formData as any)[name]}
                onChange={handleInputChange}
                placeholder={label.toLowerCase()}
              />
            ))}
            <div className="md:col-span-2">
              <label htmlFor="descricao" className="block text-sm font-medium text-custom-black mb-1">Descrição</label>
              <textarea
                id="descricao"
                name="descricao"
                value={formData.descricao}
                onChange={handleInputChange}
                rows={3}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-custom-black focus:border-transparent resize-none"
                placeholder="adicione a descrição da empresa"
              />
            </div>
          </div>

          <div className="flex justify-end pt-4">
            <button type="submit" className="px-6 py-3 bg-custom-black text-white rounded-lg hover:bg-gray-800 transition-colors font-bold shadow-lg">
              Criar Lead
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default FormLead;
