import styled from "styled-components";

interface LabelProps {
    color?: string;
}

export const Label = styled.label<LabelProps>`
    font-size: 12px;
    padding: 5px;
    color:  ${({ color }) => color}; 
`;