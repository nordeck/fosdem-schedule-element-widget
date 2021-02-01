import React, { useCallback, useEffect, useState } from 'react';
import Moment from 'react-moment';
import { Button, Card } from 'semantic-ui-react';
import { ElementWidgetCapabilities } from '../../common/constants';
import { IScheduleEvent } from '../../reducer/schedulesSlice';
import ShareUrlModal from '../common/ShareUrlModal';
import TimeDistance from '../common/TimeDistance';
import { useWidget } from '../common/WidgetProvider';

interface IEventViewProps {
  event: IScheduleEvent,
}

enum Actions {
  None = 'none',
  ShareUrl = 'share_url',
  ShowDetails = 'show_details'
}

const EventView = ({ event }: IEventViewProps) => {
  const [action, setAction] = useState(Actions.None);
  const [url, setUrl] = useState<string | undefined>();
  const widget = useWidget();

  useEffect(() => {
    setUrl(`https://fosdem.org/2021/schedule/event/${event.slug}`);
  }, [widget, event]);

  const openEvent = useCallback(() => {
    if (url) {
      if (widget.isReady) {
        widget.widgetApi.transport.send(ElementWidgetCapabilities.CanChangeViewedRoom, { room_id: `#${event.slug}` });
      } else {
        window.open(url);
      }
    }
  }, [url, widget, event]);

  const openShareModal = useCallback(async (ev: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
    ev.stopPropagation();
    ev.preventDefault();
    const data = {
      text: event.subtitle,
      title: event.title,
      url
    };
    if (navigator.share) {
      navigator.share(data).catch(console.error);
    } else {
      setAction(Actions.ShareUrl);
    }
  }, [url, event]);

  return (
    <Card
      aria-describedby={`${event.id}-description`}
      aria-labelledby={`${event.id}-header`}
      role="region"
    >
      <Card.Content>
        <Card.Header
          id={`${event.id}-header`}
        >
          {event.title}
        </Card.Header>
        <Card.Meta>
          <Moment
            format="LT"
            local
          >
            {event.start}
          </Moment>
          {' - '}
          <Moment
            format="LT"
            local
          >
            {event.end}
          </Moment>
        </Card.Meta>
        {event.subtitle ?
          <Card.Description id={`${event.id}-description`}>
            {event.subtitle}
          </Card.Description> :
          null
        }
      </Card.Content>
      <Card.Content extra>
        <Button.Group
          basic
          size="tiny"
        >
          <Button
            active={action === Actions.ShareUrl}
            aria-label="share event link"
            circular
            icon="alternate share"
            onClick={openShareModal}
          />
          <Button
            active={action === Actions.ShowDetails}
            aria-label="show details"
            circular
            icon="info"
            onClick={openEvent}
          />
        </Button.Group>
        <TimeDistance
          date={event.start}
          endDate={event.end}
        />
        {url ?
          <ShareUrlModal
            onClose={() => setAction(Actions.None)}
            open={action === Actions.ShareUrl}
            url={url}
          />
          : null
        }
      </Card.Content>
    </Card>
  );
};

export default EventView;
