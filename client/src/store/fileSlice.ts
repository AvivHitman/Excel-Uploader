import axios from "axios";
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { Customer, File } from "../types";

const serverUrl = "http://localhost:3000/files";

type FileState = {
    userFiles: File[];
    customers: Customer[]
};

const initialState: FileState = {
    userFiles: [],
    customers: []
};

export const uploadFile = createAsyncThunk(
    "files/upload",
    async (file: any) => {
        const response = await axios.post(`${serverUrl}/upload`, file);
        return response.data;
    }
);

export const deleteFile = createAsyncThunk(
    "files/delete",
    async (id: string) => {
        const response = await axios.delete(`${serverUrl}/${id}`);
        return response.data;
    }
);

export const downloadFile = createAsyncThunk(
    "files/download",
    async (id: string) => {
        const response = await axios.get(`${serverUrl}/download/${id}`, {
            responseType: 'blob',
        });
        return response;
    }
);

export const getFilesByUserId = createAsyncThunk(
    "files/user",
    async (id: string) => {
        const response = await axios.get(`${serverUrl}/user/${id}`);
        return response.data;
    }
);

export const getCustomersByFileId = createAsyncThunk(
    "files/:id/customers",
    async (id: string) => {
        const response = await axios.get(`${serverUrl}/${id}/customers`);
        return response.data;
    }
);
const fileSlice = createSlice({
    name: "files",
    initialState,
    reducers: {},
    extraReducers(builder) {
        builder
            .addCase(deleteFile.fulfilled, (state, action) => {
                state.userFiles = state.userFiles?.filter(
                    (file) => file.f_id !== action.payload.f_id);
            })
            .addCase(uploadFile.fulfilled, (state, action) => {
                state.userFiles?.push(action.payload);
            })
            .addCase(getFilesByUserId.fulfilled, (state, action) => {
                state.userFiles = action.payload;
            })
            .addCase(getCustomersByFileId.fulfilled, (state, action) => {
                if (!state.customers.length) {
                    state.customers = action.payload;
                }
            })
    },
});

export default fileSlice.reducer;