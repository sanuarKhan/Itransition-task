// import React from "react";
// import { Container, Row, Col, Button } from "react-bootstrap";
// import { useNavigate } from "react-router-dom";
// import { useTranslation } from "react-i18next";
// import { ArrowRight, Play } from "lucide-react";
// import { useAuthStore } from "../../store/index";
// path issue fixing
// export const HeroSection: React.FC = () => {
//   const navigate = useNavigate();
//   const { t } = useTranslation();
//   const { user } = useAuthStore();

//   return (
//     <section
//       className="bg-gradient py-5"
//       style={{
//         background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
//       }}
//     >
//       <Container>
//         <Row className="align-items-center min-vh-50">
//           <Col lg={6} className="text-white">
//             <h1 className="display-4 fw-bold mb-4">{t("home.hero.title")}</h1>
//             <p className="lead mb-4">{t("home.hero.subtitle")}</p>
//             <div className="d-flex gap-3">
//               <Button
//                 onClick={() => navigate(user ? "/dashboard" : "/register")}
//                 variant="light"
//                 size="lg"
//                 className="px-4"
//               >
//                 {t("home.hero.getStarted")}{" "}
//                 <ArrowRight size={20} className="ms-2" />
//               </Button>
//               <Button
//                 onClick={() => navigate("/templates")}
//                 variant="outline-light"
//                 size="lg"
//                 className="px-4"
//               >
//                 <Play size={20} className="me-2" />
//                 {t("home.hero.learnMore")}
//               </Button>
//             </div>
//           </Col>
//           <Col lg={6} className="text-center">
//             <div className="position-relative">
//               <div
//                 className="bg-white rounded-3 shadow-lg p-4 mx-auto"
//                 style={{ maxWidth: "400px" }}
//               >
//                 <div className="bg-light rounded-2 p-3 mb-3">
//                   <div
//                     className="bg-primary rounded-1 mb-2"
//                     style={{ height: "8px", width: "60%" }}
//                   ></div>
//                   <div
//                     className="bg-secondary rounded-1 mb-2"
//                     style={{ height: "6px", width: "80%" }}
//                   ></div>
//                   <div
//                     className="bg-secondary rounded-1"
//                     style={{ height: "6px", width: "40%" }}
//                   ></div>
//                 </div>
//                 <div className="d-flex gap-2 mb-3">
//                   <div
//                     className="bg-light rounded-1 flex-grow-1"
//                     style={{ height: "32px" }}
//                   ></div>
//                   <div
//                     className="bg-light rounded-1 flex-grow-1"
//                     style={{ height: "32px" }}
//                   ></div>
//                 </div>
//                 <div className="bg-primary text-white rounded-2 py-2 text-center">
//                   <small className="fw-bold">Create Beautiful Forms</small>
//                 </div>
//               </div>
//             </div>
//           </Col>
//         </Row>
//       </Container>
//     </section>
//   );
// };
import React, { useState } from "react";
import {
  Heart,
  TrendingUp,
  Users,
  BarChart3,
  Eye,
  MessageSquare,
  Calendar,
  CheckCircle,
  ArrowRight,
  Sparkles,
  Zap,
  Shield,
  Globe,
  Menu,
  X,
  Search,
  Moon,
  Sun,
  User,
  Settings,
  LogOut,
  Plus,
  Edit,
  Trash2,
  Share2,
} from "lucide-react";

// Modern Color Palette
const colors = {
  primary: "#6366f1",
  secondary: "#8b5cf6",
  accent: "#ec4899",
  success: "#10b981",
  warning: "#f59e0b",
  dark: "#1e293b",
  light: "#f8fafc",
  gradient: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
};

