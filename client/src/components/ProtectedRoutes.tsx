import { Navigate, Outlet } from "react-router";
import { useAuth } from "../contexts/AuthContext";
import Spinner from "./fontIcons/Spinner";

// interface Props {
//     requireAdmin?: boolean;
// }

const ProtectedRoutes: React.FC = () => {
    const { user, loading } = useAuth();

    if (loading) {
        return (
            <div>
                <Spinner />
            </div> 
        );
    }
    
    if (!user) return <Navigate to="/login" replace />;
    return <Outlet />;
};

export default ProtectedRoutes;




// import { Navigate, Outlet } from "react-router";
// import { useAuth } from "../contexts/AuthContext";
// import Spinner from "./fontIcons/Spinner";

// interface Props {
//     requireAdmin?: boolean;
// }

// const ProtectedRoutes: React.FC<Props> = ({ requireAdmin = false }) => {
//     const { user, admin, adminToken, loading } = useAuth();

//     if (loading) {
//         return (
//             <div>
//                 <Spinner />
//             </div> 
//         );
//     }
//     if (requireAdmin) {
//         if (!admin || !adminToken) {
//             return <Navigate to="/admin/login" replace />;
//         }
//     }
//     if (!user) return <Navigate to="/login" replace />;
//     return <Outlet />;
// };

// export default ProtectedRoutes;