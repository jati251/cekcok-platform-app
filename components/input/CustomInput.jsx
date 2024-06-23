import { useState } from "react";
import styles from "./CustomInput.module.css"; // Import your CSS module for styling

const CustomInput = ({
  disabled,
  label,
  value,
  onChange,
  isDarkMode,
  loading,
}) => {
  const [focused, setFocused] = useState(false);

  const handleFocus = () => {
    setFocused(true);
  };

  const handleBlur = () => {
    if (!value) {
      setFocused(false);
    }
  };

  return (
    <div className={styles.inputWrapper}>
      <label
        className={`${styles.label} ${
          focused || value ? styles.labelActive : ""
        }`}
      >
        {label}
      </label>
      {focused && <div className={styles.counter}>{`${value.length}/50`}</div>}
      <div className={styles.inputContainer}>
        <input
          disabled={loading || disabled}
          className={
            styles.input +
            ` ${
              disabled
                ? "bg-gray-500"
                : isDarkMode
                ? "theme-dark"
                : "theme-white"
            }`
          }
          type="text"
          value={value}
          onChange={onChange}
          onFocus={handleFocus}
          onBlur={handleBlur}
          maxLength={50}
        />
      </div>
    </div>
  );
};

export default CustomInput;
