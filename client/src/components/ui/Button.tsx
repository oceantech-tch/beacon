import React from "react";
import { theme } from "../../theme";

interface Props extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  full?: boolean;
  variant?: "primary" | "outline" | "danger";
}

const Button: React.FC<Props> = ({
  full = true,
  variant = "primary",
  style,
  ...props
}) => {
  const styles: React.CSSProperties = {
    width: full ? "100%" : "auto",
    padding: theme.spacing.md,
    borderRadius: theme.radii.md,
    border: "none",
    fontSize: "1rem",
    cursor: "pointer",
    ...style,
  };

  if (variant === "primary") {
    styles.background = theme.colors.primary;
    styles.color = "white";
  }
  if (variant === "outline") {
    styles.background = "transparent";
    styles.border = `1px solid ${theme.colors.gray}`;
    styles.color = theme.colors.text;
  }
  if (variant === "danger") {
    styles.background = theme.colors.danger;
    styles.color = "white";
  }

  return <button {...props} style={styles} />;
};

export default Button;