import React, { useState }      from 'react';
import CreateMapModal           from './CreateMapModal';
import { NavLink, Redirect,
         useHistory, Switch,
         Route }                from 'react-router-dom';
import { WLayout, WLHeader, 
         WLMain, WNavbar, 
         WNavItem, WButton, 
         WLSide, WRow, WCol}    from 'wt-frontend';
import { GET_MAPS }             from '../cache/queries';
import { LOGOUT, 
         ADD_SUBREGION }        from '../cache/mutations';
import { useMutation,
         useQuery, 
         useApolloClient }      from '@apollo/client';

const Home = (props) => {
    
    const [recentMapId, setRecentMapId] = useState("");
    const [Logout] = useMutation(LOGOUT);
    const [CreateMap] = useMutation(ADD_SUBREGION);
    const client = useApolloClient();
    const [showDelete, toggleShowDelete] = useState(false);
    const [deleteMapId, setDeleteMapId] = useState({});
    const [showCreate, toggleShowCreate] = useState(false);
    let history = useHistory();
    let maps = [];

    // will this be enough for maps to be there when we navigate home?
    const { _, error, data, refetch } = useQuery(GET_MAPS);
    if (error) {console.log(error.message)};
    if (data) {
        maps = data.getAllMaps;
        if (recentMapId) { 
            let recentMap = maps.find(map => map._id === recentMapId);
            maps = maps.filter(map => map._id !== recentMapId);
            maps.unshift(recentMap);
        };
        console.log(JSON.stringify(maps));
    }

    const selectMap = async (id) => {
        const {_, error, data } = await refetch();
        if (error) {console.log(error.message)};
        if (data) {
            maps = data.getAllMaps;
            let selectedMap = maps.find(map => map._id === id);
            if (!selectedMap) {console.log("selected map DNE, this will not go well...")};
            maps = maps.filter(map => map._id !== recentMapId);
            maps.unshift(selectedMap);
        }
        setRecentMapId(id);
        history.push(`home/sheet/${id}`);
    }

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
                            <NavLink to="/home" className='home-link'>
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
                        {
                            maps.map((entry) => (
                                <WRow className='map-entry'>
                                    <WCol size='8' className='map-name'>
                                        <WButton wType='texted'
                                                 className='create-map-btn'
                                                 hoverAnimation='lighten'
                                                 onClick={() => selectMap(entry._id)}
                                        >
                                            {entry.name}
                                        </WButton>
                                    </WCol>
                                    <WCol size='4' className='map-trash'>
                                        <WButton wType='texted'
                                                 hoverAnimation='darken'
                                        >
                                            <i className='material-icons small'>delete</i>
                                        </WButton>
                                    </WCol>
                                </WRow>
                            ))
                        }
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
                                selectMap={selectMap} />)
            }

        </WLayout>
        : 
        <Redirect to='/login' />
    );
}

export default Home;
