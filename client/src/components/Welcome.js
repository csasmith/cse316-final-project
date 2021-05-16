import React                    from 'react';
import { NavLink }              from 'react-router-dom';
import { WLayout, WLHeader, 
         WLMain, WRow, WCol, 
         WNavbar, WNavItem }    from 'wt-frontend';

const Welcome = () => {
    return (
        <WLayout wLayout='header' className='container-secondary'>
            <WLHeader>
                <WNavbar color='colored'>
                    <ul>
                        <WNavItem>
                            <NavLink to="/" className='home-link'>
                                <h4>The World<br />Data Mapper</h4>
                            </NavLink>
                        </WNavItem>
                    </ul>
                    <ul>
                        <WNavItem>
                            <NavLink to='/register' className='account-link'>
                                <h4>Create Account</h4>
                            </NavLink>
                        </WNavItem>
                        <WNavItem>
                            <NavLink to='/login' className='login-link'>
                            <h4>Login</h4>
                            </NavLink>
                        </WNavItem>
                    </ul>
                </WNavbar>
            </WLHeader>
            <WLMain className='welcome-main'>
                <WRow className='welcome-image'>
                    <WCol size='4'></WCol>
                    <WCol size='4' >
                        <img src='/globe.jpg' alt='globe' width='300' height='300'></img>
                    </WCol>
                    <WCol size='4'></WCol>
                </WRow>
                <WRow className='welcome-title'>
                    <WCol size='4'></WCol>
                    <WCol size='4' >
                        <h2>Welcome To The <br />World Data Mapper</h2>
                    </WCol>
                    <WCol size='4'></WCol>
                </WRow>
            </WLMain>
        </WLayout>
    );
}

export default Welcome;