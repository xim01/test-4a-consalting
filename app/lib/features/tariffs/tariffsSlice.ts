// src/lib/features/tariffs/tariffsSlice.ts
import { createSlice } from "@reduxjs/toolkit";
import { RootState } from "app/lib/store";

interface TariffsState {
  promoSecondsLeft: number;
  promoEndTimestamp: number | null;
}

const initialState: TariffsState = {
  promoSecondsLeft: 0,
  promoEndTimestamp: null,
};

const tariffsSlice = createSlice({
  name: "tariffs",
  initialState,
  reducers: {
    startPromoTimer(state, actions) {
      const durationSec = actions.payload;
      const now = Date.now();
      const endTime = now + durationSec * 1000;

      state.promoEndTimestamp = endTime;
      state.promoSecondsLeft = durationSec;
    },

    updatePromoSeconds(state) {
      if (!state.promoEndTimestamp) {
        state.promoSecondsLeft = 0;
        return;
      }

      const now = Date.now();
      const diffMs = state.promoEndTimestamp - now;
      const secondsLeft = Math.max(0, Math.floor(diffMs / 1000));

      state.promoSecondsLeft = secondsLeft;

      if (secondsLeft <= 0) {
        state.promoEndTimestamp = null;
      }
    },

    // на всякий случай — принудительная остановка
    stopPromoTimer(state) {
      state.promoSecondsLeft = 0;
      state.promoEndTimestamp = null;
    },
  },
});

export const { startPromoTimer, updatePromoSeconds, stopPromoTimer } = tariffsSlice.actions;

export default tariffsSlice.reducer;

// Селекторы
export const selectPromoSecondsLeft = (state: RootState) => state.tariffs.promoSecondsLeft;

export const selectIsPromoActive = (state: RootState) => state.tariffs.promoSecondsLeft > 0;
