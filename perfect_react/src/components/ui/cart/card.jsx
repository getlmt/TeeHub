import React from "react";

const Card = ({ className = "", children, ...props }) => (
  <div className={["rounded-lg border bg-white text-gray-900 shadow", className].join(" ")} {...props}>
    {children}
  </div>
);

const CardHeader = ({ className = "", children, ...props }) => (
  <div className={["flex flex-col space-y-1.5 p-6", className].join(" ")} {...props}>{children}</div>
);

const CardTitle = ({ className = "", children, ...props }) => (
  <h3 className={["text-2xl font-semibold", className].join(" ")} {...props}>{children}</h3>
);

const CardContent = ({ className = "", children, ...props }) => (
  <div className={["p-6 pt-0", className].join(" ")} {...props}>{children}</div>
);

export { Card, CardHeader, CardTitle, CardContent };


