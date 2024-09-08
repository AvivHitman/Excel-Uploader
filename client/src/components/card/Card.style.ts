import styled from "styled-components";

interface ButtonProps {
  color?: string;
}

export const Card = styled.div`
  font-family: "Verdana", sans-serif;
  margin: 10px;
  width: 90%;
  height: 30px;
  box-shadow: 0 8px 20px rgb(0 0 0 / 15%);
  border-radius: 6px;
  padding: 10px;
  background: white;
  display: flex;
  align-items: center;
  justify-content: space-between;
`;

export const Buttons = styled.div`
margin: 2px;
  display: flex;
`;

export const Title = styled.div`
    font-size: 12px;
    display: flex;
    align-items: center;
    justify-content: space-between;

`;

export const Button = styled.button<ButtonProps>`
    font-size: 12px;
    margin: 1px;
    color:  ${({ color }) => color}; 
`;