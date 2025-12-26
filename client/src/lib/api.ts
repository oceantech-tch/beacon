import axios from "axios";
import { toast } from "react-hot-toast";

// Read base
const apiBase = import.meta.env.VITE_API_BASE as string;

// Create instance
const api = axios.create({
    baseURL: apiBase,
    headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
    }
});

api.interceptors.response.use(
    (res) => res,
    (err) => {
        const status = err.response?.status;

        if (status === 401) {
            console.warn("Unauthorized -- JWT expired or invalid.");
        }

        const msg = 
        err.response?.data?.message ||
        err.response?.data?.error ||
        err.message ||
        "Network error";

        toast.error(msg);

        if (!window.location.pathname.includes("admin")) {
            toast.error(msg);
        }
        return Promise.reject(err);
    }
);

export default api;













// // Central axios instance for frontend
// import axios from "axios";
// import { toast } from "react-hot-toast";

// // Read base
// const apiBase = (import.meta.env.VITE_API_BASE as string) || "";
// const useCredentials = import.meta.env.VITE_USE_CREDENTIALS as string;

// // Create instance
// const api = axios.create({
//     baseURL: apiBase,
//     withCredentials: useCredentials,
//     headers: {
//         "Content-Type": "application/json",
//         Accept: "application/json",
//     }
// });

// api.interceptors.response.use(
//     (res) => res,
//     (err) => {
//         if (err.response?.status === 401) {
//             console.warn("Unauthorized -- JWT expired or invalid.");
//         }

//         const msg = 
//         err.response?.data?.message ||
//         err.response?.data?.error ||
//         err.message ||
//         "Network error";

//         toast.error(msg);

//         return Promise.reject(err);
//     }
// );

// export default api;