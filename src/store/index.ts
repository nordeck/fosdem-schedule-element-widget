import { Action, configureStore, ThunkAction } from '@reduxjs/toolkit';
import scheduleReducer from '../reducer/schedulesSlice';

export const store = configureStore({
  reducer: {
    schedule: scheduleReducer
  }
});

export type RootState = ReturnType<typeof store.getState>;
export type AppThunk<ReturnType = void> = ThunkAction<
  ReturnType,
  RootState,
  unknown,
  Action<string>
>;
