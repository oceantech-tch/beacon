import React, { useEffect, useRef } from "react";
import { useNavigate, useSearchParams } from "react-router";
import "./admin/ui/landing.css";

const LandingPage: React.FC = () => {
  const navigate = useNavigate();
  const [params] = useSearchParams();

  useEffect(() => {
    if (params.get("admin") === "1") {
        navigate("/admin/login");
    }
  }, [params, navigate]);

//   Triple Tap (admin)
  const tapCount = useRef(0);
  const lastTapTime = useRef<number>(0);

  const handleSecretTap = () => {
    const now = Date.now();
    if (now - lastTapTime.current < 500) {
        tapCount.current += 1;
    } else {
        tapCount.current = 1;
    }

    lastTapTime.current = now;

    if (tapCount.current >= 3) {
        navigate("/admin/login");
    }
  };


    //   Long-press (admin)
    const pressTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

    const startLongPress = () => {
        pressTimer.current = setTimeout(() => {
            navigate("/admin/login");
        }, 1300); // hold for 1.3s
    }

    const cancelLongPress = () => {
        if (pressTimer.current) clearTimeout(pressTimer.current);
    };

  return (
    <div
      onClick={handleSecretTap}
      onMouseDown={startLongPress}
      onMouseUp={cancelLongPress}
      onTouchStart={startLongPress}
      onTouchEnd={cancelLongPress}
      className="landing-wrapper"
    >
      <div className="landing-content">
        <h1 className="landing-title">
          Build Your Perfect <br />G-Shock Wishlist
        </h1>

        <p className="landing-subtitle">
          Discover iconic G-Shock models, create your wishlist, and get notified
          when the watch you want becomes available.
        </p>

        <button
          onClick={(e) => {
            e.stopPropagation();
            navigate("/login");
          }}
          className="landing-btn">
          Continue → Sign In
        </button>
      </div>

      <div className="landing-footer">
        © {new Date().getFullYear()} G-Shock Wishlist
      </div>
    </div>
  );
};

export default LandingPage;