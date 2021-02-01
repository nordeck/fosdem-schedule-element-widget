import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import debounceAction from 'debounce-action';
import { AppThunk, RootState } from '../store';

export interface IScheduleEvent {
  id: string,
  start: string,
  end: string,
  slug: string,
  title: string,
  subtitle?: string,
  room?: string
}

interface ScheduleState {
  list: Array<IScheduleEvent>;
  start: string,
  end: string,
  isLoading: boolean;
  error: string | null;
}

const initialState: ScheduleState = {
  end: new Date().toISOString(),
  error: null,
  isLoading: true,
  list: [],
  start: new Date().toISOString()
};

const getISODate = (date: Date = new Date()) => {
  const options = {
    day: 'numeric',
    month: 'numeric',
    timeZone: 'Europe/Berlin',
    year: 'numeric'
  };
  const formatter = new Intl.DateTimeFormat(['sv'], options);
  return formatter.format(date);
};

const mapEvents = (elements: NodeListOf<Element>, currentDate: string) => {
  return Array.from(elements.values()).map((el) => {
    const startTime = el.querySelector('start')?.textContent;
    const duration = el.querySelector('duration')?.textContent || '';
    const durationMatch = /([\d]+):([\d]+)/.exec(duration);
    const durationHours = (durationMatch && durationMatch.length > 1 && Number.parseInt(durationMatch[1])) || 0;
    const durationMinutes = ((durationMatch && durationMatch.length > 2 && Number.parseInt(durationMatch[2])) || 0) + (durationHours * 60);
    const start = startTime ? new Date(`${currentDate}T${startTime}+01:00`) : new Date();
    const end = new Date(start);
    end.setMinutes(start.getMinutes() + durationMinutes);
    return (
      {
        end: end.toISOString(),
        id: el.id,
        room: el.querySelector('room')?.textContent,
        slug: el.querySelector('slug')?.textContent,
        start: start.toISOString(),
        subtitle: el.querySelector('subtitle')?.textContent,
        title: el.querySelector('title')?.textContent
      } as IScheduleEvent
    );
  });
};

const parseConferenceDates = (startDate?: string | null, endDate?: string | null): { start: Date, end: Date, current: Date } => {
  const currentDate = new Date();
  const start = startDate ? new Date(`${startDate}T00:00+01:00`) : new Date();
  const end = endDate ? new Date(`${endDate}T23:59:59+01:00`) : new Date();
  if (currentDate <= start) {
    return (
      {
        current: start,
        end,
        start
      }
    );
  }
  if (currentDate >= end) {
    return (
      {
        current: end,
        end,
        start
      }
    );
  };
  return (
    {
      current: new Date(),
      end,
      start
    }
  );
};

export const scheduleSlice = createSlice({
  initialState,
  name: 'schedule',
  reducers: {
    setError: (state, action: PayloadAction<string>) => {
      state.isLoading = false;
      state.error = action.payload;
    },
    setIsLoading: (state, action: PayloadAction<boolean>) => {
      state.isLoading = action.payload;
    },
    setSchedule: (state, action: PayloadAction<{ events: Array<IScheduleEvent>, start: string, end: string }>) => {
      state.list = action.payload.events;
      state.start = action.payload.start;
      state.end = action.payload.end;
      state.error = null;
    }
  }
});

export const getScheduleAsync = debounceAction((roomName: string): AppThunk => {
  return async (dispatch: any) => {
    dispatch(scheduleSlice.actions.setIsLoading(true));
    try {
      const response = await fetch('https://fosdem.org/2021/schedule/xml');
      if (response.ok) {
        const xmlStr = await response.text();
        const parser = new DOMParser();
        const dom = parser.parseFromString(xmlStr, 'application/xml');
        const confStart = dom.querySelector('conference start')?.textContent;
        const confEnd = dom.querySelector('conference end')?.textContent;
        const { start, end, current } = parseConferenceDates(confStart, confEnd);
        const currentDate = getISODate(current);
        const events = dom.querySelectorAll(`day[date='${currentDate}'] room${roomName ? `[name='${roomName}']` : ''} event`);
        dispatch(scheduleSlice.actions.setSchedule({
          end: end.toISOString(),
          events: mapEvents(events, currentDate),
          start: start.toISOString()
        }));
      }
    } catch (err) {
      dispatch(scheduleSlice.actions.setError(err.toString()));
    }
    dispatch(scheduleSlice.actions.setIsLoading(false));
  };
}, 400);

export const selectSchedule = (state: RootState) => state.schedule.list;
export const selectIsLoading = (state: RootState) => state.schedule.isLoading;
export const selectError = (state: RootState) => state.schedule.error;

export default scheduleSlice.reducer;
