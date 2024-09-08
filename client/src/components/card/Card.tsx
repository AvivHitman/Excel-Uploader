import React, { useState } from "react"
import * as S from "./Card.style";
import DescriptionIcon from '@mui/icons-material/Description';
import HourglassTopIcon from '@mui/icons-material/HourglassTop';
import { TableModal } from '../tableModal/TableModal';
import { Customer } from '../../types'

type Props = {
    fileName: string
    id: string
    icon: string
    haveButtons: boolean
    onInfoClicked?: (id: string) => void
    onDownloadClicked?: (id: string) => void
    onDeleteClicked?: (id: string) => void
}

export const Card = ({ fileName, id, icon, haveButtons, onInfoClicked, onDeleteClicked, onDownloadClicked }: Props) => {

    const handleOnInfoClick = () => {
        onInfoClicked && onInfoClicked(id);
    }
    const handleOnDeleteClick = () => {
        onDeleteClicked && onDeleteClicked(id);
    }
    const handleOnDonloadClick = () => {
        onDownloadClicked && onDownloadClicked(id);
    }
    return (
        <S.Card>
            <S.Title>
                {icon === "wait" && <HourglassTopIcon />}
                {icon === "file" && <DescriptionIcon />}
                {fileName}
            </S.Title>
            {haveButtons &&
                <S.Buttons>
                    <S.Button onClick={handleOnInfoClick} color="blue">info</S.Button>
                    <S.Button onClick={handleOnDonloadClick} color="green">download</S.Button>
                    <S.Button onClick={handleOnDeleteClick} color="red">delete</S.Button>
                </S.Buttons>}
        </S.Card>)
}
