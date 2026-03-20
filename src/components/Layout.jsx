import React from 'react';
import { ToastContainer } from 'react-toastify';
import MyFooter from '../Pages/Public/MyFooter';

import Navbar from 'src/Pages/Public/Navbar';

const Layout = ({ children }) => {
    return (
        <div className='max-w-full w-full'>
            <Navbar />
            {children}
            <MyFooter />
            <ToastContainer theme="dark"  />
        </div>
    );
};

export default Layout;