// Modern Hero Section Component
export const ModernHero = () => {
  return (
    <div
      className="hero-section"
      style={{
        background: colors.gradient,
        minHeight: "600px",
        display: "flex",
        alignItems: "center",
        position: "relative",
        overflow: "hidden",
      }}
    >
      {/* Animated Background Elements */}
      <div
        style={{
          position: "absolute",
          width: "100%",
          height: "100%",
          opacity: 0.1,
        }}
      >
        <div
          className="floating-circle"
          style={{
            position: "absolute",
            width: "300px",
            height: "300px",
            borderRadius: "50%",
            background: "white",
            top: "10%",
            left: "10%",
            animation: "float 6s ease-in-out infinite",
          }}
        />
        <div
          className="floating-circle"
          style={{
            position: "absolute",
            width: "200px",
            height: "200px",
            borderRadius: "50%",
            background: "white",
            bottom: "20%",
            right: "15%",
            animation: "float 8s ease-in-out infinite",
            animationDelay: "2s",
          }}
        />
      </div>

      <div
        style={{
          maxWidth: "1200px",
          margin: "0 auto",
          padding: "0 2rem",
          position: "relative",
          zIndex: 1,
          display: "grid",
          gridTemplateColumns: "1fr 1fr",
          gap: "4rem",
          alignItems: "center",
        }}
      >
        {/* Left Content */}
        <div style={{ color: "white" }}>
          <div
            style={{
              display: "inline-block",
              background: "rgba(255,255,255,0.2)",
              backdropFilter: "blur(10px)",
              padding: "0.5rem 1rem",
              borderRadius: "50px",
              marginBottom: "1.5rem",
              fontSize: "0.875rem",
              fontWeight: "500",
            }}
          >
            <Sparkles
              size={16}
              style={{ marginRight: "0.5rem", display: "inline" }}
            />
            Modern Form Builder
          </div>

          <h1
            style={{
              fontSize: "3.5rem",
              fontWeight: "800",
              marginBottom: "1.5rem",
              lineHeight: "1.1",
              textShadow: "0 2px 20px rgba(0,0,0,0.1)",
            }}
          >
            Create Beautiful Forms with Ease
          </h1>

          <p
            style={{
              fontSize: "1.25rem",
              marginBottom: "2rem",
              opacity: 0.95,
              lineHeight: "1.6",
            }}
          >
            Build custom surveys, questionnaires, and forms. Analyze responses
            and gain insights from your audience with our powerful analytics.
          </p>

          <div style={{ display: "flex", gap: "1rem" }}>
            <button
              style={{
                background: "white",
                color: colors.primary,
                border: "none",
                padding: "1rem 2rem",
                borderRadius: "12px",
                fontSize: "1.125rem",
                fontWeight: "600",
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                gap: "0.5rem",
                boxShadow: "0 10px 30px rgba(0,0,0,0.2)",
                transition: "all 0.3s ease",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = "translateY(-2px)";
                e.currentTarget.style.boxShadow = "0 15px 40px rgba(0,0,0,0.3)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = "translateY(0)";
                e.currentTarget.style.boxShadow = "0 10px 30px rgba(0,0,0,0.2)";
              }}
            >
              Get Started <ArrowRight size={20} />
            </button>

            <button
              style={{
                background: "rgba(255,255,255,0.2)",
                backdropFilter: "blur(10px)",
                color: "white",
                border: "2px solid rgba(255,255,255,0.3)",
                padding: "1rem 2rem",
                borderRadius: "12px",
                fontSize: "1.125rem",
                fontWeight: "600",
                cursor: "pointer",
                transition: "all 0.3s ease",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = "rgba(255,255,255,0.3)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = "rgba(255,255,255,0.2)";
              }}
            >
              Learn More
            </button>
          </div>
        </div>

        {/* Right Content - Modern Card Preview */}
        <div style={{ position: "relative" }}>
          <div
            style={{
              background: "white",
              borderRadius: "24px",
              padding: "2rem",
              boxShadow: "0 20px 60px rgba(0,0,0,0.3)",
              transform: "perspective(1000px) rotateY(-5deg)",
              transition: "all 0.3s ease",
            }}
          >
            {/* Form Preview */}
            <div
              style={{
                background: "linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)",
                borderRadius: "12px",
                padding: "1.5rem",
                marginBottom: "1.5rem",
              }}
            >
              <div
                style={{
                  background: colors.primary,
                  height: "8px",
                  width: "60%",
                  borderRadius: "4px",
                  marginBottom: "1rem",
                }}
              />
              <div
                style={{
                  background: "rgba(99, 102, 241, 0.3)",
                  height: "6px",
                  width: "80%",
                  borderRadius: "3px",
                  marginBottom: "0.75rem",
                }}
              />
              <div
                style={{
                  background: "rgba(99, 102, 241, 0.3)",
                  height: "6px",
                  width: "40%",
                  borderRadius: "3px",
                }}
              />
            </div>

            <div
              style={{ display: "flex", gap: "1rem", marginBottom: "1.5rem" }}
            >
              <div
                style={{
                  flex: 1,
                  background: "#f1f5f9",
                  borderRadius: "8px",
                  height: "40px",
                }}
              />
              <div
                style={{
                  flex: 1,
                  background: "#f1f5f9",
                  borderRadius: "8px",
                  height: "40px",
                }}
              />
            </div>

            <div
              style={{
                background: colors.primary,
                color: "white",
                padding: "0.75rem",
                borderRadius: "8px",
                textAlign: "center",
                fontWeight: "600",
                fontSize: "0.875rem",
              }}
            >
              Create Beautiful Forms
            </div>
          </div>
        </div>
      </div>

      <style>{`
        @keyframes float {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-20px); }
        }
      `}</style>
    </div>
  );
};

