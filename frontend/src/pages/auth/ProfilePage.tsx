import React, { useState, useRef } from "react";
import {
  Container,
  Row,
  Col,
  Card,
  Form,
  Button,
  Alert,
  Image,
} from "react-bootstrap";
import { useTranslation } from "react-i18next";
import { Camera, Save } from "lucide-react";
import { useAuthStore } from "../../store/index";
import type { UpdateProfileData } from "../../types/index";
import { UploadAvatar } from "../../services/api";
import { toast } from "react-toastify";

export const ProfilePage: React.FC = () => {
  const { t } = useTranslation();
  const { user, updateProfile, updateAvatar, isLoading, error, clearError } =
    useAuthStore();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [formData, setFormData] = useState<UpdateProfileData>({
    name: user?.name || "",
    language: user?.language || "EN",
    theme: user?.theme || "LIGHT",
  });
  const [uploadingAvatar, setUploadingAvatar] = useState(false);

  if (!user) return null;

  const handleInputChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await updateProfile(formData); // Fixed: Use capital U
      toast.success(t("auth.profile.updateSuccess"));
    } catch (error) {
      toast.error(t("auth.profile.updateError"));
    }
  };

  const handleAvatarChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file type and size
    if (!file.type.startsWith("image/")) {
      toast.error("Please select an image file");
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      // 5MB
      toast.error("File size must be less than 5MB");
      return;
    }

    setUploadingAvatar(true);
    try {
      const uploadResponse = await UploadAvatar(file);
      await updateAvatar(uploadResponse.url); // Fixed: Use capital U
      toast.success("Avatar updated successfully");
    } catch (error) {
      toast.error("Failed to update avatar");
    } finally {
      setUploadingAvatar(false);
    }
  };

  return (
    <Container className="py-4">
      <Row className="justify-content-center">
        <Col md={8} lg={6}>
          <Card className="shadow">
            <Card.Header>
              <h3 className="mb-0">{t("auth.profile.title")}</h3>
            </Card.Header>
            <Card.Body className="p-4">
              {error && (
                <Alert variant="danger" dismissible onClose={clearError}>
                  {error}
                </Alert>
              )}

              {/* Avatar Section */}
              <div className="text-center mb-4">
                <div className="position-relative d-inline-block">
                  <Image
                    src={
                      user.avatar ||
                      `https://ui-avatars.com/api/?name=${encodeURIComponent(
                        user.name
                      )}&background=007bff&color=fff`
                    }
                    alt={user.name}
                    roundedCircle
                    width={120}
                    height={120}
                    className="border border-3 border-light shadow"
                  />
                  <Button
                    variant="primary"
                    size="sm"
                    className="position-absolute bottom-0 end-0 rounded-circle"
                    onClick={() => fileInputRef.current?.click()}
                    disabled={uploadingAvatar}
                    style={{ transform: "translate(25%, 25%)" }}
                  >
                    <Camera size={16} />
                  </Button>
                </div>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handleAvatarChange}
                  className="d-none"
                />
                <p className="text-muted small mt-2">
                  {t("auth.profile.changeAvatar")}
                </p>
              </div>

              <Form onSubmit={handleSubmit}>
                <Card className="mb-3">
                  <Card.Header>
                    <h5 className="mb-0">{t("auth.profile.personalInfo")}</h5>
                  </Card.Header>
                  <Card.Body>
                    <Form.Group className="mb-3">
                      <Form.Label>{t("auth.profile.name")}</Form.Label>
                      <Form.Control
                        type="text"
                        name="name"
                        value={formData.name}
                        onChange={handleInputChange}
                        required
                        disabled={isLoading}
                      />
                    </Form.Group>

                    <Form.Group className="mb-3">
                      <Form.Label>{t("auth.profile.email")}</Form.Label>
                      <Form.Control
                        type="email"
                        value={user.email}
                        disabled
                        className="bg-light"
                      />
                      <Form.Text className="text-muted">
                        Email cannot be changed
                      </Form.Text>
                    </Form.Group>
                  </Card.Body>
                </Card>

                <Card className="mb-3">
                  <Card.Header>
                    <h5 className="mb-0">{t("auth.profile.preferences")}</h5>
                  </Card.Header>
                  <Card.Body>
                    <Row>
                      <Col md={6}>
                        <Form.Group className="mb-3">
                          <Form.Label>{t("auth.profile.language")}</Form.Label>
                          <Form.Select
                            name="language"
                            value={formData.language}
                            onChange={handleInputChange}
                            disabled={isLoading}
                          >
                            <option value="EN">{t("languages.EN")}</option>
                            <option value="RU">{t("languages.RU")}</option>
                            <option value="BN">{t("languages.BN")}</option>
                          </Form.Select>
                        </Form.Group>
                      </Col>
                      <Col md={6}>
                        <Form.Group className="mb-3">
                          <Form.Label>{t("auth.profile.theme")}</Form.Label>
                          <Form.Select
                            name="theme"
                            value={formData.theme}
                            onChange={handleInputChange}
                            disabled={isLoading}
                          >
                            <option value="LIGHT">{t("themes.LIGHT")}</option>
                            <option value="DARK">{t("themes.DARK")}</option>
                          </Form.Select>
                        </Form.Group>
                      </Col>
                    </Row>
                  </Card.Body>
                </Card>

                <div className="d-grid">
                  <Button
                    type="submit"
                    variant="primary"
                    size="lg"
                    disabled={isLoading || uploadingAvatar}
                  >
                    <Save size={16} className="me-2" />
                    {isLoading ? t("common.loading") : t("common.save")}
                  </Button>
                </div>
              </Form>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};
