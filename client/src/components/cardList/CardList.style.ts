import styled from "styled-components";

interface CardProps {
  width?: string;
}

export const CardBox = styled.div<CardProps>`
  margin: 10px;
  width:  ${({ width }) => width}; 
  height: 80%;
  box-shadow: 0 8px 20px rgb(0 0 0 / 15%);
  border-radius: 6px;
  padding: 10px;
  background: white;
  display: flex;
  flex-direction: column;
  align-items: center;
`;

export const Title = styled.div`
  font-size: 15px;
  width: 100%;
  text-align: left;
  margin-bottom: 15px;
  font-weight: bold;
`;