import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { DropDown } from "../../components/dropDown/DropDown"
import { User } from "../../types";
import * as S from "./UserSelection.style";


export const UserSelection = () => {
    const [users, setUsers] = useState<User[]>([]);
    const navigate = useNavigate();

    const fetchUsers = async () => {
        try {
            const response = await axios.get('http://localhost:3000/users');
            const usersFromDb = response.data;
            setUsers(usersFromDb);

        } catch (error) {
            console.error('Error fetching users:', error);
        }
    };

    useEffect(() => {
        fetchUsers();
    }, []);

    const userNames = users.map(user => user.u_name);

    const handleUserSelected = (userName: string) => {
        const user = users.find(user => userName === user.u_name);
        if (user) {
            navigate(`/uploadFile/${user?.u_id}`, { state: { user: user } });
        }
    };

    return (
        <S.SelectBox>
            <h2>Select a User:</h2>
            <DropDown onClick={handleUserSelected} menuItems={userNames}></DropDown>
        </S.SelectBox>
    )
}
