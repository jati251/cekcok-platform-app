import { useState } from "react";
import styles from "./CustomInput.module.css"; // Import your CSS module for styling

const CustomInput = ({ label, value, onChange }) => {
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
          className={styles.input}
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
