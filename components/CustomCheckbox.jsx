import React from "react";

const CustomCheckbox = ({ loading, isChecked, setIsChecked }) => {
  const handleCheckboxChange = () => {
    setIsChecked(!isChecked);
  };

  return (
    <div className="flex items-center">
      <input
        disabled={loading}
        type="checkbox"
        id="customCheckbox"
        className="hidden"
        checked={isChecked}
        onChange={handleCheckboxChange}
      />
      <label
        htmlFor="customCheckbox"
        className="flex items-center cursor-pointer"
      >
        <div className="w-6 h-6 flex items-center justify-center border border-gray-400 rounded-md bg-black transition-all">
          <svg
            className={`w-4 h-4 text-white ${isChecked ? "block" : "hidden"} `}
            viewBox="0 0 24 24"
            fill="none"
          >
            <path stroke="currentColor" strokeWidth="2" d="M5 13l4 4L19 7" />
          </svg>
        </div>
        <span className="ml-3 ">Sembunyikan Nama</span>
      </label>
    </div>
  );
};

export default CustomCheckbox;
