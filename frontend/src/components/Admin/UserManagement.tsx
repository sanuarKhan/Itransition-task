import React from "react";
// path issue fixing
import {
  Card,
  Table,
  Badge,
  Form,
  InputGroup,
  Row,
  Col,
  Pagination,
  Dropdown,
} from "react-bootstrap";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { toast } from "react-toastify";
import {
  Search,
  UserCheck,
  UserX,
  Shield,
  ShieldOff,
  Trash2,
  MoreVertical,
  Users,
  Calendar,
} from "lucide-react";
import {
  getUsers,
  getAdminStats,
  deleteUser,
  blockUser,
  updateUserRole,
} from "../../services/api";
import { useAuthStore } from "../../store/index";
import { LoadingSpinner } from "../ui/LoadingSpinner";
import { ConfirmModal } from "../ui/ConfirmModal";
import type { User } from "../../types/index";
import { formatDistanceToNow } from "date-fns";

interface SearchForm {
  search: string;
}

export const UserManagement: React.FC = () => {
  const { user: currentUser } = useAuthStore();
  const queryClient = useQueryClient();

  const [currentPage, setCurrentPage] = React.useState(1);
  interface ConfirmAction {
    type: "block" | "unblock" | "makeAdmin" | "removeAdmin" | "delete";
    user: User;
  }

  const [confirmAction, setConfirmAction] =
    React.useState<ConfirmAction | null>(null);
  const [isProcessing, setIsProcessing] = React.useState(false);

  const itemsPerPage = 10;

  // Search form
  const { register, watch } = useForm<SearchForm>({
    defaultValues: { search: "" },
  });

  const searchQuery = watch("search");

  // Fetch users with search
  const { data: usersData, isLoading } = useQuery({
    queryKey: ["adminUsers", currentPage, searchQuery],
    queryFn: () =>
      getUsers({
        page: currentPage,
        limit: itemsPerPage,
        search: searchQuery,
      }),
  });

  // Fetch admin stats
  const { data: statsData } = useQuery({
    queryKey: ["adminStats"],
    queryFn: getAdminStats,
  });

  const users = usersData?.users || [];
  const pagination = usersData?.pagination;
  const stats = statsData;

  const handleUserAction = async () => {
    if (!confirmAction) return;

    setIsProcessing(true);
    try {
      const { type, user } = confirmAction;

      switch (type) {
        case "block":
          await blockUser(user.id, true);
          toast.success(`${user.name} has been blocked`);
          break;
        case "unblock":
          await blockUser(user.id, false);
          toast.success(`${user.name} has been unblocked`);
          break;
        case "makeAdmin":
          await updateUserRole(user.id, "ADMIN");
          toast.success(`${user.name} is now an admin`);
          break;
        case "removeAdmin":
          await updateUserRole(user.id, "USER");
          toast.success(`Admin privileges removed from ${user.name}`);
          break;
        case "delete":
          await deleteUser(user.id);
          toast.success(`${user.name} has been deleted`);
          break;
      }

      // Refresh data
      queryClient.invalidateQueries({ queryKey: ["adminUsers"] });
      queryClient.invalidateQueries({ queryKey: ["adminStats"] });
      //eslint-disable-next-line
    } catch (error: any) {
      toast.error(
        error.response?.data?.error || `Failed to ${confirmAction.type} user`
      );
    } finally {
      setIsProcessing(false);
      setConfirmAction(null);
    }
  };

  const getConfirmationMessage = () => {
    if (!confirmAction) return "";

    const { type, user } = confirmAction;
    const messages = {
      block: `Are you sure you want to block ${user.name}?`,
      unblock: `Are you sure you want to unblock ${user.name}?`,
      makeAdmin: `Are you sure you want to make ${user.name} an admin?`,
      removeAdmin: `Are you sure you want to remove admin privileges from ${user.name}?`,
      delete: `Are you sure you want to delete ${user.name}? This action cannot be undone.`,
    };

    return messages[type] || "";
  };

  const canPerformAction = (user: User, action: string) => {
    if (user.id === currentUser?.id && ["block", "delete"].includes(action)) {
      return false;
    }
    return true;
  };

  if (isLoading) {
    return <LoadingSpinner center text="Loading users..." />;
  }

  return (
    <div>
      {/* Stats Cards */}
      {stats && (
        <Row className="mb-4">
          <Col md={3}>
            <Card className="text-center border-primary">
              <Card.Body>
                <Users size={32} className="text-primary mb-2" />
                <h4 className="mb-1">{stats.totalUsers}</h4>
                <small className="text-muted">Total Users</small>
              </Card.Body>
            </Card>
          </Col>
          <Col md={3}>
            <Card className="text-center border-success">
              <Card.Body>
                <UserCheck size={32} className="text-success mb-2" />
                <h4 className="mb-1">{stats.activeUsers}</h4>
                <small className="text-muted">Active Users</small>
              </Card.Body>
            </Card>
          </Col>
          <Col md={3}>
            <Card className="text-center border-warning">
              <Card.Body>
                <UserX size={32} className="text-warning mb-2" />
                <h4 className="mb-1">{stats.blockedUsers}</h4>
                <small className="text-muted">Blocked Users</small>
              </Card.Body>
            </Card>
          </Col>
          <Col md={3}>
            <Card className="text-center border-info">
              <Card.Body>
                <Shield size={32} className="text-info mb-2" />
                <h4 className="mb-1">{stats.adminUsers}</h4>
                <small className="text-muted">Admins</small>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      )}

      {/* Search */}
      <Card className="mb-4">
        <Card.Body>
          <Row>
            <Col md={8}>
              <InputGroup>
                <InputGroup.Text>
                  <Search size={16} />
                </InputGroup.Text>
                <Form.Control
                  {...register("search")}
                  type="text"
                  placeholder="Search users by name or email..."
                />
              </InputGroup>
            </Col>
          </Row>
        </Card.Body>
      </Card>

      {/* Users Table */}
      <Card>
        <Card.Body className="p-0">
          <div className="table-responsive">
            <Table className="mb-0">
              <thead className="bg-light">
                <tr>
                  <th className="border-0">User</th>
                  <th className="border-0">Role</th>
                  <th className="border-0">Status</th>
                  <th className="border-0">Activity</th>
                  <th className="border-0">Joined</th>
                  <th className="border-0 text-center">Actions</th>
                </tr>
              </thead>
              <tbody>
                {users.map((user) => (
                  <tr key={user.id}>
                    <td>
                      <div className="d-flex align-items-center">
                        <img
                          src={
                            user.avatar ||
                            `https://ui-avatars.com/api/?name=${encodeURIComponent(
                              user.name
                            )}&background=007bff&color=fff`
                          }
                          alt={user.name}
                          className="rounded-circle me-3"
                          width={40}
                          height={40}
                        />
                        <div>
                          <div className="fw-medium">{user.name}</div>
                          <small className="text-muted">{user.email}</small>
                        </div>
                      </div>
                    </td>
                    <td>
                      <Badge
                        bg={user.role === "ADMIN" ? "primary" : "secondary"}
                      >
                        {user.role === "ADMIN" ? (
                          <Shield size={14} className="me-1" />
                        ) : (
                          <Users size={14} className="me-1" />
                        )}
                        {user.role}
                      </Badge>
                    </td>
                    <td>
                      <Badge bg={user.isBlocked ? "danger" : "success"}>
                        {user.isBlocked ? "Blocked" : "Active"}
                      </Badge>
                    </td>
                    <td>
                      <div>
                        <small className="d-block">
                          Templates: {user._count?.templates || 0}
                        </small>
                        <small className="d-block">
                          Forms: {user._count?.forms || 0}
                        </small>
                      </div>
                    </td>
                    <td>
                      <div className="d-flex align-items-center">
                        <Calendar size={14} className="me-2 text-muted" />
                        <small>
                          {formatDistanceToNow(new Date(user.createdAt), {
                            addSuffix: true,
                          })}
                        </small>
                      </div>
                    </td>
                    <td className="text-center">
                      <Dropdown>
                        <Dropdown.Toggle
                          variant="outline-secondary"
                          size="sm"
                          className="border-0"
                        >
                          <MoreVertical size={16} />
                        </Dropdown.Toggle>

                        <Dropdown.Menu>
                          {user.isBlocked ? (
                            <Dropdown.Item
                              onClick={() =>
                                setConfirmAction({ type: "unblock", user })
                              }
                              disabled={!canPerformAction(user, "unblock")}
                            >
                              <UserCheck size={14} className="me-2" />
                              Unblock
                            </Dropdown.Item>
                          ) : (
                            <Dropdown.Item
                              onClick={() =>
                                setConfirmAction({ type: "block", user })
                              }
                              disabled={!canPerformAction(user, "block")}
                            >
                              <UserX size={14} className="me-2" />
                              Block
                            </Dropdown.Item>
                          )}

                          <Dropdown.Divider />

                          {user.role === "ADMIN" ? (
                            <Dropdown.Item
                              onClick={() =>
                                setConfirmAction({ type: "removeAdmin", user })
                              }
                            >
                              <ShieldOff size={14} className="me-2" />
                              Remove Admin
                            </Dropdown.Item>
                          ) : (
                            <Dropdown.Item
                              onClick={() =>
                                setConfirmAction({ type: "makeAdmin", user })
                              }
                            >
                              <Shield size={14} className="me-2" />
                              Make Admin
                            </Dropdown.Item>
                          )}

                          <Dropdown.Divider />

                          <Dropdown.Item
                            onClick={() =>
                              setConfirmAction({ type: "delete", user })
                            }
                            disabled={!canPerformAction(user, "delete")}
                            className="text-danger"
                          >
                            <Trash2 size={14} className="me-2" />
                            Delete
                          </Dropdown.Item>
                        </Dropdown.Menu>
                      </Dropdown>
                    </td>
                  </tr>
                ))}
              </tbody>
            </Table>
          </div>
        </Card.Body>
      </Card>

      {/* Pagination */}
      {pagination && pagination.pages > 1 && (
        <div className="d-flex justify-content-center mt-4">
          <Pagination>
            <Pagination.Prev
              disabled={currentPage === 1}
              onClick={() => setCurrentPage(currentPage - 1)}
            />
            {Array.from({ length: pagination.pages }, (_, i) => i + 1)
              .slice(Math.max(0, currentPage - 3), currentPage + 2)
              .map((page) => (
                <Pagination.Item
                  key={page}
                  active={page === currentPage}
                  onClick={() => setCurrentPage(page)}
                >
                  {page}
                </Pagination.Item>
              ))}
            <Pagination.Next
              disabled={currentPage === pagination.pages}
              onClick={() => setCurrentPage(currentPage + 1)}
            />
          </Pagination>
        </div>
      )}

      {/* Confirmation Modal */}
      <ConfirmModal
        show={!!confirmAction}
        title={`${confirmAction?.type} User`}
        message={getConfirmationMessage()}
        confirmText={confirmAction?.type || "Confirm"}
        confirmVariant={confirmAction?.type === "delete" ? "danger" : "primary"}
        onConfirm={handleUserAction}
        onCancel={() => setConfirmAction(null)}
        loading={isProcessing}
      />
    </div>
  );
};
