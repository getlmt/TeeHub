// src/components/ui/cart/radio-group.jsx
import React, { createContext, useContext, useId } from "react";

/**
 * Accessible RadioGroup + RadioGroupItem implementation using Context.
 *
 * Usage (unchanged):
 * <RadioGroup value={value} onValueChange={setValue} name="shipping">
 *   <div className="shipping-option">
 *     <RadioGroupItem id="express" value="express" />
 *     <label htmlFor="express">Giao nhanh</label>
 *   </div>
 *   ...
 * </RadioGroup>
 *
 * Key points:
 * - No unknown props are forwarded to DOM elements (no warnings).
 * - Works with arbitrary wrappers: you can nest RadioGroupItem inside other elements.
 * - RadioGroupItem reads group state from context.
 */

const RadioGroupContext = createContext({
  value: undefined,
  onChange: undefined,
  name: undefined,
});

export const RadioGroup = ({ value, onValueChange, children, className = "", id, name }) => {
  // generate stable name if user didn't pass one
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

/**
 * RadioGroupItem
 * - Renders a native <input type="radio" /> that reads group state from context.
 * - Accepts:
 *    - value (required) : the item's value
 *    - id (optional)    : for label pairing
 *    - disabled (optional)
 *    - inputProps (optional) : additional safe attributes for the input (className, aria-*, data-*, etc)
 *
 * It intentionally *does not* accept arbitrary props that could be forwarded to DOM wrappers.
 */
export const RadioGroupItem = ({ id, value: itemValue, disabled = false, inputProps = {} }) => {
  const ctx = useContext(RadioGroupContext);

  // If used outside a RadioGroup, behave as uncontrolled with its own name
  const name = ctx?.name || `radio-${id || Math.random().toString(36).slice(2, 9)}`;
  const checked = ctx && ctx.value !== undefined ? ctx.value === itemValue : undefined;

  const handleChange = (e) => {
    if (disabled) return;
    if (ctx && typeof ctx.onChange === "function") ctx.onChange(itemValue, e);
    // else uncontrolled input will naturally update by browser
  };

  // Only pass safe props into input via inputProps; do not spread other custom props into parent wrappers.
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
