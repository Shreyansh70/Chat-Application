import { FaSearch } from "react-icons/fa";
import {useState} from 'react'
import useConversation from "../../zustand/useConversation";
import useGetConversations from "../../hooks/useGetConversation";
import toast from "react-hot-toast";

const SearchInput = () => {
    const [search, setSearch] = useState('');
    const {setSelectedConversation} = useConversation();
    const {conversations} = useGetConversations();

    const handleSubmit = (e) => {
        e.preventDefault();
        if(!search) return;
        if(search.length < 3) return toast.error('Search query must be at least 3 characters long');

        const conversation = conversations.find(conversation => conversation.fullName.toLowerCase().includes(search.toLowerCase()));

        if(conversation){
            console.log("conversation : ", conversation);
            setSelectedConversation(conversation);
            setSearch('');
        }
        else
            toast.error('No conversation found with that name!');
    }


    return (
        <form onSubmit={handleSubmit} className = 'flex items-center gap-2'>
            <input type='text' placeholder='Search...' className = 'input input-bordered rounded-full' value={search}
                onChange={(e) => setSearch(e.target.value)}
            />
            <button type='submit' className="ml-2 btn btn-circle bg-sky-400 text-white">
                <FaSearch className="w-4 h-4 outline-none"/>
            </button>
        </form>
    );
}

export default SearchInput;