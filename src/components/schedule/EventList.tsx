import { AnimatePresence, motion } from 'framer-motion';
import React, { useCallback, useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Divider } from 'semantic-ui-react';
import Message from 'semantic-ui-react/dist/commonjs/collections/Message';
import List from 'semantic-ui-react/dist/commonjs/elements/List';
import {
  getScheduleAsync,
  IScheduleEvent,
  selectError,
  selectIsLoading,
  selectSchedule
} from '../../reducer/schedulesSlice';
import EventView from './EventView';

interface IGroupHeaderProps {
  schedule: Array<IScheduleEvent>;
  index: number;
}

const getRoomName = () => {
  const urlParams = new URLSearchParams(window.location.search);
  return urlParams.get('room');
};

const GroupHeader = ({ schedule, index }: IGroupHeaderProps) => {
  const currentEvent = schedule[index];
  if (index > 0 && currentEvent.room === schedule[index - 1].room) {
    return null;
  }
  return (
    <Divider horizontal>
      {currentEvent.room}
    </Divider>
  );
};

const EventList = () => {
  const isLoading = useSelector(selectIsLoading);
  const error = useSelector(selectError);
  const schedule = useSelector(selectSchedule);
  const dispatch = useDispatch();
  const [room, setRoom] = useState<string | null>(null);

  const fetchData = useCallback(async () => {
    const selectedRoom = getRoomName();
    setRoom(selectedRoom);
    dispatch(getScheduleAsync(selectedRoom));
  }, [dispatch]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);
  return (
    <AnimatePresence exitBeforeEnter>
      {
        ((isLoading || !schedule || !schedule.length) ?
          (error && !isLoading ?
            <motion.div
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              initial={{ opacity: 0 }}
              key="message"
              style={{ marginTop: 15 }}
            >
              <Message
                content={`${error}. Dismiss this message to retry.`}
                header="Error"
                icon="exclamation circle"
                negative
                onDismiss={() => fetchData()}
              />
            </motion.div> :
            <motion.div
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              initial={{ opacity: 0 }}
              key="not-found"
              style={{ marginTop: 15 }}
            >
              <Message
                header={isLoading ? 'Loading...' : 'No events scheduled'}
                icon={isLoading ? {
                  loading: true,
                  name: 'circle notch'
                } : { name: 'calendar times outline' }}
                size="small"
              >
              </Message>
            </motion.div>
          ) :
          <motion.div
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            initial={{ opacity: 0 }}
            key="list"
          >
            <List
              style={{
                marginTop: 15,
                textAlign: 'left'
              }}
            >
              {schedule.map((event, index) => (
                <List.Item key={`event${event.id}`}>
                  {room ? null :
                    <GroupHeader
                      index={index}
                      schedule={schedule}
                    />
                  }
                  <EventView event={event} />
                </List.Item>
              ))}
            </List>
          </motion.div>
        )
      }
    </AnimatePresence>
  );
};

export default EventList;
