import React                    from 'react';
import { NavLink, Redirect,
         useHistory }           from 'react-router-dom';
import { WLayout, WLHeader, 
         WLMain, WRow, WCol, 
         WNavbar, WNavItem,
         WButton }              from 'wt-frontend';
import { LOGOUT }               from '../cache/mutations';
import { useMutation, 
         useApolloClient }      from '@apollo/client';

const Home = (props) => {
    
    const [Logout] = useMutation(LOGOUT);
    const client = useApolloClient();
    let history = useHistory();

    const handleLogout = async (e) => {
        Logout();
        const { data } = await props.fetchUser();
        if (data) {
            let reset = await client.resetStore();
            if (reset) history.push('/welcome');
        } else {
            history.push('/welcome');
        }
    }  

    console.log('props.user: ' + props.user);
    return (
        props.user ? 
        <WLayout WLayout='header' className='container-secondary'>
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
                            <WButton wType='texted' className='login-link' onClick={handleLogout}>Logout</WButton>
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
        : 
        <Redirect to='/login' />
    );
}

export default Home;