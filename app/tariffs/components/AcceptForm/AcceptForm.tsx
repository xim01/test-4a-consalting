import CheckIcon from "../svg/CheckIcon";
import "./AcceptForm.css";

interface AcceptFormProps {
  checked: boolean;
  onChange: (checked: boolean) => void;
  acceptText: React.ReactNode;
  hasError?: boolean;
}

export default function AcceptForm({ checked, onChange, acceptText, hasError = false }: AcceptFormProps) {
  return (
    <label className={`accept-form ${hasError ? "has-error" : ""}`}>
      <input
        type="checkbox"
        className="accept-checkbox"
        checked={checked}
        onChange={(e) => onChange(e.target.checked)}
      />
      <span className="custom-checkbox">
        <CheckIcon />
      </span>
      <span className="accept-text">{acceptText}</span>
    </label>
  );
}
