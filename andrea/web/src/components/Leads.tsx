import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { getLeads } from '../services/leadService';
import type { Lead } from '../services/types';

interface LeadsProps {
  onNewTask: () => void;
  searchQuery: string;
  onPromoteLead: (clientData: {
    id: number;
    empresa: string;
    representante: string;
    cnpj: string;
    localizacao: string;
    email: string;
    telefone: string;
  }) => void;
  onLeadsDataChange: (leads: Lead[]) => void;
}

const Leads: React.FC<LeadsProps> = ({
  onNewTask,
  searchQuery,
  onPromoteLead,
  onLeadsDataChange
}) => {
  const [expanded, setExpanded] = useState<number[]>([]);
  const [leadsData, setLeadsData] = useState<Lead[]>([]);

  useEffect(() => {
    const fetch = async () => {
      const leads = await getLeads();
      setLeadsData(leads);
      onLeadsDataChange(leads);
    };
    fetch();
  }, [onLeadsDataChange]);

  const toggleExpanded = (id: number) => {
    setExpanded(prev =>
      prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]
    );
  };

  const handleArchive = useCallback((id: number) => {
    setLeadsData(prev =>
      prev.map(l =>
        l.id === id
          ? {
              ...l,
              status: 'Inativo',
              statusColor: 'bg-red-100 text-red-800',
              borderColor: 'border-l-red-500'
            }
          : l
      )
    );
    onLeadsDataChange(
      leadsData.map(l =>
        l.id === id
          ? {
              ...l,
              status: 'Inativo',
              statusColor: 'bg-red-100 text-red-800',
              borderColor: 'border-l-red-500'
            }
          : l
      )
    );
  }, [leadsData, onLeadsDataChange]);

  const handlePromote = useCallback(
    (id: number) => {
      const lead = leadsData.find(l => l.id === id);
      if (!lead) return;
      onPromoteLead({
        id,
        empresa: lead.empresa,
        representante: lead.representante,
        cnpj: lead.cnpj,
        localizacao: lead.localizacao,
        email: lead.email,
        telefone: lead.telefoneContato
      });
      setLeadsData(prev => prev.filter(l => l.id !== id));
      onLeadsDataChange(leadsData.filter(l => l.id !== id));
    },
    [leadsData, onPromoteLead, onLeadsDataChange]
  );

  const filtered = useMemo(() => {
    const ativos = leadsData.filter(l => l.status === 'Ativo');
    if (!searchQuery) return ativos;
    const q = searchQuery.toLowerCase();
    return ativos.filter(
      l =>
        l.empresa.toLowerCase().includes(q) ||
        l.representante.toLowerCase().includes(q)
    );
  }, [searchQuery, leadsData]);

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 font-nunito max-w-7xl mx-auto">
      <div className="grid grid-cols-[30px_1.5fr_1fr_1fr_1fr_1fr_30px] px-6 py-3 font-bold border-b border-gray-100 text-gray-600">
        <div></div>
        <div>Empresa</div>
        <div>Representante</div>
        <div>CNPJ</div>
        <div>Status</div>
        <div>Ações</div>
        <div></div>
      </div>

      {filtered.length === 0 ? (
        <div className="px-6 py-4 text-center text-gray-500">Nenhum lead encontrado.</div>
      ) : (
        filtered.map(lead => (
          <div
            key={lead.id}
            className={`border-b border-gray-100 ${
              expanded.includes(lead.id) ? `border-l-4 ${lead.borderColor}` : ''
            }`}
          >
            <div className="grid grid-cols-[30px_1.5fr_1fr_1fr_1fr_1fr_30px] px-6 py-4 items-center cursor-pointer" onClick={() => toggleExpanded(lead.id)}>
              <div>
                {expanded.includes(lead.id) ? (
                  <span>&#9660;</span> 
                ) : (
                  <span>&#9658;</span> 
                )}
              </div>
              <div>{lead.empresa}</div>
              <div>{lead.representante}</div>
              <div>{lead.cnpj}</div>
              <div>
                <span
                  className={`px-2 py-1 rounded text-sm font-semibold ${lead.statusColor}`}
                >
                  {lead.status}
                </span>
              </div>
              <div>
                <button
                  onClick={e => {
                    e.stopPropagation();
                    handleArchive(lead.id);
                  }}
                  className="text-red-500 hover:text-red-700 mr-3"
                >
                  Arquivar
                </button>
                <button
                  onClick={e => {
                    e.stopPropagation();
                    handlePromote(lead.id);
                  }}
                  className="text-green-600 hover:text-green-800"
                >
                  Promover
                </button>
              </div>
              <div></div>
            </div>

            {expanded.includes(lead.id) && (
              <div className="px-12 pb-4 text-gray-700 text-sm space-y-1">
                <div><strong>Localização:</strong> {lead.localizacao}</div>
                <div><strong>E-mail:</strong> {lead.email}</div>
                <div><strong>Telefone:</strong> {lead.telefoneContato}</div>
                <div><strong>Razão Social:</strong> {lead.razaoSocial}</div>
                <div><strong>Serviços/Produtos:</strong> {lead.servicosProdutos}</div>
                <div><strong>Local Contato:</strong> {lead.localContato}</div>
                <div><strong>Área de Atuação:</strong> {lead.areaAtuacao}</div>
                <div><strong>Meio de Contato:</strong> {lead.meioContato}</div>
              </div>
            )}
          </div>
        ))
      )}
    </div>
  );
};

export default Leads;
