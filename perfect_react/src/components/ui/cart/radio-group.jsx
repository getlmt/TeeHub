
import React, { createContext, useContext, useId } from "react";



const RadioGroupContext = createContext({
  value: undefined,
  onChange: undefined,
  name: undefined,
});

export const RadioGroup = ({ value, onValueChange, children, className = "", id, name }) => {
  
  const generatedId = useId ? useId() : `rg-${Math.random().toString(36).slice(2, 9)}`;
  const groupName = name || (id ? `rg-${id}` : `rg-${generatedId}`);

  return (
    <div id={id} className={className} role="radiogroup" aria-label={id || undefined}>
      <RadioGroupContext.Provider value={{ value, onChange: onValueChange, name: groupName }}>
        {children}
      </RadioGroupContext.Provider>
    </div>
  );
};


export const RadioGroupItem = ({ id, value: itemValue, disabled = false, inputProps = {} }) => {
  const ctx = useContext(RadioGroupContext);

  
  const name = ctx?.name || `radio-${id || Math.random().toString(36).slice(2, 9)}`;
  const checked = ctx && ctx.value !== undefined ? ctx.value === itemValue : undefined;

  const handleChange = (e) => {
    if (disabled) return;
    if (ctx && typeof ctx.onChange === "function") ctx.onChange(itemValue, e);
    
  };

  
  return (
    <input
      type="radio"
      id={id}
      name={name}
      value={itemValue}
      checked={checked}
      onChange={handleChange}
      disabled={disabled}
      aria-checked={checked}
      {...(inputProps || {})}
    />
  );
};

export default RadioGroup;
