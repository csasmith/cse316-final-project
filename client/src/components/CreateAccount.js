import React, { useState }              from 'react';
import { NavLink, useHistory }          from 'react-router-dom';
import { WLayout, WLHeader, 
         WLMain, WNavbar,
         WNavItem, WButton, WInput }    from 'wt-frontend';
import { REGISTER }                     from '../cache/mutations';
import { useMutation }                  from '@apollo/client';

const CreateAccount = (props) => {

    const [input, setInput] = useState({ name: '', email: '', password: '' });
    const [Register] = useMutation(REGISTER);

    let history = useHistory();

    const updateInput = (e) => {
        const { name, value } = e.target;
        const updated = { ...input, [name]: value }; // overwrites old [name] key/value pair
        setInput(updated);
    }

    const handleCreateAccount = async (e) => {
        for (let field in input) {
            if (!input[field]) {
                alert("All fields must be filled out to register.")
                return
            }
        }
        console.log({...input});
        const { _, error, data } = await Register({ variables : { ...input } });
        if (error) { return `Error: ${error.message}`};
        if (data) {
            console.log(data);
            if (data.register.email === 'already exists') {
                alert('User with that email already exists');
                return
            } else {
                // props.fetchUser(); // ADD THIS BACK IF USER SHIT IS BREAKING!
                console.log("guess we're good...");
            }
        }
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
            <WLMain className='main'>
                <WLayout className='account-container'>
                    <WLHeader className='account-header'>
                        <span className='account-title'>Create A New Account</span>
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
                                name='name'
                                placeholderText='Name'
                                barAnimation='left-to-right'
                                labelAnimation='shrink'
                                hoverAnimation='solid'
                                onBlur={updateInput}
                        />
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
                            <WButton color='colored' hoverAnimation='lighten' onClick={handleCreateAccount}>
                                Create Account
                            </WButton>
                            <WButton color='colored' hoverAnimation='lighten' onClick={() => history.push('/welcome')}>Cancel</WButton>
                        </div>
                    </WLMain>
                </WLayout>
            </WLMain>
        </WLayout>
    );
}

export default CreateAccount;