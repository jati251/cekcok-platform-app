import { useState } from "react";
import styles from "./CustomTextArea.module.css";

const CustomTextArea = ({ label, value, onChange }) => {
  const [focused, setFocused] = useState(false);

  const handleFocus = () => {
    setFocused(true);
  };

  const handleBlur = () => {
    setFocused(false);
  };

  const handleChange = (event) => {
    const inputValue = event.target.value;
    if (inputValue.length <= 160) {
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
      <div className={styles.counter}>{`${value.length}/160`}</div>
      <textarea
        className={styles.textarea}
        value={value}
        onChange={handleChange}
        onFocus={handleFocus}
        onBlur={handleBlur}
      />
    </div>
  );
};

export default CustomTextArea;
