import styled, { keyframes } from 'styled-components';

const rotate = keyframes`
    0% {
      transform: rotate(0deg);
    }
    100% {
      transform: rotate(360deg);
    }
`;


const PageLoader = styled.div`
  position: fixed;
  top: 50%;
  left: 50%;
  margin-left: -20px;
  margin-top: -20px;
  display: block;
  width: 40px;
  height: 40px;
  border-radius: 50%;
  border: 6px solid ${({ theme }) => theme.primaryColor};
  border-color: ${({ theme }) => theme.primaryColor} transparent ${({ theme }) => theme.primaryColor} transparent;
  animation: ${rotate} 1.2s linear infinite;
`;

export default PageLoader;
