// src/pages/admin/WishlistInsights.tsx
import React, { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router";
import PageContainer from "../../components/ui/PageContainer";
import Header from "../../components/Header";
import Card from "../../components/ui/Card";
import Button from "../../components/ui/Button";
import { getWishlistSummary, getWishlistUsers } from "../../api/admin";
import { SyncLoader } from "react-spinners";
import { useAuth } from "../../contexts/AuthContext";
import "./ui/wishlistInsights.css";

interface SummaryItem {
  model: string;
  count: number;
}

interface UserRow {
  _id?: string;
  email?: string;
  name?: string;
  createdAt?: string;
}

const POLL_MS = 10_000;

const WishlistInsights: React.FC = () => {
  const navigate = useNavigate();
  const { loading: authLoading } = useAuth();

  const [loading, setLoading] = useState<boolean>(true);
  const [summary, setSummary] = useState<SummaryItem[]>([]);
  const [selectedModel, setSelectedModel] = useState<string | null>(null);
  const [users, setUsers] = useState<UserRow[]>([]);
  const [usersLoading, setUsersLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const pollingRef = useRef<number | null>(null);
  const mountedRef = useRef(true);

  // initial load (only after auth is restored)
  const fetchSummaryInitial = async () => {
    setError(null);
    setLoading(true);
    try {
      const data = await getWishlistSummary();
      if (data?.ok) {
        setSummary(data.summary || []);
      } else {
        setError("Failed to load summary");
      }
    } catch (e) {
      console.error("Failed to fetch wishlist summary (initial):", e);
      setError("Failed to load summary");
    } finally {
      if (mountedRef.current) setLoading(false);
    }
  };

  // polling (updates summary only)
  const fetchSummaryPoll = async () => {
    try {
      const data = await getWishlistSummary();
      if (data?.ok) {
        setSummary(data.summary || []);
      }
    } catch (e) {
      console.error("Poll fetch error:", e);
    }
  };

  useEffect(() => {
    mountedRef.current = true;

    // only start fetching after auth restore
    if (!authLoading) {
      fetchSummaryInitial();

      if (!pollingRef.current) {
        pollingRef.current = window.setInterval(() => {
          fetchSummaryPoll();
        }, POLL_MS);
      }
    }

    return () => {
      mountedRef.current = false;
      if (pollingRef.current) {
        clearInterval(pollingRef.current);
        pollingRef.current = null;
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [authLoading]);

  const handleViewUsers = async (model: string) => {
    setSelectedModel(model);
    setUsers([]);
    setUsersLoading(true);
    setError(null);

    try {
      const data = await getWishlistUsers(model);
      if (data?.ok) {
        setUsers(data.users || []);
      } else {
        setError("Failed to load users");
      }
    } catch (e) {
      console.error("Failed to load wishlist users:", e);
      setError("Failed to load users");
    } finally {
      setUsersLoading(false);
    }
  };

  return (
    <>
      <Header onLogout={() => (window.location.href = "/admin/login")} />
      <PageContainer>
        <Button
          full={false}
          variant="outline"
          style={{ marginBottom: "1.5rem" }}
          onClick={() => navigate("/admin/dashboard")}
        >
          ← Back to Dashboard
        </Button>

        <h1 className="wi-title">Wishlist Insights</h1>
        <p className="wi-sub">
          See which G-Shock models your customers are looking for and how many
          people requested each model.
        </p>

        {loading ? (
          <div className="wi-loader">
            <SyncLoader size={12} color="#111" />
          </div>
        ) : (
          <>
            <div className="wi-grid">
              {summary.map((it) => (
                <Card key={it.model}>
                  <div className="wi-row">
                    <div>
                      <div className="wi-model">{it.model}</div>
                      <div className="wi-count">
                        {it.count} user{it.count !== 1 ? "s" : ""}
                      </div>
                    </div>

                    <div className="wi-actions">
                      <Button
                        full={false}
                        variant="outline"
                        onClick={() => handleViewUsers(it.model)}
                      >
                        View users
                      </Button>
                    </div>
                  </div>
                </Card>
              ))}
            </div>

            <div className="wi-panel">
              <h3 className="wi-panel-title">
                {selectedModel
                  ? `Users who want ${selectedModel}`
                  : "Select a model to view users"}
              </h3>

              {usersLoading ? (
                <div style={{ marginTop: 12 }}>
                  <SyncLoader size={10} color="#111" />
                </div>
              ) : selectedModel ? (
                users.length === 0 ? (
                  <div className="wi-no-users">No users found for this model.</div>
                ) : (
                  <div className="wi-users">
                    {users.map((u) => (
                      <Card key={u._id ?? u.email}>
                        <div className="wi-user-row">
                          <div>
                            <div className="wi-user-name">{u.name ?? "—"}</div>
                            <div className="wi-user-email">{u.email}</div>
                          </div>
                          <div />
                        </div>
                      </Card>
                    ))}
                  </div>
                )
              ) : null}
            </div>
          </>
        )}

        {error && <div className="wi-error">{error}</div>}
      </PageContainer>
    </>
  );
};

export default WishlistInsights;






























// import React, { useEffect, useRef, useState } from "react";
// import { useNavigate } from "react-router";
// import PageContainer from "../../components/ui/PageContainer";
// import Header from "../../components/Header";
// import Card from "../../components/ui/Card";
// import Button from "../../components/ui/Button";
// import { getWishlistSummary, getWishlistUsers } from "../../api/admin";
// import { SyncLoader } from "react-spinners";
// import "./ui/wishlistInsights.css";

// interface SummaryItem {
//   model: string;
//   count: number;
// }

// interface UserRow {
//   _id?: string;
//   email?: string;
//   name?: string;
//   createdAt?: string;
// }


// const POLL_MS = 10_000;

// const WishlistInsights: React.FC = () => {
//   const navigate = useNavigate();

//   // ui state
//   const [loading, setLoading] = useState<boolean>(true); // only for initial load
//   const [summary, setSummary] = useState<SummaryItem[]>([]);
//   const [selectedModel, setSelectedModel] = useState<string | null>(null);
//   const [users, setUsers] = useState<UserRow[]>([]);
//   const [usersLoading, setUsersLoading] = useState<boolean>(false);
//   const [error, setError] = useState<string | null>(null);

//   // refs to prevent duplicate intervals and stale closures
//   const pollingRef = useRef<number | null>(null);
//   const mountedRef = useRef(true);

//   // Fetch summary once (initial load)
//   const fetchSummaryInitial = async () => {
//     setError(null);
//     setLoading(true);
//     try {
//       const data = await getWishlistSummary(); // <-- await is essential
//       if (data?.ok) {
//         setSummary(data.summary || []);
//       } else {
//         setError("Failed to load summary");
//       }
//     } catch (e) {
//       console.error("Failed to fetch wishlist summary (initial):", e);
//       setError("Failed to load summary");
//     } finally {
//       if (mountedRef.current) setLoading(false);
//     }
//   };

//   // Polling fetch: updates summary only (no loading spinner)
//   const fetchSummaryPoll = async () => {
//     try {
//       const data = await getWishlistSummary();
//       if (data?.ok) {
//         setSummary(data.summary || []);
//       } else {
//         // don't override UI with spinner — just record error
//         console.warn("Poll fetch failed:", data);
//       }
//     } catch (e) {
//       console.error("Poll fetch error:", e);
//     }
//   };

//   useEffect(() => {
//     mountedRef.current = true;

//     // run initial load
//     fetchSummaryInitial();

//     // start polling, but only if not already started
//     if (!pollingRef.current) {
//       const id = window.setInterval(() => {
//         // only update summary; don't change selectedModel/users/loading
//         fetchSummaryPoll();
//       }, POLL_MS);
//       pollingRef.current = id;
//     }

//     return () => {
//       mountedRef.current = false;
//       if (pollingRef.current) {
//         clearInterval(pollingRef.current);
//         pollingRef.current = null;
//       }
//     };
//     // we intentionally do not include fetchSummaryPoll in deps to avoid re-creating interval
//     // eslint-disable-next-line react-hooks/exhaustive-deps
//   }, []);

//   // load users who wishlisted a model (drill-down)
//   const handleViewUsers = async (model: string) => {
//     setSelectedModel(model);
//     setUsers([]);
//     setUsersLoading(true);
//     setError(null);

//     try {
//       const data = await getWishlistUsers(model);
//       if (data?.ok) {
//         setUsers(data.users || []);
//       } else {
//         setError("Failed to load users");
//       }
//     } catch (e) {
//       console.error("Failed to load wishlist users:", e);
//       setError("Failed to load users");
//     } finally {
//       setUsersLoading(false);
//     }
//   };

//   return (
//     <>
//       <Header onLogout={() => (window.location.href = "/admin/login")} />
//       <PageContainer>
//         <Button
//           full={false}
//           variant="outline"
//           style={{ marginBottom: "1.5rem" }}
//           onClick={() => navigate("/admin/dashboard")}
//         >
//           ← Back to Dashboard
//         </Button>

//         <h1 className="wi-title">Wishlist Insights</h1>
//         <p className="wi-sub">
//           See which G-Shock models your customers are looking for and how many
//           people requested each model.
//         </p>

//         {loading ? (
//           <div className="wi-loader">
//             <SyncLoader size={12} color="#111" />
//           </div>
//         ) : (
//           <>
//             <div className="wi-grid">
//               {summary.map((it) => (
//                 <Card key={it.model}>
//                   <div className="wi-row">
//                     <div>
//                       <div className="wi-model">{it.model}</div>
//                       <div className="wi-count">
//                         {it.count} user{it.count !== 1 ? "s" : ""}
//                       </div>
//                     </div>

//                     <div className="wi-actions">
//                       <Button
//                         full={false}
//                         variant="outline"
//                         onClick={() => handleViewUsers(it.model)}
//                       >
//                         View users
//                       </Button>
//                     </div>
//                   </div>
//                 </Card>
//               ))}
//             </div>

//             {/* Drill-down panel */}
//             <div className="wi-panel">
//               <h3 className="wi-panel-title">
//                 {selectedModel
//                   ? `Users who want ${selectedModel}`
//                   : "Select a model to view users"}
//               </h3>

//               {usersLoading ? (
//                 <div style={{ marginTop: 12 }}>
//                   <SyncLoader size={10} color="#111" />
//                 </div>
//               ) : selectedModel ? (
//                 users.length === 0 ? (
//                   <div className="wi-no-users">No users found for this model.</div>
//                 ) : (
//                   <div className="wi-users">
//                     {users.map((u) => (
//                       <Card key={u._id ?? u.email}>
//                         <div className="wi-user-row">
//                           <div>
//                             <div className="wi-user-name">{u.name ?? "—"}</div>
//                             <div className="wi-user-email">{u.email}</div>
//                           </div>
//                           <div />
//                         </div>
//                       </Card>
//                     ))}
//                   </div>
//                 )
//               ) : null}
//             </div>
//           </>
//         )}

//         {error && <div className="wi-error">{error}</div>}
//       </PageContainer>
//     </>
//   );
// };

// export default WishlistInsights;