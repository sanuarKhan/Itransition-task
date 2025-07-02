import React from "react";
import { Card, Alert, Table, Badge } from "react-bootstrap";
import { Activity, Clock, AlertCircle } from "lucide-react";

export const SystemActivity: React.FC = () => {
  const mockActivities = [
    {
      id: 1,
      type: "user_registered",
      message: "New user registered: john.doe@example.com",
      timestamp: new Date().toISOString(),
      level: "info",
    },
    {
      id: 2,
      type: "template_created",
      message: 'Template "Customer Survey" created by Alice Johnson',
      timestamp: new Date(Date.now() - 1000 * 60 * 15).toISOString(),
      level: "info",
    },
    {
      id: 3,
      type: "user_blocked",
      message: "User blocked: spam.user@example.com",
      timestamp: new Date(Date.now() - 1000 * 60 * 30).toISOString(),
      level: "warning",
    },
    {
      id: 4,
      type: "form_submitted",
      message: "50+ forms submitted in the last hour",
      timestamp: new Date(Date.now() - 1000 * 60 * 60).toISOString(),
      level: "success",
    },
  ];

  const getLevelVariant = (level: string) => {
    switch (level) {
      case "success":
        return "success";
      case "warning":
        return "warning";
      case "error":
        return "danger";
      default:
        return "info";
    }
  };

  const getLevelIcon = (level: string) => {
    switch (level) {
      case "warning":
      case "error":
        return <AlertCircle size={16} />;
      default:
        return <Activity size={16} />;
    }
  };

  return (
    <div>
      <Alert variant="info" className="mb-4">
        <Activity size={20} className="me-2" />
        <strong>System Activity Monitor</strong>
        <br />
        Real-time system events and user activities. This is a demo
        implementation.
      </Alert>

      <Card>
        <Card.Header className="d-flex align-items-center">
          <Clock size={20} className="me-2" />
          <h5 className="mb-0">Recent Activity</h5>
        </Card.Header>
        <Card.Body className="p-0">
          <div className="table-responsive">
            <Table className="mb-0">
              <thead className="bg-light">
                <tr>
                  <th className="border-0">Event</th>
                  <th className="border-0">Type</th>
                  <th className="border-0">Time</th>
                  <th className="border-0">Level</th>
                </tr>
              </thead>
              <tbody>
                {mockActivities.map((activity) => (
                  <tr key={activity.id}>
                    <td>
                      <div className="d-flex align-items-center">
                        {getLevelIcon(activity.level)}
                        <span className="ms-2">{activity.message}</span>
                      </div>
                    </td>
                    <td>
                      <code className="small">{activity.type}</code>
                    </td>
                    <td>
                      <small className="text-muted">
                        {new Date(activity.timestamp).toLocaleString()}
                      </small>
                    </td>
                    <td>
                      <Badge bg={getLevelVariant(activity.level)}>
                        {activity.level}
                      </Badge>
                    </td>
                  </tr>
                ))}
              </tbody>
            </Table>
          </div>
        </Card.Body>
      </Card>

      <Card className="mt-4">
        <Card.Header>
          <h5 className="mb-0">System Metrics</h5>
        </Card.Header>
        <Card.Body>
          <div className="row text-center">
            <div className="col-md-3">
              <div className="border-end">
                <div className="h4 text-primary">99.8%</div>
                <small className="text-muted">Uptime</small>
              </div>
            </div>
            <div className="col-md-3">
              <div className="border-end">
                <div className="h4 text-success">142ms</div>
                <small className="text-muted">Avg Response</small>
              </div>
            </div>
            <div className="col-md-3">
              <div className="border-end">
                <div className="h4 text-info">1,247</div>
                <small className="text-muted">API Calls/hr</small>
              </div>
            </div>
            <div className="col-md-3">
              <div className="h4 text-warning">0</div>
              <small className="text-muted">Errors</small>
            </div>
          </div>
        </Card.Body>
      </Card>
    </div>
  );
};
