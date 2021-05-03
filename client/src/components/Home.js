import React, { useState }      from 'react';
import CreateMapModal           from './CreateMapModal';
import { NavLink, Redirect,
         useHistory }           from 'react-router-dom';
import { WLayout, WLHeader, 
         WLMain, WNavbar, 
         WNavItem, WButton, 
         WLSide}                from 'wt-frontend';
import { LOGOUT, 
         ADD_SUBREGION }        from '../cache/mutations';
import { useMutation, 
         useApolloClient }      from '@apollo/client';

const Home = (props) => {
    
    const [Logout] = useMutation(LOGOUT);
    const [CreateMap] = useMutation(ADD_SUBREGION);
    const client = useApolloClient();
    const [showDelete, toggleShowDelete] = useState(false);
    const [deleteMapId, setDeleteMapId] = useState({});
    const [showCreate, toggleShowCreate] = useState(false);
    let history = useHistory();

    const handleLogout = async (e) => {
        await Logout();
        const { _, error, data } = await props.fetchUser();
        if (error) {console.log(error.message)};
        if (data) {
            let reset = await client.resetStore();
            if (reset) history.push('/welcome');
        } else {
            history.push('/welcome');
        }
    }
    
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
                <WLayout className='home-container'>
                    <WLHeader className='home-header'>Your Maps</WLHeader>
                    <div className='home-content'>
                        <WLMain className='home-maps'>
                            <ul>
                                <li>The World</li>
                                <li>Middle Earth</li>
                            </ul>
                        </WLMain>
                        <WLSide className='home-side'>
                            <img src='/globe.jpg' alt='globe' width='180' height='180'></img>
                            <WButton 
                                     wType='transparent' 
                                     className='create-map-btn'
                                     hoverAnimation='lighten'
                                     onClick={() => toggleShowCreate(true)}
                            >
                                Create A New Map
                            </WButton>
                        </WLSide>
                    </div>
                </WLayout>
            </WLMain>

            {
                /* showDelete && (<DeleteModal isVisible={showDelete} delete={deleteMap}) */
            }
            {
                showCreate && (<CreateMapModal 
                                isVisible={showCreate} 
                                toggleShowCreate={toggleShowCreate} 
                                createMap={CreateMap}
                                history={history}/>)
            }

            <Switch>
                <Route path='/home/sheet/:id'>
                    <RegionSpreadsheet fetchUser={props.fetchUser} user={props.user} />
                </Route>
            </Switch>

        </WLayout>
        : 
        <Redirect to='/login' />
    );
}

export default Home;