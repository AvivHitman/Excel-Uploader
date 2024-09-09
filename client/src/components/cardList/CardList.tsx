import { Card } from '../card/Card';
import * as S from "./CardList.style";

type Title = {
    name: string
    id: string
}
type Props = {
    title: string,
    titles: Title[],
    icon: string,
    haveButtons: boolean
    width?: string
    onInfoClicked?: (id: string) => void
    onDownloadClicked?: (id: string) => void
    onDeleteClicked?: (id: string) => void
}

export const CardList = ({ title, titles, icon, haveButtons, width, onInfoClicked, onDeleteClicked, onDownloadClicked }: Props) => {
    return (
        <S.CardBox width={width}>
            <S.Title>{title}</S.Title>
            {titles.map((title) =>
                <Card
                    icon={icon}
                    fileName={title.name}
                    id={title.id}
                    haveButtons={haveButtons}
                    onInfoClicked={onInfoClicked}
                    onDeleteClicked={onDeleteClicked}
                    onDownloadClicked={onDownloadClicked} />)}
        </S.CardBox>

    )
}
