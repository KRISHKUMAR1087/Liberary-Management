import React from 'react';
import { motion } from 'framer-motion';

const Input = React.forwardRef(
  ({
    label,
    type = 'text',
    placeholder,
    value,
    onChange,
    error,
    disabled = false,
    required = false,
    className = '',
    icon: Icon,
    ...props
  }, ref) => {
    const inputClasses = `
      input
      ${error ? 'input-error' : ''}
      ${Icon ? 'pl-10' : ''}
      ${disabled ? 'opacity-50 cursor-not-allowed' : ''}
      ${className}
    `.trim();

    return (
      <div className="w-full">
        {label && (
          <label className="label">
            {label}
            {required && <span className="text-danger-500 ml-1">*</span>}
          </label>
        )}
        
        <div className="relative">
          {Icon && (
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Icon className="h-4 w-4 text-secondary-400" />
            </div>
          )}
          
          <motion.input
            ref={ref}
            type={type}
            placeholder={placeholder}
            value={value}
            onChange={onChange}
            disabled={disabled}
            className={inputClasses}
            whileFocus={{ scale: 1.01 }}
            transition={{ duration: 0.2 }}
            {...props}
          />
        </div>
        
        {error && (
          <motion.p 
            className="error-message"
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.2 }}
          >
            {error}
          </motion.p>
        )}
      </div>
    );
  }
);

export default Input;

