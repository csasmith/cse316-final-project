import React, { useState }              from 'react';
import { NavLink, useHistory }          from 'react-router-dom';
import { WLayout, WLHeader, 
         WLMain, WNavbar,
         WNavItem, WButton, WInput }    from 'wt-frontend';
import { LOGIN }                        from '../cache/mutations';
import { useMutation }                  from '@apollo/client';

const Login = (props) => {

    const [input, setInput] = useState({ email: "", password: "" });
    const [Login] = useMutation(LOGIN);
    let history = useHistory();

    const updateInput = (e) => {
        const { name, value } = e.target;
        const updated = { ...input, [name]: value }; // overwrites old [name] key/value pair
        setInput(updated);
    }

    const handleLogin = async (e) => {
        for (let field in input) {
            if (!input[field]) {
                alert("All fields must be filled out to login");
                return
            }
        }
        const { _, error, data } = await Login({ variables: { ...input } });
        if (error) { return `Error: ${error.message}` };
        if (data.login._id === null) {
            alert("Error: login._id is null");
            return
        }
        if (data) {
            console.log("data: " + JSON.stringify(data));
            const user = await props.fetchUser() // why are we not passing data.user or something?
            // history.push({ pathname: '/home', state: {user: data.login}});
            history.push('/home');
        }
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
            <WLMain className='main'>
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
                                name='email'
                                placeholderText='Email'
                                barAnimation='left-to-right'
                                labelAnimation='shrink'
                                hoverAnimation='solid'
                                onBlur={updateInput}
                        />
                        <WInput wType='outlined'
                                inputType='password'
                                name='password'
                                placeholderText='Password'
                                barAnimation='left-to-right'
                                labelAnimation='shrink'
                                hoverAnimation='solid'
                                onBlur={updateInput}
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