// // Modern Feature Card


// // Main App Component
// const App = () => {
//   const [activeTab, setActiveTab] = useState("overview");

//   const mockTemplates = [
//     {
//       title: "Customer Satisfaction Survey",
//       description:
//         "Get feedback from your customers about their experience with your product or service.",
//       topic: "Survey",
//       gradient: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
//       tags: ["feedback", "customer", "satisfaction"],
//       views: 1234,
//       likes: 89,
//       comments: 23,
//     },
//     {
//       title: "Product Quiz",
//       description:
//         "Test your knowledge about our products and win exciting prizes.",
//       topic: "Quiz",
//       gradient: "linear-gradient(135deg, #f093fb 0%, #f5576c 100%)",
//       tags: ["quiz", "product", "competition"],
//       views: 892,
//       likes: 67,
//       comments: 15,
//     },
//     {
//       title: "Employee Feedback Form",
//       description:
//         "Annual employee satisfaction and engagement survey for team members.",
//       topic: "Business",
//       gradient: "linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)",
//       tags: ["hr", "employee", "feedback"],
//       views: 654,
//       likes: 45,
//       comments: 12,
//     },
//   ];

//   return (
//     <div
//       style={{
//         minHeight: "100vh",
//         background: "#f8fafc",
//         fontFamily:
//           '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
//       }}
//     >
//       {/* Modern Hero */}
//       <ModernHero />

//       {/* Features Section */}
//       <div
//         style={{
//           maxWidth: "1200px",
//           margin: "0 auto",
//           padding: "6rem 2rem",
//         }}
//       >
//         <div style={{ textAlign: "center", marginBottom: "4rem" }}>
//           <h2
//             style={{
//               fontSize: "2.5rem",
//               fontWeight: "800",
//               marginBottom: "1rem",
//               color: colors.dark,
//             }}
//           >
//             Powerful Features
//           </h2>
//           <p
//             style={{
//               fontSize: "1.125rem",
//               color: "#64748b",
//               maxWidth: "600px",
//               margin: "0 auto",
//             }}
//           >
//             Everything you need to create, share, and analyze forms efficiently
//           </p>
//         </div>

//         <div
//           style={{
//             display: "grid",
//             gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
//             gap: "2rem",
//           }}
//         >
//           <FeatureCard
//             icon={Zap}
//             title="Easy Creation"
//             description="Drag and drop interface to build forms quickly with intuitive controls"
//             color={colors.primary}
//           />
//           <FeatureCard
//             icon={BarChart3}
//             title="Smart Analytics"
//             description="Get insights from responses with built-in analytics and visualizations"
//             color={colors.accent}
//           />
//           <FeatureCard
//             icon={Shield}
//             title="Secure & Private"
//             description="Advanced privacy controls and secure data handling for peace of mind"
//             color={colors.success}
//           />
//           <FeatureCard
//             icon={Globe}
//             title="Multi-language"
//             description="Support for multiple languages and international users worldwide"
//             color={colors.warning}
//           />
//         </div>
//       </div>

