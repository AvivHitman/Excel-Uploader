import styled from "styled-components";

export const Title = styled.div`
  font-size: 30px;
  margin: 20px;
  font-weight: bold;
`;

export const UploadButton = styled.button`
  color: grey;
`;

export const Header = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
`;

export const FileInput = styled.input`
  display: none;
`;

export const FileLabel = styled.label`
  display: inline-block;
  background-color: #007bff;
  color: white;
  padding: 10px 20px;
  cursor: pointer;
  border-radius: 5px;
  font-size: 16px;

  &:hover {
    background-color: #0056b3;
  }
`;