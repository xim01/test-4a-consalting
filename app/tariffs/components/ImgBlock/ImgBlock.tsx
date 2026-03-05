import { AnimatePresence, motion } from "framer-motion";

export default function ImgBlock({ isPromoActive }: { isPromoActive: boolean }) {
  return (
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
          className="promo-image"
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
  );
}
