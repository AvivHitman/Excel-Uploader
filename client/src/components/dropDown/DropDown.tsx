import { useState } from 'react';
import Box from '@mui/material/Box';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select, { SelectChangeEvent } from '@mui/material/Select';

type Props = {
    menuItems: string[],
    onClick: (name: string) => void
}

export const DropDown = ({ menuItems, onClick }: Props) => {
    const [name, setName] = useState('');

    const handleChange = (event: SelectChangeEvent) => {
        setName(event.target.value as string);
    };

    return (
        <>
            <Box sx={{ minWidth: 120 }}>
                <FormControl fullWidth sx={{ marginTop: '20px', marginBottom: '20px' }} >
                    <InputLabel id="demo-simple-select-label">Name</InputLabel>
                    <Select
                        labelId="demo-simple-select-label"
                        id="demo-simple-select"
                        value={name}
                        label="Name"
                        onChange={handleChange}
                    >
                        {menuItems.map((item, idx) =>
                            <MenuItem key={idx} value={item}>{item}</MenuItem>
                        )}
                    </Select>
                </FormControl>
            </Box>
            <button onClick={() => onClick(name)}>Select</button>
        </>
    );
}
