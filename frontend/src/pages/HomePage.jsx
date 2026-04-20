import React from 'react';
import Sidebar from "../components/Sidebar"
import ChatContainer from "../components/ChatContainer"
import RightSideBare from "../components/RightSideBar"
import { ChatContext } from '../../context/ChatContext';

const HomePage = ()=> {

const {selectedUser} = React.useContext(ChatContext)
 
    return ( 
        <div className = 'border w-full h-screen sm:px-[15%] sm:py-[5%]'>
           <div className = {`backdrop-blur-xl border-2 border-grey-600 rounded-2x1 overflow-hidden h-[100%] grid grid-cols-1 relative ${selectedUser ? 'md:grid-cols-[1fr_1.5fr_1fr] xl:grid-cols-[1fr_2fr_1fr]' : 'md:grid-cols-2'}`}>
            <Sidebar />
            <ChatContainer />
            <RightSideBare />  
           </div>s
        </div>
     );
}

export default HomePage ;