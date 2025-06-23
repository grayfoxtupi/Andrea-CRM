import React from 'react';

interface TaskNotification {
  id: string;
  type: 'added' | 'edited' | 'cancelled';
  description: string;
  timestamp: string;
}

interface NotificationsProps {
  notifications: TaskNotification[];
  onClose: () => void;
}

const Notifications: React.FC<NotificationsProps> = ({ notifications, onClose }) => {
  const getNotificationIcon = (type: TaskNotification['type']) => {
    switch (type) {
      case 'added':
        return (
          <svg className="w-5 h-5 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v3m0 0v3m0-3h3m-3 0H9m12 0a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        );
      case 'edited':
        return (
          <svg className="w-5 h-5 text-yellow-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
          </svg>
        );
      case 'cancelled':
        return (
          <svg className="w-5 h-5 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        );
      default:
        return null;
    }
  };

  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex justify-end z-50">
      <div className="bg-white w-96 h-full shadow-lg p-6 relative">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-500 hover:text-gray-700"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
        <h2 className="text-xl font-bold text-custom-black mb-6 text-center">Notificações</h2>
        <div className="space-y-4">
          {notifications.length === 0 ? (
            <p className="text-gray-500 text-center">Nenhuma notificação por enquanto.</p>
          ) : (
            notifications.map((notification) => (
              <div key={notification.id} className="flex items-start p-3 bg-gray-50 rounded-lg shadow-sm">
                <div className="flex-shrink-0 mr-3">
                  {getNotificationIcon(notification.type)}
                </div>
                <div>
                  <p className="text-sm text-custom-black leading-snug">
                    {notification.description}
                  </p>
                  <span className="text-xs text-gray-500 mt-1 block">
                    {notification.timestamp}
                  </span>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default Notifications;
