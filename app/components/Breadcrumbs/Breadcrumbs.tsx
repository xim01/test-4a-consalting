"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import "./Breadcrumbs.css";

export default function Breadcrumbs() {
  const pathname = usePathname();

  const pathSegments = pathname.split("/").filter((segment) => segment !== "");

  if (pathSegments.length === 0) {
    return null;
  }

  return (
    <nav aria-label="Хлебные крошки" className="breadcrumbs">
      <ol>
        <li>
          <Link href="/">Главная</Link>
        </li>

        {pathSegments.map((segment, index) => {
          const href = "/" + pathSegments.slice(0, index + 1).join("/");
          const isLast = index === pathSegments.length - 1;

          // Делаем читаемое название (можно потом заменить на словарь)
          const label = segment.replace(/-/g, " ").replace(/\b\w/g, (l) => l.toUpperCase());

          return (
            <li key={href}>
              <span className="separator">›</span>
              {isLast ? <span aria-current="page">{label}</span> : <Link href={href}>{label}</Link>}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
