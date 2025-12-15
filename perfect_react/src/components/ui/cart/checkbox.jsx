import React from "react";

const Checkbox = ({ checked, onCheckedChange, className = "", ...props }) => {
  return (
    <input
      type="checkbox"
      className={["h-4 w-4 rounded border border-gray-400", className].join(" ")}
      checked={!!checked}
      onChange={(e) => onCheckedChange ? onCheckedChange(e.target.checked) : undefined}
      {...props}
    />
  );
};

export { Checkbox };


