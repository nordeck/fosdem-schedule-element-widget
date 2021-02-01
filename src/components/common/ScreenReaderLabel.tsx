import styled from 'styled-components';

/**
 * Label component to use when in need for missing labels in screen reader or any evaluation tool
 */
export const ScreenReaderLabel = styled.label`
  border: 0;
  clip: rect(0 0 0 0);
  height: 1px;
  margin: -1px;
  overflow: hidden;
  padding: 0;
  position: absolute;
  width: 1px;
`;
