import Link from "next/link";
import "./home.css";
export default function Home() {
  return (
    <div className="home-content">
      <h1>Home Page!</h1>
      <p>
        Вернуться к тарифам <Link href="/tariffs">ссылка!</Link>
      </p>
    </div>
  );
}
