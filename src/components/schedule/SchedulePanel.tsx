import React from 'react';
import { Grid, Loader } from 'semantic-ui-react';
import styled from 'styled-components';
import { useWidget } from '../common/WidgetProvider';
import EventList from './EventList';

const ContentGrid = styled(Grid)`
  margin: 0 !important;
  height: 100vh;
  overflow: visible;
  flex-direction: column !important;
  flex-wrap: nowrap !important;

  .row {
    padding-left: 20px;
    padding-right: 20px;
  }

  @media only screen and (min-width: 1200px) {
    &.ui.grid.container {
      width: calc( 870px + 2rem ) !important;
      > div {
        padding-left: 40px !important;
        padding-right: 40px !important;
      }
    }
  }
  @media only screen and (max-width: 767px) {
    &.ui.grid.container {
      margin: 0 !important;
    }
  }
`;

const SchedulePanel = () => {
  const widget = useWidget();

  return (
    widget.isInitializing ?
      <Loader /> :
      <ContentGrid
        container
      >
        <Grid.Row
          centered
          style={{
            alignContent: 'start',
            flexGrow: 1,
            minHeight: '175px',
            overflowY: 'auto',
            paddingBottom: 2,
            paddingTop: 0
          }}
          tabIndex={0}
        >
          <EventList />
        </Grid.Row>
      </ContentGrid>
  );
};

export default SchedulePanel;
