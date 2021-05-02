import React                            from 'react';
import { NavLink, useHistory }          from 'react-router-dom';
import { WLayout, WLHeader, 
         WLMain, WNavbar,
         WNavItem, WButton, WInput }    from 'wt-frontend';

const Login = () => {

    let history = useHistory();

    const handleLogin = (e) => {
        history.push('/welcome');
    }

    return (
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
                            <NavLink to='/login' className='login-link'>
                            <h4>Login</h4>
                            </NavLink>
                        </WNavItem>
                    </ul>
                </WNavbar>
            </WLHeader>
            <WLMain className='account-main'>
                <WLayout WLayout='header' className='account-container'>
                    <WLHeader className='account-header'>
                        <span className='account-title'>Login</span>
                        <WButton 
                                className='account-close-btn' 
                                wType='transparent'
                                hoverAnimation='lighten'
                                onClick={() => history.push('/welcome')}
                        >
                            <i className='material-icons small'>close</i>
                        </WButton>
                    </WLHeader>
                    <WLMain className='account-content'>
                        <WInput wType='outlined'
                                inputType='text'
                                placeholderText='Email'
                                barAnimation='left-to-right'
                                labelAnimation='shrink'
                                hoverAnimation='solid'
                        />
                        <WInput wType='outlined'
                                inputType='password'
                                placeholderText='Password'
                                barAnimation='left-to-right'
                                labelAnimation='shrink'
                                hoverAnimation='solid'
                        />
                        <div className='account-btns'>
                            <WButton color='colored' hoverAnimation='lighten' onClick={handleLogin}>
                                Login
                            </WButton>
                            <WButton color='colored' hoverAnimation='lighten' onClick={() => history.push('/welcome')}>Cancel</WButton>
                        </div>
                    </WLMain>
                </WLayout>
            </WLMain>
        </WLayout>
    );
}

export default Login;