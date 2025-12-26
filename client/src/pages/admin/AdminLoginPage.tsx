import React, { useState } from "react";
import { useNavigate } from "react-router";
import { adminLoginRequest } from "../../api/admin";
import { useAuth } from "../../contexts/AuthContext";

import PageContainer from "../../components/ui/PageContainer";
import Input from "../../components/ui/Input";
import Button from "../../components/ui/Button";

import { FaEye, FaEyeSlash } from "react-icons/fa";
import { SyncLoader } from "react-spinners";
import "./ui/adminLoginPage.css";
import toast from "react-hot-toast";

const AdminLoginPage: React.FC = () => {
  const navigate = useNavigate();
  const { loginAsAdmin } = useAuth();

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPwd, setShowPwd] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const res = await adminLoginRequest(username, password);

      if (res?.ok && res?.token && res.username) {
        loginAsAdmin(res.token, res.username);
        toast.success("Admin logged in");
        navigate("/admin/dashboard", { replace: true });
      } else {
        setError(res?.message ?? "Invalid credentials");
      }
    } catch (err: any) {
      setError(err.message ?? "Login failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <PageContainer>
      <div className="container">
        <h2 className="title">Admin Login</h2>

        {error && <div className="errorBox">{error}</div>}

        <form onSubmit={submit} className="form">
          {/* USERNAME */}
          <Input
            placeholder="Username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />

          {/* PASSWORD */}
          <div className="inputWrapper">
            <Input
              type={showPwd ? "text" : "password"}
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />

            {/* Toggle eye */}
            <button
              type="button"
              className="eyeButton"
              onClick={() => setShowPwd((prev) => !prev)}
            >
              {showPwd ? (
                <FaEyeSlash size={20} color="#222" />
              ) : (
                <FaEye size={20} color="#222" />
              )}
            </button>
          </div>

          {/* BUTTON */}
          <Button type="submit" disabled={loading}>
            {loading ? <SyncLoader size={10} color="#1a1a1a" /> : "Login"}
          </Button>
        </form>
      </div>
    </PageContainer>
  );
};

export default AdminLoginPage;