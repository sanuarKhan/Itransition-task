import React, { useState } from "react";
import { Card, Form, Button, Alert, Image } from "react-bootstrap";
import { useTranslation } from "react-i18next";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { MessageSquare, Send, Clock } from "lucide-react";
import { toast } from "react-toastify"; // FIXED: Use react-toastify
import { getComments, addComment } from "../../services/api";
import { useAuthStore } from "../../store/index"; // FIXED: Removed useUIStore
import { LoadingSpinner } from "../UI/LoadingSpinner";
import { formatDistanceToNow } from "date-fns";

interface TemplateCommentsProps {
  templateId: string;
}

export const TemplateComments: React.FC<TemplateCommentsProps> = ({
  templateId,
}) => {
  const { t } = useTranslation();
  const { user } = useAuthStore();
  const queryClient = useQueryClient();

  const [newComment, setNewComment] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Fetch comments
  const {
    data: commentsData,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["templateComments", templateId],
    queryFn: () => getComments(templateId),
    refetchInterval: 5000, // Auto-refresh every 5 seconds
  });

  const comments = commentsData?.comments || [];

  const handleSubmitComment = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!user) {
      // FIXED: Use toast instead of addNotification
      toast.error("Please login to comment");
      return;
    }

    if (!newComment.trim()) {
      // FIXED: Use toast instead of addNotification
      toast.error("Comment cannot be empty");
      return;
    }

    setIsSubmitting(true);
    try {
      await addComment(templateId, newComment.trim());
      setNewComment("");

      // Invalidate and refetch comments
      queryClient.invalidateQueries({
        queryKey: ["templateComments", templateId],
      });

      // FIXED: Use toast instead of addNotification
      toast.success("Comment added successfully");
    } catch (error: any) {
      // FIXED: Use toast instead of addNotification
      const errorMessage =
        error.response?.data?.error || "Failed to add comment";
      toast.error(errorMessage);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Card className="mt-5">
      <Card.Header className="d-flex align-items-center">
        <MessageSquare size={20} className="me-2" />
        <h5 className="mb-0">{t("comments.title")}</h5>
        <span className="ms-auto text-muted">
          {comments.length} comment{comments.length !== 1 ? "s" : ""}
        </span>
      </Card.Header>

      <Card.Body>
        {/* Add Comment Form */}
        {user ? (
          <Form onSubmit={handleSubmitComment} className="mb-4">
            <Form.Group className="mb-3">
              <Form.Control
                as="textarea"
                rows={3}
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
                placeholder={t("comments.placeholder")}
                disabled={isSubmitting}
              />
            </Form.Group>
            <div className="d-flex justify-content-end">
              <Button
                type="submit"
                variant="primary"
                disabled={isSubmitting || !newComment.trim()}
              >
                <Send size={16} className="me-2" />
                {isSubmitting ? "Posting..." : t("comments.submit")}
              </Button>
            </div>
          </Form>
        ) : (
          <Alert variant="info" className="mb-4">
            <p className="mb-0">
              Please <strong>login</strong> to leave a comment.
            </p>
          </Alert>
        )}

        {/* Comments List */}
        {isLoading ? (
          <LoadingSpinner center text="Loading comments..." />
        ) : error ? (
          <Alert variant="danger">
            Failed to load comments. Please try again later.
          </Alert>
        ) : comments.length === 0 ? (
          <div className="text-center py-4">
            <MessageSquare size={48} className="text-muted mb-3" />
            <p className="text-muted mb-0">{t("comments.noComments")}</p>
          </div>
        ) : (
          <div className="comments-list">
            {comments.map((comment) => (
              <div
                key={comment.id}
                className="comment-item mb-3 pb-3 border-bottom"
              >
                <div className="d-flex align-items-start">
                  <Image
                    src={comment.user.avatar || "/default-avatar.png"}
                    roundedCircle
                    width={40}
                    height={40}
                    className="me-3"
                  />
                  <div className="flex-grow-1">
                    <div className="d-flex align-items-center mb-1">
                      <strong className="me-2">{comment.user.name}</strong>
                      <small className="text-muted d-flex align-items-center">
                        <Clock size={12} className="me-1" />
                        {formatDistanceToNow(new Date(comment.createdAt), {
                          addSuffix: true,
                        })}
                      </small>
                    </div>
                    <p className="mb-0">{comment.content}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </Card.Body>
    </Card>
  );
};
