import { NextResponse } from "next/server";

export async function GET(request: Request) {
  console.log("Proxy GET /api/proxy-tariffs вызван из:", request.headers.get("referer") || "неизвестно");

  try {
    const res = await fetch("https://t-core.fit-hub.pro/Test/GetTariffs", {
      method: "GET",
      headers: {
        Accept: "application/json",
      },
      cache: "no-store",
    });

    console.log("Backend status:", res.status, res.statusText);

    if (!res.ok) {
      const text = await res.text();
      console.error("Backend не ok:", res.status, text);
      throw new Error(`Backend вернул ${res.status}`);
    }

    const data = await res.json();
    console.log("Получены данные от backend:", data.length, "тарифов");

    return NextResponse.json(data);
  } catch (error) {
    console.error("Ошибка в proxy:", error);
    return NextResponse.json(
      { error: "Не удалось получить тарифы", details: (error as Error).message },
      { status: 500 },
    );
  }
}
