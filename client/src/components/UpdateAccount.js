import React, { useState }              from 'react';
import { NavLink, useHistory }          from 'react-router-dom';
import { WLayout, WLHeader, 
         WLMain, WNavbar,
         WNavItem, WButton, WInput }    from 'wt-frontend';
import { UPDATE, LOGOUT }               from '../cache/mutations';
import { useMutation, useApolloClient } from '@apollo/client';

const UpdateAccount = (props) => {

    const [input, setInput] = useState({ name: '', email: '', password: '' });
    const [Logout] = useMutation(LOGOUT);
    const [Update] = useMutation(UPDATE);
    const client = useApolloClient();

    let history = useHistory();

    const updateInput = (e) => {
        const { name, value } = e.target;
        const updated = { ...input, [name]: value }; // overwrites old [name] key/value pair
        setInput(updated);
    }

    const handleLogout = async (e) => {
        await Logout();
        const { _, error, data } = await props.fetchUser();
        if (error) {console.log(error.message)};
        if (data) {
            let reset = await client.resetStore();
            if (reset) history.push('/');
        } else {
            history.push('/');
        }
    }

    const handleUpdateAccount = async (e) => {
        for (let field in input) {
            if (!input[field]) {
                alert("All fields must be filled out to update account.")
                return
            }
        }
        const { _, error, data } = await Update({ variables : { ...input } });
        if (error) { return `Error: ${error.message}`};
        if (data) {
            console.log(data);
            await props.fetchUser();
            console.log("guess we're good...");
        }
        history.push('/home');
    }


    return (
        <WLayout WLayout='header' className='container-secondary'>
            <WLHeader>
                <WNavbar color='colored'>
                    <ul>
                        <WNavItem>
                            <NavLink to='/home' className='home-link'>
                                <h4>The World<br />Data Mapper</h4>
                            </NavLink>
                        </WNavItem>
                    </ul>
                    <ul>
                        <WNavItem>
                            <NavLink to='/update' className='account-link'>
                                <h4>{props.user.name}</h4>
                            </NavLink>
                        </WNavItem>
                        <WNavItem>
                            <WButton wType='texted' className='login-link' onClick={handleLogout}>Logout</WButton>
                        </WNavItem>
                    </ul>
                </WNavbar>
            </WLHeader>
            <WLMain className='main'>
                <WLayout className='account-container'>
                    <WLHeader className='account-header'>
                        <span className='account-title'>Enter Updated Account Information</span>
                        <WButton 
                                className='account-close-btn' 
                                wType='transparent'
                                hoverAnimation='lighten'
                                onClick={() => history.push('/home')}
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
                            <WButton color='colored' hoverAnimation='lighten' onClick={handleUpdateAccount}>
                                Update
                            </WButton>
                            <WButton color='colored' hoverAnimation='lighten' onClick={() => history.push('/home')}>Cancel</WButton>
                        </div>
                    </WLMain>
                </WLayout>
            </WLMain>
        </WLayout>
    );
}

export default UpdateAccount;