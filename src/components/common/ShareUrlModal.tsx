import React, { useEffect, useState } from 'react';
import { useCopyToClipboard } from 'react-use';
import { Input, Message, Modal, TransitionablePortal } from 'semantic-ui-react';
import NoticePopup from './NoticePopup';

interface IShareUrlModalProps {
  open: boolean;
  onClose: () => void;
  url: string;
}

const ShareUrlModal = ({ open, onClose, url }: IShareUrlModalProps) => {
  const [state, copyToClipboard] = useCopyToClipboard();
  const [isCopied, setIsCopied] = useState(false);

  useEffect(() => {
    if (!isCopied && state.value) {
      state.value = undefined;
      setIsCopied(true);
    }
  }, [state, isCopied]);

  return (
    <TransitionablePortal open={open}>
      <Modal
        basic
        closeOnEscape
        onClose={onClose}
        open
      >
        <Modal.Content>
          <NoticePopup
            message="Link has been copied to clipboard!"
            onClose={() => {
              setIsCopied(false);
            }}
            show={isCopied}
          >
            <Input
              action={{
                content: 'Copy',
                icon: 'copy',
                labelPosition: 'right',
                onClick: (ev: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
                  ev.preventDefault();
                  ev.stopPropagation();
                  copyToClipboard(url);
                },
                primary: true
              }}
              aria-label="Copy event link to share"
              fluid
              readOnly
              value={url}
            />
          </NoticePopup>
          {state.error ? <Message negative>
            <p>
              {state.error}
            </p>
          </Message> : null}
        </Modal.Content>
      </Modal>
    </TransitionablePortal>
  );
};

export default ShareUrlModal;
