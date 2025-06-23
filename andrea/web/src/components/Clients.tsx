import React, { useMemo, useState, useCallback, useEffect } from 'react';

interface Client {
  id: number;
  empresa: string;
  representante: string;
  cnpj: string;
  localizacao: string;
  email: string;
  telefone: string;
}

interface ClientsProps {
  searchQuery: string;
  newClientData?: Client | null; 
}

const Clients: React.FC<ClientsProps> = ({ searchQuery, newClientData }) => {
  const [copiedStates, setCopiedStates] = useState<Record<string, boolean>>({});
  const [clientsData, setClientsData] = useState<Client[]>([]);

  useEffect(() => {
    if (newClientData) {
      setClientsData(prevClients => {
        if (!prevClients.some(client => client.id === newClientData.id)) {
          return [...prevClients, newClientData];
        }
        return prevClients;
      });
    }
  }, [newClientData]);

  const filteredClients = useMemo(() => {
    if (!searchQuery) {
      return clientsData; 
    }
    const lowerCaseQuery = searchQuery.toLowerCase();
    return clientsData.filter(client => 
      client.empresa.toLowerCase().includes(lowerCaseQuery) ||
      client.representante.toLowerCase().includes(lowerCaseQuery) ||
      client.cnpj.toLowerCase().includes(lowerCaseQuery) ||
      client.localizacao.toLowerCase().includes(lowerCaseQuery) ||
      client.email.toLowerCase().includes(lowerCaseQuery) ||
      client.telefone.toLowerCase().includes(lowerCaseQuery)
    );
  }, [searchQuery, clientsData]); 

  const truncateText = (text: string, maxLength: number): string => {
    if (text.length > maxLength) {
      return `${text.substring(0, maxLength)}...`;
    }
    return text;
  };

  const handleCopy = useCallback(async (textToCopy: string, clientId: number, fieldName: string) => {
    try {
      await navigator.clipboard.writeText(textToCopy);
      const key = `${clientId}-${fieldName}`;
      setCopiedStates(prev => ({ ...prev, [key]: true }));
      setTimeout(() => {
        setCopiedStates(prev => ({ ...prev, [key]: false }));
      }, 2000);
    } catch (err) {
      console.error('Falha ao copiar:', err);
    }
  }, []);

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 font-nunito overflow-hidden">
      <div className="grid grid-cols-6 gap-4 px-6 py-4 bg-gray-50 border-b border-gray-200 text-sm font-bold text-custom-gray">
        <div>Empresa</div>
        <div>Representante</div>
        <div>Telefone</div>
        <div>CNPJ</div>
        <div>Localização</div>
        <div>Email</div>
      </div>

      {filteredClients.length === 0 ? (
        <div className="px-6 py-4 text-center text-gray-500">
          Nenhum cliente encontrado para "{searchQuery}".
        </div>
      ) : (
        filteredClients.map((client) => (
          <div
            key={client.id}
            className="grid grid-cols-6 gap-4 px-6 py-4 items-center hover:bg-gray-50 border-b border-gray-100 last:border-b-0"
          >
            <div className="text-sm font-normal text-custom-black relative cursor-pointer"
                 onClick={() => handleCopy(client.empresa, client.id, 'empresa')}
                 title={`Clique para copiar: ${client.empresa}`}>
              {truncateText(client.empresa, 25)}
              {copiedStates[`${client.id}-empresa`] && (
                <span className="absolute -top-6 left-1/2 -translate-x-1/2 bg-gray-700 text-white text-xs px-2 py-1 rounded shadow-lg whitespace-nowrap z-10">
                  Copiado!
                </span>
              )}
            </div>

            <div className="text-sm font-normal text-custom-gray relative cursor-pointer"
                 onClick={() => handleCopy(client.representante, client.id, 'representante')}
                 title={`Clique para copiar: ${client.representante}`}>
              {truncateText(client.representante, 20)}
              {copiedStates[`${client.id}-representante`] && (
                <span className="absolute -top-6 left-1/2 -translate-x-1/2 bg-gray-700 text-white text-xs px-2 py-1 rounded shadow-lg whitespace-nowrap z-10">
                  Copiado!
                </span>
              )}
            </div>

            <div className="text-sm font-normal text-custom-gray relative cursor-pointer"
                 onClick={() => handleCopy(client.telefone, client.id, 'telefone')}
                 title={`Clique para copiar: ${client.telefone}`}>
              {truncateText(client.telefone, 15)}
              {copiedStates[`${client.id}-telefone`] && (
                <span className="absolute -top-6 left-1/2 -translate-x-1/2 bg-gray-700 text-white text-xs px-2 py-1 rounded shadow-lg whitespace-nowrap z-10">
                  Copiado!
                </span>
              )}
            </div>

            <div className="text-sm font-normal text-custom-gray relative cursor-pointer"
                 onClick={() => handleCopy(client.cnpj, client.id, 'cnpj')}
                 title={`Clique para copiar: ${client.cnpj}`}>
              {truncateText(client.cnpj, 18)}
              {copiedStates[`${client.id}-cnpj`] && (
                <span className="absolute -top-6 left-1/2 -translate-x-1/2 bg-gray-700 text-white text-xs px-2 py-1 rounded shadow-lg whitespace-nowrap z-10">
                  Copiado!
                </span>
              )}
            </div>

            <div className="text-sm font-normal text-custom-gray relative cursor-pointer"
                 onClick={() => handleCopy(client.localizacao, client.id, 'localizacao')}
                 title={`Clique para copiar: ${client.localizacao}`}>
              {truncateText(client.localizacao, 20)}
              {copiedStates[`${client.id}-localizacao`] && (
                <span className="absolute -top-6 left-1/2 -translate-x-1/2 bg-gray-700 text-white text-xs px-2 py-1 rounded shadow-lg whitespace-nowrap z-10">
                  Copiado!
                </span>
              )}
            </div>

            <div className="text-sm font-normal text-custom-gray relative cursor-pointer"
                 onClick={() => handleCopy(client.email, client.id, 'email')}
                 title={`Clique para copiar: ${client.email}`}>
              {truncateText(client.email, 18)}
              {copiedStates[`${client.id}-email`] && (
                <span className="absolute -top-6 left-1/2 -translate-x-1/2 bg-gray-700 text-white text-xs px-2 py-1 rounded shadow-lg whitespace-nowrap z-10">
                  Copiado!
                </span>
              )}
            </div>
          </div>
        ))
      )}
    </div>
  );
};

export default Clients;
