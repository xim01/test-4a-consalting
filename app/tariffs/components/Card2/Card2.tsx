// src/components/Card2.tsx
import ExclamationMark from "../svg/ExclamationMark";
import "./Card2.css";

interface Card2Props {
  text: string;
}

export default function Card2({ text }: Card2Props) {
  return (
    <div className="card-2">
      <div className="card-2__exclamation-mark">
        <ExclamationMark />
      </div>
      <div className="card-2__text">{text}</div>
    </div>
  );
}
