"use client";

import { useGetTariffsQuery } from "app/lib/features/api/apiSlice";
import { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { selectIsPromoActive, selectPromoSecondsLeft, updatePromoSeconds } from "app/lib/features/tariffs/tariffsSlice";
import TariffsGrid from "./components/TariffsGrid/TariffsGrid";
import AcceptForm from "./components/AcceptForm/AcceptForm";
import Card1 from "./components/Card1/Card1";
import Card2 from "./components/Card2/Card2";
import Card3 from "./components/Card3/Card3";
import type { Tariff } from "app/types/tariff";
import "./tariffs.css";
import ImgBlock from "./components/ImgBlock/ImgBlock";
import LoadingBlock from "./components/LoadingBlock/LoadingBlock";
import { safeParseTariffs } from "app/lib/utils";
import { texts } from "./texts";
import { Variants } from "framer-motion";

export default function TariffsPage() {
  const dispatch = useDispatch();
  const { data, isLoading, isFetching, isError, error } = useGetTariffsQuery();
  const isPromoActive = useSelector(selectIsPromoActive);
  const promoSecondsLeft = useSelector(selectPromoSecondsLeft);

  const [accepted, setAccepted] = useState<boolean>(false);
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);
  const [buyAttempted, setBuyAttempted] = useState<boolean>(false);

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
  }, [allTariffs, hasTariffs, selectedIndex]);

  const handleSelect = (originalIndex: number) => {
    setSelectedIndex(originalIndex);
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
    alert("Молодец! ты выбрал:" + selected.period);
  };

  return (
    <div className="tariffs-container">
      <h1 className="tariffs-title">{texts.title}</h1>

      <div className="tariffs-mid-container">
        <div className="tariffs-mid-container__left">
          <ImgBlock isPromoActive={isPromoActive} />
        </div>

        <div className="tariffs-mid-container__right">
          {isLoadingTariffs ? (
            <LoadingBlock text={texts.loading} />
          ) : (
            <>
              {hasTariffs ? (
                <TariffsGrid
                  bestLabelText={texts.bestLabelText}
                  tariffs={allTariffs}
                  selectedIndex={selectedIndex}
                  onSelect={handleSelect}
                  errorFlash={buyAttempted && selectedIndex === null}
                  isPromoActive={isPromoActive}
                />
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
