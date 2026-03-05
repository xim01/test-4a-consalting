// src/components/Card1.tsx
import "./Card1.css";

interface Card1Props {
  headerText: string;
  text: string;
}

export default function Card1({ headerText, text }: Card1Props) {
  return (
    <div className="card-1">
      <div className="card-1__header-text">{headerText}</div>
      <div className="card-1__text">{text}</div>
    </div>
  );
}
