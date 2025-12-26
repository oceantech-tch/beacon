import React from "react";
import { Navigate, Outlet } from "react-router";
import { useAuth } from "../contexts/AuthContext";
import Spinner from "./fontIcons/Spinner";

const AdminProtectedRoutes: React.FC = () => {
    const { admin, adminToken, loading } = useAuth();

    if (loading) {
        return <div className="centered"><Spinner /></div>
    }

    if (!admin || !adminToken) {
        return <Navigate to="/admin/login" replace />
    }

    return <Outlet />
};

export default AdminProtectedRoutes;