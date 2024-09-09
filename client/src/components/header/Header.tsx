import * as S from "./Header.style";
import { UploadFile } from "../uploadFile/UploadFile";

type Props = {
    title: string;
    userId: string;
};

export const Header = ({ title, userId }: Props) => {
    return (
        <S.Header>
            <S.Title>{title}</S.Title>
            {<UploadFile userId={userId} />}
        </S.Header>
    );
};
