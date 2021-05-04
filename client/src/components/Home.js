import React, { useState }      from 'react';
import CreateMapModal           from './CreateMapModal';
import { NavLink, Redirect,
         useHistory, Switch,
         Route, useLocation }   from 'react-router-dom';
import { WLayout, WLHeader, 
         WLMain, WNavbar, 
         WNavItem, WButton, 
         WLSide, WRow, WCol,
         WInput }               from 'wt-frontend';
import { GET_MAPS }             from '../cache/queries';
import { LOGOUT, 
         ADD_SUBREGION,
         DELETE_SUBREGION,
         SET_REGION_FIELD }     from '../cache/mutations';
import { useMutation,
         useQuery, 
         useApolloClient }      from '@apollo/client';

const Home = (props) => {
    
    const [recentMapId, setRecentMapId] = useState("");
    const [Logout] = useMutation(LOGOUT);
    const [CreateMap] = useMutation(ADD_SUBREGION);
    const [DeleteMap] = useMutation(DELETE_SUBREGION);
    const [RenameMap] = useMutation(SET_REGION_FIELD);
    const client = useApolloClient();
    const [showDelete, toggleShowDelete] = useState(false);
    const [deleteMapId, setDeleteMapId] = useState({});
    const [showEditMapId, toggleShowEditMap] = useState(-1);
    const [showCreate, toggleShowCreate] = useState(false);
    let history = useHistory();
    let location = useLocation();
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
        const {_, error, data } = await refetch(); // refetch is useQuery(GET_MAPS)
        if (error) {console.log(error.message)};
        if (data) {
            maps = data.getAllMaps;
            let selectedMap = maps.find(map => map._id === id);
            if (!selectedMap) {console.log("selected map DNE, this will not go well...")};
            maps = maps.filter(map => map._id !== recentMapId);
            maps.unshift(selectedMap);
        }
        setRecentMapId(id);
        // history.push({pathname: `home/sheet/${id}`, state: {user: location.state.user, ancestors: []}});
        history.push({pathname: `home/sheet/${id}`, state: { ancestors: []}});
    }

    const deleteMap = async (_id) => {
        const deletedId = await DeleteMap({ variables: { id: _id }});
        await refetch();
    }

    const renameMap = async (e) => {
        let _id = showEditMapId;
        const newName = e.target.value;
        console.log(newName);
        if (newName) {
            const updatedName = await RenameMap({variables: {id: _id, field: 'name', val: newName}});
            console.log('updatedName: ' + JSON.stringify(updatedName));
            await refetch();
        }
        toggleShowEditMap(-1);
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
    
    // remember if this breaks just go back to props.user
    // console.log("location.state.user: " + JSON.stringify(location.state.user));
    // {{pathname: '/home', state: {user: location.state.user}}}
    return (
        props.user ? 
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
                <WLayout className='home-container'>
                    <WLHeader className='home-header'>Your Maps</WLHeader>
                    <div className='home-content'>
                        <WLMain className='home-maps'>
                        {
                            maps.map((entry) => (
                                <WRow className='map-entry'>
                                    {
                                        showEditMapId !== entry._id ? 
                                        <WCol size='8' className='map-name'>
                                            <WButton wType='texted'
                                                    className='create-map-btn'
                                                    hoverAnimation='lighten'
                                                    onClick={() => selectMap(entry._id)}
                                            >
                                                {entry.name}
                                            </WButton>
                                        </WCol>
                                        :
                                        <WCol size='8'>
                                            <WInput wType='outlined'
                                                    className='map-edit-name'
                                                    inputType='text'
                                                    name='name'
                                                    placeholderText='Enter New Map Name'
                                                    barAnimation='left-to-right'
                                                    labelAnimation='shrink'
                                                    hoverAnimation='solid'
                                                    onBlur={renameMap}
                                            />
                                        </WCol>
                                    }
                                    
                                    <WCol size='2' className='map-edit'>
                                        <WButton wType='texted'
                                                 hoverAnimation='darken'
                                                 onClick={() => toggleShowEditMap(entry._id)}
                                        >
                                            <i className='material-icons small'>edit</i>
                                        </WButton>
                                    </WCol>
                                    <WCol size='2' className='map-trash'>
                                        <WButton wType='texted'
                                                 hoverAnimation='darken'
                                                 onClick={() => deleteMap(entry._id)}
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
