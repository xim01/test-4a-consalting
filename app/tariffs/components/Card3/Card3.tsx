// src/components/Card3.tsx
import "./Card3.css";

interface Card3Props {
  text: string;
}

export default function Card3({ text }: Card3Props) {
  return (
    <div className="card-3">
      <div className="card-3__text">{text}</div>
    </div>
  );
}
