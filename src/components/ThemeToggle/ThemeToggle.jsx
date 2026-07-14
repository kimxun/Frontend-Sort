import { FaMoon, FaSun } from "react-icons/fa";
import "./ThemeToggle.css";

export default function ThemeToggle({ darkMode, onToggle, className = "" }) {
  return (
    <button
      type="button"
      className={`theme-toggle ${className}`.trim()}
      onClick={onToggle}
      aria-label={darkMode ? "Chuyển sang chế độ sáng" : "Chuyển sang chế độ tối"}
      title={darkMode ? "Chế độ sáng" : "Chế độ tối"}
    >
      {darkMode ? <FaSun /> : <FaMoon />}
    </button>
  );
}
