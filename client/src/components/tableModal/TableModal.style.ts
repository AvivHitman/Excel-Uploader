import styled from "styled-components";

export const Modal = styled.div`
  position: fixed;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);
  height: auto;
  width: 70%;
  align-items: center;
  background-color: whitesmoke;
  border-radius: 10%;
  box-shadow: 0 8px 20px rgb(0 0 0 / 15%);
  display: flex;
  flex-direction: column;
  padding: 50px;  /* Add padding to ensure content doesn't overlap with the close button */
  max-height: 80%; /* Limit the height to prevent overflow */
  overflow-y: auto; /* Scroll if the content exceeds the modal size */
`;

export const CloseButton = styled.button`
  position: absolute;
  bottom: 10px;
  right: 10px;
  margin: 5px;
  background-color: transparent;
  color: grey;
  border: none;
  cursor: pointer;
  font-size: 16px;

  &:hover {
    color: black;
  }
`;