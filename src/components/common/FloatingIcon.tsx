
import Icon from 'semantic-ui-react/dist/commonjs/elements/Icon';
import styled, { keyframes } from 'styled-components';

const iconFloatAnimation = keyframes`
  0% {
    transform: translateY(0);
  }
  50% {
    transform: translateY(10px)
  }
  100% {
    transform: translateY(0px)
  }
`;

const FloatingIcon = styled(Icon)`
  margin-bottom: 0.5em !important;
   display: inline-block;

  @media (prefers-reduced-motion: no-preference) {
    animation: ${iconFloatAnimation} infinite 3s ease-in-out;
  }
`;

export default FloatingIcon;
