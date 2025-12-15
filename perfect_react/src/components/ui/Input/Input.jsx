import React, { forwardRef } from 'react';
import { cn } from '../../../utils/helpers';
import styles from './Input.module.css';

const Input = forwardRef(({
  label,
  error,
  helperText,
  required = false,
  disabled = false,
  className = '',
  containerClassName = '',
  leftIcon,
  rightIcon,
  type = 'text',
  ...props
}, ref) => {
  const inputClasses = cn(
    styles.input,
    {
      [styles.error]: error,
      [styles.disabled]: disabled,
      [styles.withLeftIcon]: leftIcon,
      [styles.withRightIcon]: rightIcon,
    },
    className
  );

  const containerClasses = cn(styles.container, containerClassName);

  return (
    <div className={containerClasses}>
      {label && (
        <label className={styles.label}>
          {label}
          {required && <span className={styles.required}>*</span>}
        </label>
      )}
      <div className={styles.inputWrapper}>
        {leftIcon && (
          <div className={styles.leftIcon}>
            {leftIcon}
          </div>
        )}
        <input
          ref={ref}
          type={type}
          className={inputClasses}
          disabled={disabled}
          {...props}
        />
        {rightIcon && (
          <div className={styles.rightIcon}>
            {rightIcon}
          </div>
        )}
      </div>
      {error && (
        <div className={styles.errorMessage}>
          {error}
        </div>
      )}
      {helperText && !error && (
        <div className={styles.helperText}>
          {helperText}
        </div>
      )}
    </div>
  );
});

Input.displayName = 'Input';

export default Input;
