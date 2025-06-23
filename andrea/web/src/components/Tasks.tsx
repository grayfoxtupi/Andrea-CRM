import React, { useState, useMemo, useEffect } from "react";
import { getTasks } from "../services/taskService";
import { createTask } from "../services/taskService";
import { useAuth } from "../hooks/useAuth";

interface Task {
  id: number;
  leadId: number;
  proposta: string;
  status: "Em progresso" | "Cancelado" | "Concluído";
  statusColor: string;
  borderColor: string;
  empresa: string;
  representante: string;
  meioEncontro: string;
  ambiente: string;
  localizacao: string;
  data: string;
  avatar: string;
}

interface TasksProps {
  onEditTask: (task: Task) => void;
  onCancelTask: (taskId: number) => void;
  searchQuery: string;
  newTaskFromLead?: Task | null;
  onTasksDataChange: (tasks: Task[]) => void;
}

const Tasks: React.FC<TasksProps> = ({
  onEditTask,
  searchQuery,
  newTaskFromLead,
  onTasksDataChange,
}) => {
  const { user } = useAuth(); // <-- Adicione esta linha
  const DEFAULT_AVATAR =
    "https://img.freepik.com/vetores-premium/avatar-de-perfil-padrao-de-silhueta-preta_664995-355.jpg"; // <-- Adicione esta linha
  const [expandedItems, setExpandedItems] = useState<number[]>([]);
  const [showActionMenu, setShowActionMenu] = useState<number | null>(null);
  const [tasksData, setTasksData] = useState<Task[]>([]);

  // Carrega do backend
  useEffect(() => {
    const fetch = async () => {
      const tasks = await getTasks();
      setTasksData(tasks);
      onTasksDataChange(tasks);
    };
    fetch();
  }, []);

  // Notifica mudanças
  useEffect(() => {
    onTasksDataChange(tasksData);
  }, [tasksData]);

  // Inclui tarefas criadas por lead
  useEffect(() => {
    if (
      newTaskFromLead &&
      !tasksData.some((t) => t.id === newTaskFromLead.id)
    ) {
      setTasksData((prev) => [...prev, newTaskFromLead]);
    }
  }, [newTaskFromLead]);

  const toggleExpanded = (id: number) => {
    setExpandedItems((prev) =>
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]
    );
  };

  const updateStatus = (taskId: number, newStatus: Task["status"]) => {
    setTasksData((prev) =>
      prev.map((t) => {
        if (t.id !== taskId) return t;
        let sc = "",
          bc = "";
        if (newStatus === "Cancelado")
          (sc = "bg-red-100 text-red-800"), (bc = "border-l-red-500");
        else if (newStatus === "Concluído")
          (sc = "bg-green-100 text-green-800"), (bc = "border-l-green-500");
        else (sc = "bg-blue-100 text-blue-800"), (bc = "border-l-blue-500");

        return { ...t, status: newStatus, statusColor: sc, borderColor: bc };
      })
    );
  };

  const filtered = useMemo(() => {
    const base = tasksData.filter((t) => t.status !== "Cancelado");
    if (!searchQuery) return base;
    const q = searchQuery.toLowerCase();
    return base.filter(
      (t) =>
        t.proposta.toLowerCase().includes(q) ||
        t.empresa.toLowerCase().includes(q)
    );
  }, [searchQuery, tasksData]);

  const handleAction = (action: string, t: Task) => {
    setShowActionMenu(null);
    if (action === "edit") onEditTask(t);
    else if (action === "cancel") updateStatus(t.id, "Cancelado");
    else if (action === "complete") updateStatus(t.id, "Concluído");
  };

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 font-nunito">
      {/* Cabeçalho */}
      <div className="grid grid-cols-[30px_2fr_1.5fr_1fr] gap-4 px-4 py-4 bg-gray-50 border-b border-gray-200 text-sm font-bold text-custom-gray">
        <div></div>
        <div>Proposta</div>
        <div>Status</div>
        <div>Editar</div>
      </div>

      {filtered.length === 0 ? (
        <div className="px-4 py-6 text-center text-gray-500">
          Nenhuma tarefa encontrada.
        </div>
      ) : (
        filtered.map((task) => (
          <div
            key={task.id}
            className={`border-b border-gray-100 ${
              expandedItems.includes(task.id)
                ? `border-l-4 ${task.borderColor}`
                : ""
            }`}
          >
            <div className="grid grid-cols-[30px_2fr_1.5fr_1fr] gap-4 px-4 py-4 items-center hover:bg-gray-50">
              <button
                onClick={() => toggleExpanded(task.id)}
                className="p-1 rounded hover:bg-gray-100"
              >
                <svg
                  className={`w-4 h-4 text-custom-gray transition-transform ${
                    expandedItems.includes(task.id) ? "rotate-180" : ""
                  }`}
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M19 9l-7 7-7-7"
                  />
                </svg>
              </button>
              <div className="text-sm font-bold text-custom-black truncate">
                {task.proposta}
              </div>
              <span
                className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold ${task.statusColor}`}
              >
                {task.status}
              </span>
              <div className="flex items-center space-x-2">
                <button
                  onClick={() => onEditTask(task)}
                  className="flex items-center space-x-2 text-custom-gray hover:text-custom-black text-sm"
                >
                  <svg className="w-4 h-4" viewBox="0 0 24 24">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                    />
                  </svg>
                  <span>Editar</span>
                </button>
                <div className="relative">
                  <button
                    className="p-1 hover:bg-gray-100 rounded"
                    onClick={() =>
                      setShowActionMenu(
                        task.id === showActionMenu ? null : task.id
                      )
                    }
                  >
                    <svg className="w-4 h-4 text-custom-gray">
                      <path d="M10 6a2 2 0 110-4 2 2 0 010 4zM10 12a2 2 0 110-4 2 2 0 010 4zM10 18a2 2 0 110-4 2 2 0 010 4z" />
                    </svg>
                  </button>
                  {showActionMenu === task.id && (
                    <div className="absolute right-0 mt-2 w-32 bg-white rounded-lg shadow-lg border border-gray-200 z-10">
                      {task.status !== "Cancelado" && (
                        <button
                          onClick={() => handleAction("cancel", task)}
                          className="w-full px-3 py-2 text-sm text-red-600 hover:bg-red-50 text-left"
                        >
                          Cancelar
                        </button>
                      )}
                      {task.status !== "Concluído" && (
                        <button
                          onClick={() => handleAction("complete", task)}
                          className="w-full px-3 py-2 text-sm text-green-600 hover:bg-green-50 text-left"
                        >
                          Concluir
                        </button>
                      )}
                    </div>
                  )}
                </div>
              </div>
            </div>

            {expandedItems.includes(task.id) && (
              <div className="px-6 py-6 bg-gray-50 border-t border-gray-200">
                <div className="flex items-start space-x-6">
                  <div className="w-12 h-12 rounded-full overflow-hidden">
                    <img
                      src={task.avatar || user?.avatar || DEFAULT_AVATAR}
                      alt={task.representante}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="flex-1">
                    <h4 className="text-base font-bold text-custom-black mb-3">
                      {task.proposta}
                    </h4>
                    <div className="grid grid-cols-2 gap-x-10 text-sm">
                      <div>
                        <strong className="text-custom-gray">Empresa:</strong>{" "}
                        {task.empresa}
                      </div>
                      <div>
                        <strong className="text-custom-gray">
                          Representante:
                        </strong>{" "}
                        {task.representante}
                      </div>
                      <div>
                        <strong className="text-custom-gray">Meio:</strong>{" "}
                        {task.meioEncontro || "-"}
                      </div>
                      <div>
                        <strong className="text-custom-gray">Ambiente:</strong>{" "}
                        {task.ambiente}
                      </div>
                      <div>
                        <strong className="text-custom-gray">
                          Localização:
                        </strong>{" "}
                        {task.localizacao}
                      </div>
                    </div>
                    <div className="mt-4 text-sm">
                      <strong className="text-custom-gray">Data:</strong>{" "}
                      {task.data}
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        ))
      )}
    </div>
  );
};

export default Tasks;
