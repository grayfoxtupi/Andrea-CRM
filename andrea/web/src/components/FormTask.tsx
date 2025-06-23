import React, { useEffect, useState } from 'react';
import InputWeb from './InputWeb';
import { createTask } from '../services/taskService';

interface FormTaskProps {
  onClose: () => void;
  onSubmit: (data: any) => void;
  editingTask?: any;
}

const FormTask: React.FC<FormTaskProps> = ({ onClose, onSubmit, editingTask }) => {
  const [formData, setFormData] = useState({
    nomeDoContato: '',
    meioDeEncontro: '',
    localDeEncontro: '',
    ambiente: '',
    localizacao: '',
    escolhaUmaData: '',
    proposta: '',
  });

  useEffect(() => {
    if (editingTask) {
      setFormData({
        nomeDoContato: editingTask.contact || '',
        meioDeEncontro: editingTask.contactMethod || '',
        localDeEncontro: editingTask.place || '',
        ambiente: editingTask.environment || '',
        localizacao: editingTask.location || '',
        escolhaUmaData: editingTask.date ? new Date(editingTask.date).toISOString().split('T')[0] : '',
        proposta: editingTask.feedback || '',
      });
    }
  }, [editingTask]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await createTask(formData);
      onSubmit(response);
      onClose();
    } catch (error) {
      console.error('Erro ao criar tarefa:', error);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 font-nunito">
      <div className="bg-white rounded-lg p-8 w-full max-w-3xl mx-4">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-custom-black">Nova tarefa</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600 transition-colors">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-4">
            {[
              ['Nome do contato', 'nomeDoContato'],
              ['Meio de encontro', 'meioDeEncontro'],
              ['Local de encontro', 'localDeEncontro'],
              ['Ambiente', 'ambiente'],
              ['Localização', 'localizacao'],
            ].map(([label, name]) => (
              <InputWeb
                key={name}
                label={label}
                name={name}
                value={(formData as any)[name]}
                onChange={handleChange}
                placeholder={label.toLowerCase()}
              />
            ))}

            <div>
              <label htmlFor="escolhaUmaData" className="block text-sm font-medium text-custom-black mb-1">
                Escolha uma Data
              </label>
              <input
                type="date"
                id="escolhaUmaData"
                name="escolhaUmaData"
                value={formData.escolhaUmaData}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-custom-black focus:border-transparent pr-10"
              />
            </div>
          </div>

          <div className="mt-4">
            <label htmlFor="proposta" className="block text-sm font-medium text-custom-black mb-1">
              Proposta
            </label>
            <textarea
              id="proposta"
              name="proposta"
              value={formData.proposta}
              onChange={handleChange}
              rows={3}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-custom-black focus:border-transparent resize-none"
              placeholder="adicione à proposta desta tarefa"
            />
          </div>

          <div className="flex justify-end pt-4">
            <button type="submit" className="px-6 py-3 bg-custom-black text-white rounded-lg hover:bg-gray-800 transition-colors shadow-lg">
              Criar tarefa
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default FormTask;
