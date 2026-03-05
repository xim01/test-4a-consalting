"use client";

import { motion, AnimatePresence, Variants } from "framer-motion";
import "./TariffsGrid.css";
import type { Tariff } from "app/types/tariff";

interface TariffsGridProps {
  tariffs: Tariff[]; // оригинальный массив из allTariffs
  bestLabelText: string;
  selectedIndex: number | null; // индекс в оригинальном массиве
  onSelect: (originalIndex: number) => void;
  errorFlash: boolean;
  isPromoActive: boolean;
}

export default function TariffsGrid({
  tariffs,
  bestLabelText,
  selectedIndex,
  onSelect,
  errorFlash,
  isPromoActive,
}: TariffsGridProps) {
  const sortedWithIndices = [...tariffs]
    .map((tariff, originalIndex) => ({ tariff, originalIndex }))
    .sort((a, b) => b.tariff.full_price - a.tariff.full_price);

  const cardVariants: Variants = {
    hidden: { opacity: 0, y: 40, scale: 0.92 },
    visible: (custom: number) => ({
      opacity: 1,
      y: 0,
      scale: 1,
      transition: {
        delay: custom * 0.1,
        duration: 0.4,
        ease: [0.4, 0, 0.2, 1],
      },
    }),
    exit: {
      opacity: 0,
      y: -30,
      scale: 0.95,
      transition: { duration: 0.4, ease: "easeIn" },
    },
  } as const;

  const gridVariants: Variants = {
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
  } as const;
  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={isPromoActive ? "promo-mode" : "regular-mode"}
        variants={gridVariants}
        initial="hidden"
        animate="visible"
        exit="exit"
      >
        <div className="tariffs-grid">
          <AnimatePresence mode="popLayout">
            {sortedWithIndices.map(({ tariff, originalIndex }, sortedPosition) => {
              const isSelected = selectedIndex === originalIndex;
              const shouldFlash = errorFlash;

              let displayPrice = tariff.price;
              let displayOldPrice: number | null = null;
              let discountText = "";

              if (isPromoActive && tariff.full_price && tariff.full_price > tariff.price) {
                displayPrice = tariff.price;
                displayOldPrice = tariff.full_price;
                const percent = Math.round(((tariff.full_price - tariff.price) / tariff.full_price) * 100);
                discountText = `−${percent}%`;
              } else {
                displayPrice = tariff.full_price && tariff.full_price > 0 ? tariff.full_price : tariff.price;
                displayOldPrice = null;
                discountText = "";
              }

              const key = `tariff-${originalIndex}-${isPromoActive ? "p" : "r"}`;

              return (
                <motion.div
                  key={key}
                  custom={sortedPosition} // для анимации задержки — используем позицию в отсортированном списке
                  variants={cardVariants}
                  initial="hidden"
                  animate="visible"
                  exit="exit"
                  layout
                  className={`
                    tariff-card
                    ${tariff.is_best ? "best full-width" : ""}
                    ${isSelected ? "selected" : ""}
                    ${shouldFlash ? "error-flash" : ""}
                  `}
                  onClick={() => onSelect(originalIndex)}
                  role="button"
                  tabIndex={0}
                >
                  <div className="tariff-card__left__inner">
                    <div className="tariff-card__left">
                      <h2 className="tariff-period">{tariff.period}</h2>
                      <div className="tariff-price">{displayPrice}₽</div>
                      {displayOldPrice !== null && <div className="tariff-old-price">{displayOldPrice} ₽</div>}
                    </div>
                    <div className="tariff-card__right">
                      <p className="tariff-text">{tariff.text}</p>
                    </div>
                  </div>

                  {tariff.is_best && <span className="best-label">{bestLabelText}</span>}
                  {discountText && <div className="tariff-discount">{discountText}</div>}
                </motion.div>
              );
            })}
          </AnimatePresence>
        </div>
      </motion.div>
    </AnimatePresence>
  );
}
