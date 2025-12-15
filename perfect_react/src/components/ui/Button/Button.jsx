import React, { useState } from 'react';
import { cn } from '../../../utils/helpers';
import styles from './Button.module.css';

const Button = ({
  children,
  variant = 'primary',
  size = 'md',
  disabled = false,
  loading = false,
  fullWidth = false,
  icon = null,
  iconPosition = 'left',
  glow = false,
  gradient = false,
  className = '',
  onClick,
  type = 'button',
  ...props
}) => {
  const [ripples, setRipples] = useState([]);

  const handleClick = (e) => {
    if (disabled || loading) return;

    
    const rect = e.currentTarget.getBoundingClientRect();
    const size = Math.max(rect.width, rect.height);
    const x = e.clientX - rect.left - size / 2;
    const y = e.clientY - rect.top - size / 2;

    const newRipple = {
      x,
      y,
      size,
      id: Date.now(),
    };

    setRipples(prev => [...prev, newRipple]);

    
    setTimeout(() => {
      setRipples(prev => prev.filter(ripple => ripple.id !== newRipple.id));
    }, 600);

    if (onClick) onClick(e);
  };

  const buttonClasses = cn(
    styles.button,
    styles[variant],
    styles[size],
    {
      [styles.disabled]: disabled,
      [styles.loading]: loading,
      [styles.fullWidth]: fullWidth,
      [styles.glow]: glow,
      [styles.gradient]: gradient,
      [styles.hasIcon]: icon,
    },
    className
  );

  const renderIcon = () => {
    if (!icon) return null;

    return (
      <span className={cn(styles.icon, {
        [styles.iconLeft]: iconPosition === 'left',
        [styles.iconRight]: iconPosition === 'right',
      })}>
        {typeof icon === 'string' ? <span>{icon}</span> : icon}
      </span>
    );
  };

  return (
    <button
      type={type}
      className={buttonClasses}
      disabled={disabled || loading}
      onClick={handleClick}
      {...props}
    >
      {}
      <div className={styles.rippleContainer}>
        {ripples.map(ripple => (
          <span
            key={ripple.id}
            className={styles.ripple}
            style={{
              left: ripple.x,
              top: ripple.y,
              width: ripple.size,
              height: ripple.size,
            }}
          />
        ))}
      </div>

      {}
      {loading && (
        <div className={styles.loadingContainer}>
          <svg
            className={styles.spinner}
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <circle
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeDasharray="32"
              strokeDashoffset="32"
              className={styles.spinnerCircle}
            />
          </svg>
        </div>
      )}

      {}
      <div className={cn(styles.content, {
        [styles.contentHidden]: loading
      })}>
        {iconPosition === 'left' && renderIcon()}
        <span className={styles.text}>{children}</span>
        {iconPosition === 'right' && renderIcon()}
      </div>

      {}
      {gradient && <div className={styles.gradientOverlay} />}

      {}
      {glow && <div className={styles.glowEffect} />}
    </button>
  );
};

export default Button;