import { Link, useLocation, useParams } from "react-router-dom";
import { io } from 'socket.io-client';
import { CardList } from "../../components/cardList/CardList"
import { Header } from "../../components/header/Header"
import * as S from "./FileUploader.style";
import { useAppDispatch, useAppSelector } from "../../store/hooks";
import { useEffect, useState } from "react";
import { deleteFile, downloadFile, getCustomersByFileId, getFilesByUserId } from "../../store/fileSlice";
import { selectCustomers, selectUserFiles } from "../../store";
import { TableModal } from "../../components/tableModal/TableModal";


export const FileUploader = () => {
    const [showInfoModal, setShowInfoModal] = useState(false);
    const { id = "" } = useParams();
    const location = useLocation();
    const dispatch = useAppDispatch();
    const userFiles = useAppSelector(selectUserFiles);
    const customers = useAppSelector(selectCustomers);

    const UploadedUserFiles = userFiles.filter(file => file.f_status === "uploaded").map(file => ({ name: file.f_name, id: file.f_id }));
    const pendingUserFiles = userFiles.filter(file => file.f_status === "pending").map(file => ({ name: file.f_name, id: file.f_id }));
    const UploadingUserFiles = userFiles.filter(file => file.f_status === "uploading").map(file => ({ name: file.f_name, id: file.f_id }));


    const { user } = location.state || {};
    const title = `Hello ${user?.u_name || "User"}`;

    useEffect(() => {
        dispatch(getFilesByUserId(id));
    }, [dispatch, id]);


    useEffect(() => {
        const socket = io('http://localhost:3000');

        socket.on(`file-status-update-${id}`, (data: { fileId: number, status: string }) => {
            dispatch(getFilesByUserId(id));
        });

        return () => {
            socket.off(`file-status-update-${id}`);
            socket.disconnect();
        };
    }, [id, dispatch]);


    const handleCloseModal = () => {
        setShowInfoModal(false);
    };

    const handleOnDelete = (id: string) => {
        dispatch(deleteFile(id));
    }

    const handleOnInfo = (id: string) => {
        dispatch(getCustomersByFileId(id));
        setShowInfoModal(true);
    }

    const handleOnDownload = async (id: string) => {
        try {
            const response = await dispatch(downloadFile(id)).unwrap();
            const url = window.URL.createObjectURL(new Blob([response.data]));
            const link = document.createElement('a');
            link.href = url;

            const filename = userFiles.find(file => file.f_id === id)?.f_name || `file_${id}.xlsx`;

            link.setAttribute('download', filename);
            document.body.appendChild(link);
            link.click();

            // Cleanup
            link.parentNode?.removeChild(link);
            window.URL.revokeObjectURL(url);
        } catch (err) {
            console.error("Failed to download file:", err);
        }
    }

    return (
        <>
            <Link to="/">← Back to users</Link>
            <Header title={title} userId={id}></Header>
            {showInfoModal && <TableModal onClose={handleCloseModal} columns={["id", 'name', 'email', "Israeli ID", "phone"]}
                rows={customers} />}
            <S.ListsBox>
                <S.UplodedList>
                    {UploadingUserFiles.length > 0 &&
                        <CardList
                            title="Uploading Files"
                            titles={UploadingUserFiles}
                            icon={"file"}
                            haveButtons={false} />}

                    <CardList
                        title="Uploaded Files"
                        titles={UploadedUserFiles}
                        icon={"file"}
                        haveButtons={true}
                        onInfoClicked={handleOnInfo}
                        onDeleteClicked={handleOnDelete}
                        onDownloadClicked={handleOnDownload} />
                </S.UplodedList>
                <CardList
                    title="Pending Files"
                    width="30%"
                    titles={pendingUserFiles}
                    icon={"wait"}
                    haveButtons={false} />
            </S.ListsBox>
        </>
    )
}
