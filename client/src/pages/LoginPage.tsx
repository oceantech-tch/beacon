import React from "react";
import { useNavigate } from "react-router";
import PageContainer from "../components/ui/PageContainer";
import Header from "../components/Header";
import GoogleSignIn from "../components/GoogleSignIn";
import "./admin/ui/login.css";

const LoginPage: React.FC = () => {
  const navigate = useNavigate();

  return (
    <>
      <Header />
      <PageContainer>
        <div className="login-wrap">
          <h1 className="login-title">Sign in to Continue</h1>
          <p className="login-sub">
            Access your wishlist securely. Quick and easy.
          </p>

          <div className="login-card">
            <GoogleSignIn />
          </div>

          <p className="login-foot">
            Don’t have a wishlist yet?  
            <span
              className="login-foot-link"
              onClick={() => navigate("/")}
            >
              Visit the homepage
            </span>
          </p>
        </div>
      </PageContainer>
    </>
  );
};

export default LoginPage;