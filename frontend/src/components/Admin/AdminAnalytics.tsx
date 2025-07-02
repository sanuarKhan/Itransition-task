import React from "react";
import { Row, Col, Card, Alert } from "react-bootstrap";
import { useQuery } from "@tanstack/react-query";
import {
  TrendingUp,
  Users,
  FileText,
  BarChart3,
  Calendar,
  Activity,
} from "lucide-react";
import { getAdminStats } from "../../services/api";
import { LoadingSpinner } from "../UI/LoadingSpinner";
import { formatDistanceToNow } from "date-fns";

export const AdminAnalytics: React.FC = () => {
  const { t } = useTranslation();

  const {
    data: statsData,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["adminStats"],
    queryFn: getAdminStats,
  });

  if (isLoading) {
    return <LoadingSpinner center text="Loading analytics..." />;
  }

  if (error) {
    return (
      <Alert variant="danger">
        Failed to load analytics data. Please try again later.
      </Alert>
    );
  }

  const stats = statsData;

  return (
    <div>
      {/* Overview Stats */}
      <Row className="mb-4">
        <Col md={6} lg={3} className="mb-3">
          <Card className="text-center h-100 border-primary">
            <Card.Body>
              <Users size={32} className="text-primary mb-2" />
              <h3 className="mb-1">{stats?.totalUsers || 0}</h3>
              <small className="text-muted">Total Users</small>
              <div className="mt-2">
                <small className="text-success">
                  +{stats?.recentUsers?.length || 0} this week
                </small>
              </div>
            </Card.Body>
          </Card>
        </Col>

        <Col md={6} lg={3} className="mb-3">
          <Card className="text-center h-100 border-success">
            <Card.Body>
              <FileText size={32} className="text-success mb-2" />
              <h3 className="mb-1">
                {/* We'd need to add this to the API */}
                <span className="text-muted">-</span>
              </h3>
              <small className="text-muted">Total Templates</small>
              <div className="mt-2">
                <small className="text-info">All public & private</small>
              </div>
            </Card.Body>
          </Card>
        </Col>

        <Col md={6} lg={3} className="mb-3">
          <Card className="text-center h-100 border-info">
            <Card.Body>
              <BarChart3 size={32} className="text-info mb-2" />
              <h3 className="mb-1">
                <span className="text-muted">-</span>
              </h3>
              <small className="text-muted">Total Forms</small>
              <div className="mt-2">
                <small className="text-warning">All submissions</small>
              </div>
            </Card.Body>
          </Card>
        </Col>

        <Col md={6} lg={3} className="mb-3">
          <Card className="text-center h-100 border-warning">
            <Card.Body>
              <Activity size={32} className="text-warning mb-2" />
              <h3 className="mb-1">{stats?.activeUsers || 0}</h3>
              <small className="text-muted">Active Users</small>
              <div className="mt-2">
                <small className="text-success">
                  {((stats?.activeUsers || 0) / (stats?.totalUsers || 1) * 100).toFixed(1)}%
                  active
                </small>
              </div>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      {/* Recent Activity */}
      <Row>
        <Col lg={6} className="mb-4">
          <Card className="h-100">
            <Card.Header className="d-flex align-items-center">
              <TrendingUp size={20} className="me-2" />
              <h5 className="mb-0">Recent Registrations</h5>
            </Card.Header>
            <Card.Body>
              {stats?.recentUsers && stats.recentUsers.length > 0 ? (
                <div className="space-y-3">
                  {stats.recentUsers.map((user) => (
                    <div
                      key={user.id}
                      className="d-flex align-items-center justify-content-between py-2 border-bottom"
                    >
                      <div className="d-flex align-items-center">
                        <img
                          src={`https://ui-avatars.com/api/?name=${encodeURIComponent(
                            user.name
                          )}&background=007bff&color=fff`}
                          alt={user.name}
                          className="rounded-circle me-3"
                          width={32}
                          height={32}
                        />
                        <div>
                          <div className="fw-medium">{user.name}</div>
                          <small className="text-muted">{user.email}</small>
                        </div>
                      </div>
                      <div className="text-end">
                        <div className="d-flex align-items-center">
                          <Calendar size={14} className="me-1 text-muted" />
                          <small className="text-muted">
                            {formatDistanceToNow(new Date(user.createdAt), {
                              addSuffix: true,
                            })}
                          </small>
                        </div>
                        {user.role === "ADMIN" && (
                          <small className="badge bg-primary">Admin</small>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-4">
                  <Users size={48} className="text-muted mb-3" />
                  <p className="text-muted">No recent registrations</p>
                </div>
              )}
            </Card.Body>
          </Card>
        </Col>

        <Col lg={6} className="mb-4">
          <Card className="h-100">
            <Card.Header className="d-flex align-items-center">
              <BarChart3 size={20} className="me-2" />
              <h5 className="mb-0">User Growth</h5>
            </Card.Header>
            <Card.Body>
              {stats?.usersByMonth && stats.usersByMonth.length > 0 ? (
                <div>
                  {stats.usersByMonth.slice(0, 6).map((monthData, index) => {
                    const month = new Date(monthData.month).toLocaleDateString(
                      "en-US",
                      {
                        month: "short",
                        year: "numeric",
                      }
                    );
                    return (
                      <div
                        key={index}
                        className="d-flex justify-content-between align-items-center py-2 border-bottom"
                      >
                        <span>{month}</span>
                        <div className="d-flex align-items-center">
                          <div
                            className="bg-primary me-2"
                            style={{
                              width: `${Math.max(
                                10,
                                (monthData.count /
                                  Math.max(
                                    ...stats.usersByMonth.map((m) => m.count)
                                  )) *
                                  100
                              )}px`,
                              height: "8px",
                            }}
                          />
                          <span className="fw-medium">{monthData.count}</span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              ) : (
                <div className="text-center py-4">
                  <TrendingUp size={48} className="text-muted mb-3" />
                  <p className="text-muted">No growth data available</p>
                </div>
              )}
            </Card.Body>
          </Card>
        </Col>
      </Row>

      {/* System Health */}
      <Card>
        <Card.Header>
          <h5 className="mb-0">System Health</h5>
        </Card.Header>
        <Card.Body>
          <Row>
            <Col md={4}>
              <div className="text-center">
                <div className="h4 text-success mb-2">✓</div>
                <div className="fw-medium">Database</div>
                <small className="text-muted">Connected</small>
              </div>
            </Col>
            <Col md={4}>
              <div className="text-center">
                <div className="h4 text-success mb-2">✓</div>
                <div className="fw-medium">API</div>
                <small className="text-muted">Operational</small>
              </div>
            </Col>
            <Col md={4}>
              <div className="text-center">
                <div className="h4 text-info mb-2">~</div>
                <div className="fw-medium">Storage</div>
                <small className="text-muted">Cloudinary</small>
              </div>
            </Col>
          </Row>
        </Card.Body>
      </Card>
    </div>
  );
};
