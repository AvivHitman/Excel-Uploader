import React, { ChangeEvent, useState } from "react";
import * as S from "./Header.style";
import { UploadFile } from "../uploadFile/UploadFile";

type Props = {
    title: string;
    userId: string;
};

export const Header = ({ title, userId }: Props) => {
    const [isUploadVisible, setIsUploadVisible] = useState(false);

    return (
        <S.Header>
            <S.Title>{title}</S.Title>
            {<UploadFile userId={userId} />}
        </S.Header>
    );
};
