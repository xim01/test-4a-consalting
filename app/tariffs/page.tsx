"use client";

import { useGetTariffsQuery } from "app/lib/features/api/apiSlice";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useSelector, useDispatch } from "react-redux";

import { selectIsPromoActive, selectPromoSecondsLeft, updatePromoSeconds } from "app/lib/features/tariffs/tariffsSlice";

import TariffsGrid from "./components/TariffsGrid/TariffsGrid";
import Card1 from "./components/Card1/Card1";
import Card2 from "./components/Card2/Card2";
import Card3 from "./components/Card3/Card3";
import AcceptForm from "./components/AcceptForm/AcceptForm";

import type { Tariff } from "app/types/tariff";

import "./tariffs.css";

const texts = {
  guarantee: "гарантия возврата 30 дней",
  guaranteeText:
    "Мы уверены, что наш план сработает для тебя и ты увидишь видимые результаты уже через 4 недели! Мы даже готовы полностью вернуть твои деньги в течение 30 дней с момента покупки, если ты не получишь видимых результатов.",
  betterResult: "Следуя плану на 3 месяца и более, люди получают в 2 раза лучший результат, чем за 1 месяц",
  paymentAgreement:
    "Нажимая кнопку «Купить», Пользователь соглашается на разовое списание денежных средств для получения пожизненного доступа к приложению. Пользователь соглашается, что данные кредитной/дебетовой карты будут сохранены для осуществления покупок дополнительных услуг сервиса в случае желания пользователя.",
  buy: "Купить",
  noTariffs: "Тарифы не найдены",
  errorTariffs: "Ошибка загрузки тарифов",
  loading: "Загружаем тарифы...",
  bestLabelText: "хит!",
  title: (
    <>
      Выбери подходящий для себя <span className="text--orange">тариф</span>
    </>
  ),
  accept: (
    <>
      Я согласен с{" "}
      <a href="#" target="_blank" rel="noopener noreferrer">
        офертой рекуррентных платежей
      </a>{" "}
      и{" "}
      <a href="#" target="_blank" rel="noopener noreferrer">
        Политикой конфиденциальности
      </a>
    </>
  ),
} as const;

export default function TariffsPage() {
  const dispatch = useDispatch();
  const { data, isLoading, isFetching, isError, error } = useGetTariffsQuery();
  const isPromoActive = useSelector(selectIsPromoActive);
  const promoSecondsLeft = useSelector(selectPromoSecondsLeft);

  const [accepted, setAccepted] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);
  const [buyAttempted, setBuyAttempted] = useState(false);

  useEffect(() => {
    if (!isPromoActive) return;
    const interval = setInterval(() => {
      dispatch(updatePromoSeconds());
    }, 1000);
    return () => clearInterval(interval);
  }, [isPromoActive, dispatch]);

  if (isError) {
    console.error("RTK Query error:", error);
    return <div className="error center full-page">{texts.errorTariffs}</div>;
  }

  const allTariffs: Tariff[] = Array.isArray(data) ? data : typeof data === "string" ? safeParseTariffs(data) : [];

  const isLoadingTariffs = isLoading || isFetching;

  const hasTariffs = allTariffs.length > 0;

  useEffect(() => {
    if (selectedIndex !== null || !hasTariffs) return;

    const bestIdx = allTariffs.findIndex((t) => t.is_best);
    if (bestIdx !== -1) {
      setSelectedIndex(bestIdx);
    } else if (allTariffs.length > 0) {
      setSelectedIndex(0);
    }
  }, [allTariffs, hasTariffs, selectedIndex]);

  const handleSelect = (index: number) => {
    setSelectedIndex(index);
    setBuyAttempted(false);
  };

  const handleBuy = () => {
    setBuyAttempted(true);
    if (selectedIndex === null) return;
    if (!accepted) {
      console.warn("Необходимо согласие с условиями");
      return;
    }
    const selected = allTariffs[selectedIndex];
    console.log("Покупка тарифа:", selected);
    alert("Молодец! ");
  };

  const gridVariants: any = {
    hidden: { opacity: 0, y: 40, scale: 0.95 },
    visible: {
      opacity: 1,
      y: 0,
      scale: 1,
      transition: { duration: 0.6, ease: "easeOut" },
    },
    exit: {
      opacity: 0,
      y: -30,
      scale: 0.97,
      transition: { duration: 0.4, ease: "easeIn" },
    },
  };

  return (
    <div className="tariffs-container">
      <h1 className="tariffs-title">{texts.title}</h1>

      <div className="tariffs-mid-container">
        <div className="tariffs-mid-container__left">
          <AnimatePresence mode="wait">
            {isPromoActive ? (
              <motion.img
                key="promo-girl"
                src="/img/fit-girl.webp"
                alt="Сильная девушка"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.7, ease: "easeInOut" }}
                className="promo-image" // если нужно задать размеры/позицию
              />
            ) : (
              <motion.img
                key="normal-man"
                src="/img/fit-man.webp"
                alt="Сильный человек"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.7, ease: "easeInOut" }}
                className="normal-image"
              />
            )}
          </AnimatePresence>
        </div>

        <div className="tariffs-mid-container__right">
          {isLoadingTariffs ? (
            <div className="loading right-part-loading">{texts.loading}</div>
          ) : (
            <>
              {hasTariffs ? (
                <AnimatePresence mode="wait">
                  <motion.div
                    key={isPromoActive ? "promo-mode" : "regular-mode"}
                    variants={gridVariants}
                    initial="hidden"
                    animate="visible"
                    exit="exit"
                  >
                    <TariffsGrid
                      bestLabelText={texts.bestLabelText}
                      tariffs={allTariffs} // всегда передаём все
                      selectedIndex={selectedIndex}
                      onSelect={handleSelect}
                      errorFlash={buyAttempted && selectedIndex === null}
                      isPromoActive={isPromoActive}
                    />
                  </motion.div>
                </AnimatePresence>
              ) : (
                <div className="empty-in-right">{texts.noTariffs}</div>
              )}

              <Card2 text={texts.betterResult} />

              <AcceptForm
                checked={accepted}
                onChange={setAccepted}
                acceptText={texts.accept}
                hasError={buyAttempted && !accepted && selectedIndex !== null}
              />

              <div className="tariffs-accepet-btn-wrapper">
                <button className="btn--orange glow" disabled={isLoadingTariffs} type="button" onClick={handleBuy}>
                  {texts.buy}
                </button>
              </div>

              <Card3 text={texts.paymentAgreement} />
            </>
          )}
        </div>
      </div>

      <div className="tariffs-big-container">
        <Card1 headerText={texts.guarantee} text={texts.guaranteeText} />
      </div>
    </div>
  );
}

function safeParseTariffs(raw: string): Tariff[] {
  try {
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch (err) {
    console.error("Не удалось распарсить тарифы из строки:", err);
    return [];
  }
}
