import React, { useState, useMemo } from "react";
import SideMenu from "./SideMenu";
import Leads from "./Leads";
import Tasks from "./Tasks";
import Clients from "./Clients";
import SearchBar from "./SearchBar";
import FormLead from "./FormLead";
import FormTask from "./FormTask";
import Profile from "./Profile";
import ScheduleWeb from "./ScheduleWeb";
import Notifications from "./Notifications";
import NotificationBell from "./NotificationBell";
import { useAuth } from "../hooks/useAuth";
import type { Lead } from '../services/types';
import type { Task } from '../services/types';


interface TaskNotification {
  id: string;
  type: "added" | "edited" | "cancelled";
  description: string;
  timestamp: string;
}

export type ActiveSection = "leads" | "tasks" | "clients" | "agenda" | "profile";

interface ClientData {
  id: number;
  empresa: string;
  representante: string;
  cnpj: string;
  localizacao: string;
  email: string;
  telefone: string;
}

const Dashboard: React.FC = () => {
  const { user } = useAuth();
  const [activeSection, setActiveSection] = useState<ActiveSection>("leads");
  const [showLeadModal, setShowLeadModal] = useState(false);
  const [showTaskModal, setShowTaskModal] = useState(false);
  const [editingTask, setEditingTask] = useState<Task | null>(null);
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [newClientPromoted, setNewClientPromoted] = useState<ClientData | null>(null);
  const [showNotifications, setShowNotifications] = useState(false);

  const [currentLeadsData, setCurrentLeadsData] = useState<Lead[]>([]);
  const [currentTasksData, setCurrentTasksData] = useState<Task[]>([]);

  const [notifications, setNotifications] = useState<TaskNotification[]>([]);
  const [hasUnreadNotifications, setHasUnreadNotifications] = useState(false);
  const [previousNotificationCount, setPreviousNotificationCount] = useState(0);

  // Função para adicionar notificações
  const addNotification = (notification: TaskNotification) => {
    setNotifications((prev) => [notification, ...prev]);
    setHasUnreadNotifications(true);
  };

  // Exemplo: Ao criar um novo lead, adiciona notificação
  const handleNewLead = () => {
    setShowLeadModal(true);
  };

  // Ao criar um novo lead, atualize o estado e adicione notificação
  const onLeadSubmit = (lead: Lead) => {
    setCurrentLeadsData((prev) => [lead, ...prev]);
    addNotification({
      id: `lead-added-${lead.id}`,
      type: "added",
      description: `Novo lead "${lead.empresa}" criado.`,
      timestamp: new Date().toLocaleString(),
    });
    setShowLeadModal(false);
  };

  // Tarefa: abrir modal para nova tarefa
  const handleNewTask = () => {
    setEditingTask(null);
    setShowTaskModal(true);
  };

  // Ao criar ou editar tarefa
  const onTaskSubmit = (task: Task, isEdit: boolean = false) => {
    setCurrentTasksData((prev) => {
      if (isEdit) {
        return prev.map((t) => (t.id === task.id ? task : t));
      }
      return [task, ...prev];
    });

    addNotification({
      id: `task-${isEdit ? "edited" : "added"}-${task.id}`,
      type: isEdit ? "edited" : "added",
      description: isEdit
      ? `Tarefa "${task.proposta}" foi editada.`
      : `Nova tarefa "${task.proposta}" adicionada.`,
      timestamp: new Date().toLocaleString(),
    });

    setShowTaskModal(false);
    setEditingTask(null);
  };

  // Editar tarefa: abre modal e seta tarefa para edição
  const handleEditTask = (task: Task) => {
    setEditingTask(task);
    setShowTaskModal(true);
  };

  // Cancelar tarefa: atualiza status e adiciona notificação
  const handleCancelTask = (taskId: number) => {
    setCurrentTasksData((prev) =>
      prev.map((task) =>
        task.id === taskId
          ? { ...task, status: "Cancelado", statusColor: "bg-red-100 text-red-800", borderColor: "border-l-red-500" }
          : task
      )
    );
    addNotification({
      id: `task-cancelled-${taskId}`,
      type: "cancelled",
      description: `Tarefa com ID ${taskId} foi cancelada.`,
      timestamp: new Date().toLocaleString(),
    });
  };

  // Promover lead para cliente
  const handlePromoteLeadToClient = (clientData: ClientData) => {
    setNewClientPromoted(clientData);
    setActiveSection("clients");
    setTimeout(() => setNewClientPromoted(null), 100);
  };

  const notificationCount = useMemo(() => notifications.length, [notifications]);

  React.useEffect(() => {
    if (notificationCount > previousNotificationCount) {
      setHasUnreadNotifications(true);
    }
    setPreviousNotificationCount(notificationCount);
  }, [notificationCount, previousNotificationCount]);

  const handleOpenNotifications = () => {
    setShowNotifications(true);
    setHasUnreadNotifications(false);
  };

  const renderContent = () => {
    switch (activeSection) {
      case "leads":
        return (
          <Leads
            onNewTask={handleNewTask}
            searchQuery={searchQuery}
            onPromoteLead={handlePromoteLeadToClient}
            onLeadsDataChange={setCurrentLeadsData}
          />
        );
      case "tasks":
        return (
          <Tasks
            onEditTask={handleEditTask}
            onCancelTask={handleCancelTask}
            searchQuery={searchQuery}
            onTasksDataChange={setCurrentTasksData}
          />
        );
      case "clients":
        return <Clients searchQuery={searchQuery} newClientData={newClientPromoted} />;
      case "agenda":
        return <ScheduleWeb />;
      case "profile":
        return <Profile />;
      default:
        return null;
    }
  };

  const getSectionTitle = () => {
    switch (activeSection) {
      case "leads":
        return "Leads";
      case "tasks":
        return "Tarefas";
      case "clients":
        return "Clientes";
      case "agenda":
        return "Agenda";
      case "profile":
        return "Perfil";
      default:
        return "Leads";
    }
  };

  const getSearchPlaceholder = () => {
    switch (activeSection) {
      case "leads":
        return "Pesquisar leads";
      case "tasks":
        return "Pesquisar tarefas";
      case "clients":
        return "Pesquisar clientes";
      case "agenda":
      case "profile":
        return "";
      default:
        return "Pesquisar";
    }
  };

  const showNewButton = activeSection === "leads";
  const showGreeting =
    activeSection === "leads" ||
    activeSection === "tasks" ||
    activeSection === "clients" ||
    activeSection === "agenda";
  const showCommonHeader = activeSection !== "profile";

  return (
    <div className="flex h-screen bg-gray-50 font-nunito">
      <SideMenu activeSection={activeSection} onSectionChange={setActiveSection} />

      <div className="flex-1 p-8">
        <div className="w-full">
          {showGreeting && (
            <h1 className="text-2xl font-bold text-custom-black mb-8 text-left">
              Olá, <span className="font-bold">{user?.name || "Usuário"}</span>!
            </h1>
          )}

          {showCommonHeader && (
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-custom-black">{getSectionTitle()}</h2>

              <div className="flex items-center space-x-4">
                {getSearchPlaceholder() && (
                  <div className="w-80">
                    <SearchBar placeholder={getSearchPlaceholder()} onChangeText={setSearchQuery} />
                  </div>
                )}

                <button
                  onClick={handleOpenNotifications}
                  className="p-2 rounded-full hover:bg-gray-200 transition-colors"
                  aria-label="Notificações"
                >
                  <NotificationBell
                    notificationCount={notificationCount}
                    hasUnread={hasUnreadNotifications}
                  />
                </button>

                {showNewButton && (
                  <button
                    onClick={handleNewLead}
                    className="flex items-center space-x-2 bg-custom-black text-white px-4 py-2.5 rounded-lg hover:bg-gray-800 transition-colors"
                  >
                    <svg
                      className="w-4 h-4"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M12 6v6m0 0v6m0-6h6m-6 0H6"
                      />
                    </svg>
                    <span className="text-sm font-bold">Novo Lead</span>
                  </button>
                )}
              </div>
            </div>
          )}

          {renderContent()}
        </div>
      </div>

      {showLeadModal && (
        <FormLead
          onClose={() => setShowLeadModal(false)}
          onSubmit={onLeadSubmit}
        />
      )}

      {showTaskModal && (
        <FormTask
          onClose={() => {
            setShowTaskModal(false);
            setEditingTask(null);
          }}
          onSubmit={(data) => {
            const isEdit = !!editingTask;
            onTaskSubmit(data, isEdit);
          }}
          editingTask={editingTask}
        />
      )}

      {showNotifications && (
        <Notifications notifications={notifications} onClose={() => setShowNotifications(false)} />
      )}
    </div>
  );
};

export default Dashboard;
