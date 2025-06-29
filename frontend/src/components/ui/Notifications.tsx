import React, { useEffect } from "react";
import { Toast, ToastContainer } from "react-bootstrap";
import { CheckCircle, XCircle, AlertTriangle, Info } from "lucide-react";
import { useUIStore } from "../../store/index";

export const Notifications: React.FC = () => {
  const { notifications, removeNotification } = useUIStore();

  const getIcon = (type: string) => {
    switch (type) {
      case "success":
        return <CheckCircle size={16} className="text-success" />;
      case "error":
        return <XCircle size={16} className="text-danger" />;
      case "warning":
        return <AlertTriangle size={16} className="text-warning" />;
      default:
        return <Info size={16} className="text-info" />;
    }
  };

  return (
    <ToastContainer position="top-end" className="p-3" style={{ zIndex: 1060 }}>
      {notifications.map((notification) => (
        <Toast
          key={notification.id}
          onClose={() => removeNotification(notification.id)}
          delay={notification.duration || 5000}
          autohide={notification.duration !== 0}
          className="mb-2"
        >
          <Toast.Header closeButton className="border-0">
            <div className="d-flex align-items-center">
              {getIcon(notification.type)}
              <strong className="ms-2">{notification.title}</strong>
            </div>
          </Toast.Header>
          {notification.message && (
            <Toast.Body>{notification.message}</Toast.Body>
          )}
        </Toast>
      ))}
    </ToastContainer>
  );
};
