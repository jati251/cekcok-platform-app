import { useState } from "react";
import styles from "./CustomTextArea.module.css";

const CustomTextArea = ({
  loading,
  label,
  value,
  onChange,
  maxLength,
  isDarkMode,
}) => {
  const [focused, setFocused] = useState(false);

  const handleFocus = () => {
    setFocused(true);
  };

  const handleBlur = () => {
    setFocused(false);
  };

  const handleChange = (event) => {
    const inputValue = event.target.value;
    if (inputValue.length <= maxLength) {
      onChange(event);
    }
  };

  return (
    <div className={styles.textareaWrapper}>
      <label
        className={`${styles.label} ${
          focused || value ? styles.labelActive : ""
        }`}
      >
        {label}
      </label>
      <div className={styles.counter}>{`${value.length}/${maxLength}`}</div>
      <textarea
        disabled={loading}
        value={value}
        className={styles.textarea + ` theme-${isDarkMode ? "dark" : "white"}`}
        onChange={handleChange}
        onFocus={handleFocus}
        onBlur={handleBlur}
      />
    </div>
  );
};

export default CustomTextArea;
