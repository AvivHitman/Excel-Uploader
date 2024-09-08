import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import { Customer } from '../../types'
import * as S from "./TableModal.style";

type Props = {
    columns: string[],
    rows: Customer[]
    onClose: () => void;
}

export const TableModal = ({ columns, rows, onClose }: Props) => {
    return (
        <S.Modal>
            <TableContainer component={Paper}>
                <Table sx={{ minWidth: 650 }} aria-label="simple table">
                    <TableHead>
                        <TableRow>
                            {columns.map((column, idx) =>
                                <TableCell key={idx} sx={{ fontWeight: "bold", fontSize: "12px" }} align="left">{column}</TableCell>
                            )}
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {rows.map((row) => (
                            <TableRow
                                key={row.name}
                                sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                            >
                                {Object.values(row).map((value, idx) => (
                                    <TableCell key={idx} align="left">{value}</TableCell>
                                ))}
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
                <S.CloseButton onClick={onClose}>Close</S.CloseButton>
            </TableContainer>
        </S.Modal>
    );
}
