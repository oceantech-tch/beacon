import React, {
  createContext,
  useContext,
  useEffect,
  useState,
} from "react";
import type { ReactNode } from "react";

import api from "../lib/api";

// -----------------------------------------------------------
// Types
// -----------------------------------------------------------
export interface IUser {
  _id?: string;
  email: string;
  name: string;
  picture?: string;
  wishlist?: string[];
}

interface IAuthContext {
  user: IUser | null;
  token: string | null;
  admin: boolean;
  adminToken: string | null;
  adminName: string | null;
  loading: boolean;
  login: (token: string, user: IUser) => void;
  loginAsAdmin: (token: string, username: string) => void;
  logout: () => void;
}

// -----------------------------------------------------------
// LocalStorage Keys
// -----------------------------------------------------------
const LS_USER = "gshock_user";
const LS_USER_TOKEN = "gshock_server_token";
const LS_ADMIN_TOKEN = "gshock_admin_token";
const LS_ADMIN_USERNAME = "gshock_admin_username";

// -----------------------------------------------------------
// Context Setup
// -----------------------------------------------------------
const AuthContext = createContext<IAuthContext | undefined>(undefined);

interface Props {
  children: ReactNode;
}

export const AuthProvider: React.FC<Props> = ({ children }) => {
  const [user, setUser] = useState<IUser | null>(null);
  const [token, setToken] = useState<string | null>(null);

  const [admin, setAdmin] = useState(false);
  const [adminToken, setAdminToken] = useState<string | null>(null);
  const [adminName, setAdminName] = useState<string | null>(null);

  const [loading, setLoading] = useState(true);

  // -----------------------------------------------------------
  // Attach JWT to axios BEFORE each request
  // (Critical for solving refresh issues)
  // -----------------------------------------------------------
  useEffect(() => {
    const interceptor = api.interceptors.request.use(
      (config) => {
        config.headers = config.headers || {};

        const t = localStorage.getItem(LS_USER_TOKEN);
        const at = localStorage.getItem(LS_ADMIN_TOKEN);

        if (at) {
          config.headers["Authorization"] = `Bearer ${at}`;
        } else if (t) {
          config.headers["Authorization"] = `Bearer ${t}`;
        }

        return config;
      },
      (error) => Promise.reject(error)
    );

    return () => {
      api.interceptors.request.eject(interceptor);
    };
  }, []);

  // -----------------------------------------------------------
  // Restore session on mount
  // -----------------------------------------------------------
  useEffect(() => {
    const savedUser = localStorage.getItem(LS_USER);
    const savedToken = localStorage.getItem(LS_USER_TOKEN);
    const savedAdminToken = localStorage.getItem(LS_ADMIN_TOKEN);
    const savedAdminUsername = localStorage.getItem(LS_ADMIN_USERNAME);

    if (savedToken) setToken(savedToken);

    if (savedUser) {
      try {
        setUser(JSON.parse(savedUser));
      } catch {
        localStorage.removeItem(LS_USER);
      }
    }

    if (savedAdminToken) {
      setAdmin(true);
      setAdminToken(savedAdminToken);

      if (savedAdminUsername) {
        setAdminName(savedAdminUsername);
      }
    }

    setLoading(false);
  }, []);

  // -----------------------------------------------------------
  // Login (User)
  // -----------------------------------------------------------
  const login = (newToken: string, newUser: IUser) => {
    setUser(newUser);
    setToken(newToken);

    localStorage.setItem(LS_USER, JSON.stringify(newUser));
    localStorage.setItem(LS_USER_TOKEN, newToken);

    // reset admin mode if previously set
    setAdmin(false);
    setAdminToken(null);
    localStorage.removeItem(LS_ADMIN_TOKEN);
  };

  // -----------------------------------------------------------
  // Login (Admin)
  // -----------------------------------------------------------
  const loginAsAdmin = (token: string, username: string) => {
    setAdmin(true);
    setAdminToken(token);
    setAdminName(username);

    localStorage.setItem(LS_ADMIN_TOKEN, token);
    localStorage.setItem(LS_ADMIN_USERNAME, username);

    // clear user mode
    setUser(null);
    setToken(null);
    localStorage.removeItem(LS_USER);
    localStorage.removeItem(LS_USER_TOKEN);
  };

  // -----------------------------------------------------------
  // Logout
  // -----------------------------------------------------------
  const logout = () => {
    setUser(null);
    setToken(null);
    setAdmin(false);
    setAdminToken(null);
    setAdminName(null);

    localStorage.removeItem(LS_USER);
    localStorage.removeItem(LS_USER_TOKEN);
    localStorage.removeItem(LS_ADMIN_TOKEN);
    localStorage.removeItem(LS_ADMIN_USERNAME);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        admin,
        adminToken,
        adminName,
        loading,
        login,
        loginAsAdmin,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

// -----------------------------------------------------------
// Hook
// -----------------------------------------------------------
export const useAuth = (): IAuthContext => {
  const ctx = useContext(AuthContext);
  if (!ctx) {
    throw new Error("useAuth must be used inside <AuthProvider>");
  }
  return ctx;
};

export default AuthContext;













// import React, {
//   createContext,
//   useContext,
//   useEffect,
//   useState,
// } from "react";
// import type { ReactNode } from "react";

// import api from "../lib/api"; 

// // -----------------------------------------------------------
// // 1) Type definitions
// // -----------------------------------------------------------

// /**
//  * IUser - shape of a logged-in user (from backend)
//  */
// export interface IUser {
//   _id?: string;
//   email: string;
//   name: string;
//   picture?: string;
//   wishlist?: string[];
// }

// /**
//  * IAuthContext - the values provided by the context
//  */
// interface IAuthContext {
//   user: IUser | null;                                 // normal user
//   token: string | null;                               // JWT for normal user
//   admin: boolean;                                     // admin mode enabled?
//   adminToken: string | null;                          // JWT for admin
//   adminName: string | null;
//   loading: boolean;                                   // during restore
//   login: (token: string, user: IUser) => void;        // normal user login
//   loginAsAdmin: (token: string, username: string) => void;              // admin login
//   logout: () => void;                                 // clears all sessions
// }


// // -----------------------------------------------------------
// // 2) LocalStorage keys
// // -----------------------------------------------------------
// const LS_USER = "gshock_user";
// const LS_USER_TOKEN = "gshock_server_token";

// const LS_ADMIN_TOKEN = "gshock_admin_token";


// // -----------------------------------------------------------
// // 3) Create context
// // -----------------------------------------------------------
// const AuthContext = createContext<IAuthContext | undefined>(undefined);


// // -----------------------------------------------------------
// // 4) Provider component
// // -----------------------------------------------------------
// interface Props {
//   children: ReactNode;
// }

// export const AuthProvider: React.FC<Props> = ({ children }) => {
//   // Normal user state
//   const [user, setUser] = useState<IUser | null>(null);
//   const [token, setToken] = useState<string | null>(null);

//   // Admin state
//   const [admin, setAdmin] = useState(false);
//   const [adminToken, setAdminToken] = useState<string | null>(null);
//   const [adminName, setAdminName] = useState<string | null>(null);

//   // Loading state for restoring session
//   const [loading, setLoading] = useState(true);


//   // -----------------------------------------------------------
//   // Restore session from localStorage on startup
//   // -----------------------------------------------------------
//   useEffect(() => {
//     const savedUser = localStorage.getItem(LS_USER);
//     const savedToken = localStorage.getItem(LS_USER_TOKEN);
//     const savedAdminToken = localStorage.getItem(LS_ADMIN_TOKEN);
//     const savedAdminUsername = localStorage.getItem("gshock_admin_username");

//     if (savedToken) setToken(savedToken);

//     // Restore user session
//     if (savedUser) {
//       try {
//         setUser(JSON.parse(savedUser));
//       } catch (e) {
//         console.error("Failed to parse stored user:", e);
//         localStorage.removeItem(LS_USER);
//       }
//     }

//     // Restore admin session
//     if (savedAdminToken) {
//       setAdmin(true);
//       setAdminToken(savedAdminToken);

//       if (savedAdminUsername) {
//         setAdminName(savedAdminUsername);
//       }
//     }

//     setLoading(false);
//   }, []);


//   // -----------------------------------------------------------
//   // Axios interceptor: attach Authorization automatically
//   // -----------------------------------------------------------
//   useEffect(() => {
//     const interceptor = api.interceptors.request.use(
//       (config) => {
//         config.headers = config.headers || {};

//         // For admin requests
//         if (admin && adminToken) {
//           config.headers["Authorization"] = `Bearer ${adminToken}`;
//         }
//         // For normal user requests
//         else if (!admin && token) {
//           config.headers["Authorization"] = `Bearer ${token}`;
//         }

//         return config;
//       },
//       (error) => Promise.reject(error)
//     );

//     return () => {
//       api.interceptors.request.eject(interceptor);
//     };
//   }, [token, adminToken, admin]);


//   // -----------------------------------------------------------
//   // login(): normal user login
//   // -----------------------------------------------------------
//   const login = (newToken: string, newUser: IUser) => {
//     // Update state
//     setUser(newUser);
//     setToken(newToken);

//     // Persist
//     localStorage.setItem(LS_USER, JSON.stringify(newUser));
//     localStorage.setItem(LS_USER_TOKEN, newToken);

//     // If previously admin, disable admin mode
//     setAdmin(false);
//     setAdminToken(null);
//     localStorage.removeItem(LS_ADMIN_TOKEN);
//   };


//   // -----------------------------------------------------------
//   // loginAsAdmin(): admin login only
//   // -----------------------------------------------------------
//   const loginAsAdmin = (token: string, username: string) => {
//     setAdmin(true);
//     setAdminToken(token);

//     // Persist
//     localStorage.setItem(LS_ADMIN_TOKEN, token);
//     localStorage.setItem("gshock_admin_username", username);

//     // Clear normal user session (admin ≠ user)
//     setUser(null);
//     setToken(null);
//     localStorage.removeItem(LS_USER);
//     localStorage.removeItem(LS_USER_TOKEN);
//   };


//   // -----------------------------------------------------------
//   // logout(): clears *everything*
//   // -----------------------------------------------------------
//   const logout = () => {
//     setUser(null);
//     setToken(null);
//     setAdmin(false);
//     setAdminToken(null);

//     localStorage.removeItem(LS_USER);
//     localStorage.removeItem(LS_USER_TOKEN);
//     localStorage.removeItem(LS_ADMIN_TOKEN);
//   };


//   // -----------------------------------------------------------
//   // Context value to provide
//   // -----------------------------------------------------------
//   const value: IAuthContext = {
//     user,
//     token,
//     admin,
//     adminToken,
//     adminName,
//     loading,
//     login,
//     loginAsAdmin,
//     logout,
//   };

//   return (
//     <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
//   );
// };


// // -----------------------------------------------------------
// // 5) Hook: useAuth()
// // -----------------------------------------------------------
// export const useAuth = (): IAuthContext => {
//   const ctx = useContext(AuthContext);
//   if (!ctx) {
//     throw new Error("useAuth must be used inside <AuthProvider>");
//   }
//   return ctx;
// };

// export default AuthContext;