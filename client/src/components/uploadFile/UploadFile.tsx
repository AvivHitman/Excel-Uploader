import { useState, ChangeEvent } from 'react';
import { useAppDispatch } from '../../store/hooks';
import { uploadFile } from '../../store/fileSlice';
import * as S from "./UploadFile.style";

type Props = {
    userId: string;
};

export const UploadFile = ({ userId }: Props) => {
    const [file, setFile] = useState<File | null>(null);
    const [error, setError] = useState<string | null>(null);
    const dispatch = useAppDispatch();

    const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files.length > 0) {
            const selectedFile = e.target.files[0];
            const allowedTypes = [
                'application/vnd.ms-excel', // .xls
                'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet', // .xlsx
            ];

            if (!allowedTypes.includes(selectedFile.type)) {
                setError('Only Excel files are allowed');
                setFile(null);
                return;
            }

            setError(null);
            setFile(selectedFile);
        }
    };

    const handleUpload = async () => {
        if (file) {
            const formData = new FormData();
            formData.append('file', file);
            formData.append('userId', userId);
            dispatch(uploadFile(formData));
            setFile(null);
        }
    };

    const triggerFileInput = () => {
        document.getElementById("fileInput")?.click();
    };

    return (
        <div>
            <input id="fileInput" type="file" onChange={handleFileChange} style={{ display: "none" }} />
            <button onClick={triggerFileInput}>
                Choose File to Upload
            </button>
            {file && <S.Label color="grey">{file.name} selected</S.Label>}
            {error && <S.Label color="red">{error}</S.Label>}
            {file && <button onClick={handleUpload}>Upload</button>}
        </div>
    );
};