//       {/* Stats Section */}
//       <div
//         style={{
//           background: "white",
//           padding: "4rem 2rem",
//           borderTop: "1px solid #e2e8f0",
//           borderBottom: "1px solid #e2e8f0",
//         }}
//       >
//         <div style={{ maxWidth: "1200px", margin: "0 auto" }}>
//           <div
//             style={{
//               display: "grid",
//               gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))",
//               gap: "2rem",
//             }}
//           >
//             <StatsCard
//               icon={Users}
//               label="Active Users"
//               value="12,543"
//               trend={12.5}
//               color={colors.primary}
//             />
//             <StatsCard
//               icon={BarChart3}
//               label="Templates Created"
//               value="3,892"
//               trend={8.3}
//               color={colors.accent}
//             />
//             <StatsCard
//               icon={TrendingUp}
//               label="Forms Submitted"
//               value="45,231"
//               trend={15.7}
//               color={colors.success}
//             />
//             <StatsCard
//               icon={MessageSquare}
//               label="Comments"
//               value="8,743"
//               trend={-2.1}
//               color={colors.warning}
//             />
//           </div>
//         </div>
//       </div>

//       {/* Templates Section */}
//       <div
//         style={{
//           maxWidth: "1200px",
//           margin: "0 auto",
//           padding: "6rem 2rem",
//         }}
//       >
//         <div
//           style={{
//             display: "flex",
//             justifyContent: "space-between",
//             alignItems: "center",
//             marginBottom: "3rem",
//           }}
//         >
//           <div>
//             <h2
//               style={{
//                 fontSize: "2rem",
//                 fontWeight: "800",
//                 marginBottom: "0.5rem",
//                 color: colors.dark,
//               }}
//             >
//               Popular Templates
//             </h2>
//             <p style={{ color: "#64748b" }}>
//               Explore our most-used form templates
//             </p>
//           </div>
//           <button
//             style={{
//               background: colors.primary,
//               color: "white",
//               border: "none",
//               padding: "0.75rem 1.5rem",
//               borderRadius: "12px",
//               fontSize: "1rem",
//               fontWeight: "600",
//               cursor: "pointer",
//               display: "flex",
//               alignItems: "center",
//               gap: "0.5rem",
//               transition: "all 0.3s ease",
//               boxShadow: "0 4px 20px rgba(99, 102, 241, 0.3)",
//             }}
//           >
//             View All <ArrowRight size={20} />
//           </button>
//         </div>

//         <div
//           style={{
//             display: "grid",
//             gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))",
//             gap: "2rem",
//           }}
//         >
//           {mockTemplates.map((template, i) => (
//             <ModernTemplateCard key={i} template={template} />
//           ))}
//         </div>
//       </div>

//       {/* CTA Section */}
//       <div
//         style={{
//           background: colors.gradient,
//           padding: "6rem 2rem",
//           textAlign: "center",
//           color: "white",
//         }}
//       >
//         <div style={{ maxWidth: "800px", margin: "0 auto" }}>
//           <h2
//             style={{
//               fontSize: "2.5rem",
//               fontWeight: "800",
//               marginBottom: "1.5rem",
//             }}
//           >
//             Ready to Create Your First Form?
//           </h2>
//           <p
//             style={{
//               fontSize: "1.25rem",
//               marginBottom: "2rem",
//               opacity: 0.95,
//             }}
//           >
//             Join thousands of users creating beautiful forms and gathering
//             valuable insights
//           </p>
//           <button
//             style={{
//               background: "white",
//               color: colors.primary,
//               border: "none",
//               padding: "1rem 2.5rem",
//               borderRadius: "12px",
//               fontSize: "1.125rem",
//               fontWeight: "600",
//               cursor: "pointer",
//               boxShadow: "0 10px 30px rgba(0,0,0,0.2)",
//               transition: "all 0.3s ease",
//             }}
//           >
//             Get Started Free{" "}
//             <ArrowRight
//               size={20}
//               style={{ marginLeft: "0.5rem", display: "inline" }}
//             />
//           </button>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default App;
