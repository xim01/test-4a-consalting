"use client";

import { motion, AnimatePresence } from "framer-motion";
import "./TariffsGrid.css";
import type { Tariff } from "app/types/tariff";

interface TariffsGridProps {
  tariffs: Tariff[];
  bestLabelText: string;
  selectedIndex: number | null;
  onSelect: (index: number) => void;
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
  const sortedTariffs = [...tariffs].sort((a, b) => b.full_price - a.full_price);

  const cardVariants: any = {
    hidden: { opacity: 0, y: 40, scale: 0.92 },
    visible: (custom: number) => ({
      opacity: 1,
      y: 0,
      scale: 1,
      transition: {
        delay: custom * 0.05,
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
  };

  return (
    <div className="tariffs-grid">
      <AnimatePresence mode="popLayout">
        {sortedTariffs.map((tariff, index) => {
          const isSelected = selectedIndex === index;
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

          const key = `${tariff.id + index}-${isPromoActive ? "promo" : "regular"}`;

          return (
            <motion.div
              key={key}
              custom={index}
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
              onClick={() => onSelect(index)}
              role="button"
              tabIndex={0}
            >
              <div className="tariff-card__left__inner">
                <div className="tariff-card__left">
                  <h2 className="tariff-period">{tariff.period}</h2>
                  <div className="tariff-price">{displayPrice}₽ </div>

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
  );
}
