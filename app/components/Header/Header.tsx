"use client";

import { useEffect, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  selectIsPromoActive,
  selectPromoSecondsLeft,
  startPromoTimer,
  updatePromoSeconds,
} from "app/lib/features/tariffs/tariffsSlice";
import { RootState } from "app/lib/store";
import "./Header.css";
import SvgStar from "./svg/SvgStar";

export default function Header() {
  //component settings
  const redTime = 5;
  const time = 10;
  const textButton = "Запустить";
  const HEADER_TEXT = "Успейте открыть пробную неделю";

  const dispatch = useDispatch();
  const secondsLeft = useSelector(selectPromoSecondsLeft);
  const isActive = useSelector(selectIsPromoActive);
  const promoEndTimestamp = useSelector((state: RootState) => state.tariffs.promoEndTimestamp);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    dispatch(updatePromoSeconds());

    const forceUpdateTimer = setTimeout(() => {
      dispatch(updatePromoSeconds());
    }, 150);

    const savedEnd = localStorage.getItem("promoEndTimestamp");
    if (savedEnd) {
      const endTime = Number(savedEnd);
      const now = Date.now();

      if (endTime > now) {
      } else {
        localStorage.removeItem("promoEndTimestamp");
        dispatch(updatePromoSeconds()); // → обнулит
      }
    }

    intervalRef.current = setInterval(() => {
      dispatch(updatePromoSeconds());
    }, 1000);

    return () => {
      clearInterval(intervalRef.current!);
      clearTimeout(forceUpdateTimer);
    };
  }, [dispatch]);

  //  localStorage
  useEffect(() => {
    if (promoEndTimestamp && secondsLeft > 0) {
      localStorage.setItem("promoEndTimestamp", String(promoEndTimestamp));
    } else if (secondsLeft <= 0 && promoEndTimestamp) {
      localStorage.removeItem("promoEndTimestamp");
    }
  }, [promoEndTimestamp, secondsLeft]);

  const minutes = Math.floor(secondsLeft / 60);
  const secs = secondsLeft % 60;
  const timeStr = `${minutes.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;

  let timerClass = "text--orange";
  if (secondsLeft <= 0) {
    timerClass = "text--white";
  } else if (secondsLeft <= redTime) {
    timerClass = "text--red";
  }

  return (
    <header>
      <div className="header__text">
        <div>{HEADER_TEXT}</div>
      </div>

      <div className={`header__timer ${timerClass}`}>
        {<SvgStar />}
        <div className="header__timer-numbers">
          <div>{timeStr}</div>
        </div>
        {<SvgStar />}
      </div>

      {!isActive && (
        <div className={"promo-btn"}>
          <button onClick={() => dispatch(startPromoTimer(time))} style={{}} className="btn--orange">
            {textButton}
          </button>
        </div>
      )}
    </header>
  );
}
