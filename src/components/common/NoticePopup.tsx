import React, { useEffect } from 'react';
import { useTimeoutFn } from 'react-use';
import { Popup } from 'semantic-ui-react';

interface INoticePopupProps {
  ms?: number;
  children: React.ReactNode;
  show: boolean;
  onClose: () => void;
  message: string;
  position?:
  | 'top left'
  | 'top right'
  | 'bottom right'
  | 'bottom left'
  | 'right center'
  | 'left center'
  | 'top center'
  | 'bottom center'
}

const NoticePopup = ({ ms = 2000, children, show, onClose, message, position = 'top center' }: INoticePopupProps) => {
  function fn() {
    onClose();
  }

  const [isReady, cancel, reset] = useTimeoutFn(fn, ms);

  useEffect(() => {
    if (show) {
      reset();
    } else {
      cancel();
    }
  }, [show, reset, cancel]);

  const readyState = isReady();

  return (
    <Popup
      content={message}
      open={show && !readyState}
      position={position}
      trigger={children}
    />
  );
};

export default NoticePopup;
