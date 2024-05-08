import {useState} from 'react'
import { useAuthContext } from '../context/AuthContext';
import toast from 'react-hot-toast';
const useLogout = () => {
    const [loading, setLoading] = useState(false);
    const {authUser, setAuthUser} = useAuthContext();
    const logout = async () => {
        setLoading(true);
        try {
            localStorage.removeItem('chat-user');
            setAuthUser(null);
        } catch (error) {
            toast.error(error.message);
        } finally{
            setLoading(false);
        }
    }

    return {logout, loading};
}

export default useLogout;