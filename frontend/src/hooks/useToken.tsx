import {useState} from 'react';

export default function useToken() {
    const getToken = () => {
        const token = localStorage.getItem('token');
        return JSON.parse(token ?? 'false');
    };

    const [token, setToken] = useState(getToken());

    const saveToken = (userToken: boolean) => {
        localStorage.setItem('token', JSON.stringify(userToken));
        setToken(userToken);
    }

    return {
        setToken: saveToken,
        token
    }
}

