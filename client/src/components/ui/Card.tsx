import React from "react";
import { theme } from "../../theme";

interface Props extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
}

const Card: React.FC<Props> = ({ children, style, className, ...props }) => {
  return (
    <div
      { ...props }
      className={className}
      style={{
        background: "#f9f9f9",
        padding: theme.spacing.md,
        borderRadius: theme.radii.md,
        marginBottom: theme.spacing.sm,
        ...style,
      }}
    >
      {children}
    </div>
  );
};

export default Card;