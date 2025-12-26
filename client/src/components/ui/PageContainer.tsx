import React from "react";

interface Props {
  children: React.ReactNode;
}

const PageContainer: React.FC<Props> = ({ children }) => {
  return (
    <div
      style={{
        padding: "1.5rem",
        maxWidth: "450px",
        margin: "0 auto",
      }}
    >
      {children}
    </div>
  );
};

export default PageContainer;