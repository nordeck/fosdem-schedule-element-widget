import moment from 'moment';
import React, { useState } from 'react';
import { useInterval } from 'react-use';
import { Icon } from 'semantic-ui-react';
import styled from 'styled-components';

const FlashingLabel = styled.label`
  float: right;
  font-size: 0.8em;
  opacity: 1;
  transition: transform 500ms ease-in-out !important;
  margin-right: 0 !important;
  margin-top: 15px !important;
  transform: scale(1);
`;

interface ITimeDistanceProps {
  date: string
  endDate: string
}

const TimeDistance = ({ date, endDate }: ITimeDistanceProps) => {
  const getTimeData = () => {
    const startDiff = moment(date).diff(moment());
    const duration = moment.duration(startDiff);
    const endDiff = moment(endDate).diff(moment());
    const remainingDuration = moment.duration(endDiff);
    return {
      distance: duration.humanize(true),
      exact: `in ${duration.format('hh:mm:ss')}`,
      hours: duration.asHours(),
      minutes: duration.asMinutes(),
      past: startDiff > endDiff,
      remainingDistance: remainingDuration.humanize(true),
      remainingExact: `ends in ${remainingDuration.format('hh:mm:ss')}`,
      remainingHours: remainingDuration.asHours(),
      remainingMinutes: remainingDuration.asMinutes(),
      remainingSeconds: remainingDuration.asSeconds(),
      seconds: duration.asSeconds()
    };
  };
  const [now, setNow] = useState(getTimeData());
  const [scale, setScale] = useState(1);

  useInterval(
    () => {
      setNow(getTimeData());
    },
    now.hours > 0 || now.remainingHours > 0 ? 1000 : null
  );

  useInterval(
    () => {
      setScale((scale === 1) ? 1.1 : 1);
    },
    now.minutes > 0 && now.minutes <= 5 ? 500 : null
  );

  return (
    ((now.hours <= 8 && now.seconds > 0) || (now.remainingSeconds > 0 && now.seconds < 0)) ?
      <FlashingLabel
        className={`ui horizontal label tiny${(now.remainingMinutes > 0 && now.minutes < 0) ? ' green' : (now.minutes <= 5 ? ((now.seconds < 59) ? ' red' : ' blue') : '')}`}
        style={{
          fontStyle: ((now.remainingMinutes > 0 && now.minutes < 0) ? 'italic' : 'normal'),
          fontWeight: ((now.minutes <= 5 && now.minutes >= 0) ? 'bold' : 'normal'),
          transform: `scale(${((now.minutes <= 5 && now.minutes >= 0) ? scale : 1)})`
        }}
      >
        <Icon
          loading={now.minutes < 0}
          name={now.minutes > 0 ? 'clock outline' : 'circle notch'}
        />
        {(now.remainingMinutes > 0 && now.minutes < 0) ? now.remainingExact : ((now.minutes < 0.99) ? now.exact : now.distance)}
      </FlashingLabel> :
      null
  );
};

export default TimeDistance;
