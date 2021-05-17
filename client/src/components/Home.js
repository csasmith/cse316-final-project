import React, { useState }      from 'react';
import CreateMapModal           from './CreateMapModal';
import DeleteModal              from './DeleteModal';
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
    
    /* mutation hooks */
    const [Logout] = useMutation(LOGOUT);
    const [CreateMap] = useMutation(ADD_SUBREGION);
    const [DeleteMap] = useMutation(DELETE_SUBREGION);
    const [SetRegionField] = useMutation(SET_REGION_FIELD);

    /* state hooks */
    const [mapToDelete, toggleShowDeleteMap] = useState(null);
    const [editMapId, toggleShowEditMap] = useState(-1);
    const [showCreate, toggleShowCreate] = useState(false);

    /* misc hooks */
    const client = useApolloClient();
    let history = useHistory();
    let location = useLocation();

    /* our vars */
    let maps = [];


    /**
     * 
     * INITIALIZATION
     * 
     */


    const { _, error, data, refetch } = useQuery(GET_MAPS);
    if (error) {console.log(error.message)};
    if (data) {
        maps = data.getAllMaps;
        // console.log('All maps on render: ' + JSON.stringify(maps));
    }


    /**
     * 
     * HANDLER FUNCTIONS
     * 
     */


    /* move chosen map to top and go to spreadsheet */
    const selectMap = async (id) => {
        // swap indices of most recent and selected
        const {_, error, data } = await refetch();
        if (error) { console.log(error, 'error') };
        if (data) {
            maps = data.getAllMaps;
            // console.log(JSON.stringify(maps));
            if (maps.length > 1) {
                const selectedMap = maps.find(map => map._id === id);
                const mostRecentMap = maps[0]; // maps.find(map => map.index === '0');
                const newSelectedIndex = await SetRegionField({variables: {id: selectedMap._id, field: 'index', val: mostRecentMap.index}});
                const oldSelectedIndex = await SetRegionField({variables: {id: mostRecentMap._id, field: 'index', val: selectedMap.index}});
            }
            await refetch();
            // console.log('Did the indices get swapped correctly? ' + JSON.stringify(data.getAllMaps));
            // history.push(`home/sheet/${id}`);
            history.push({ pathname : `home/sheet/${id}`, state : { ancestors : [] } });
        }
        
    }


    const deleteMap = async (entry) => {
        const deleted = await DeleteMap({ variables: { id: entry._id }});
        console.log('deleted map: ' + JSON.stringify(deleted));
        await refetch();
    }

    const renameMap = async (e) => {
        let _id = editMapId;
        const newName = e.target.value;
        console.log(newName);
        if (newName) {
            const updatedName = await SetRegionField({variables: {id: _id, field: 'name', val: newName}});
            console.log('updatedName: ' + JSON.stringify(updatedName));
            await refetch();
        }
        toggleShowEditMap(-1);
    }

    const handleLogout = async (e) => {
        // props.logout();
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
        <WLayout wLayout='header' className='container-secondary'>
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
                                <WRow className='map-entry' key={entry._id}>
                                    {
                                        editMapId !== entry._id ? 
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
                                                 onClick={() => toggleShowEditMap(entry._id)} >
                                            <i className='material-icons small'>edit</i>
                                        </WButton>
                                    </WCol>
                                    <WCol size='2' className='map-trash'>
                                        <WButton wType='texted'
                                                 hoverAnimation='darken'
                                                 onClick={() => toggleShowDeleteMap(entry)}
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
                mapToDelete && (<DeleteModal 
                                 regionToDelete={mapToDelete} 
                                 handleDelete={deleteMap}
                                 label='Map' 
                                 setShowDelete={toggleShowDeleteMap}/>)
            }
            {
                showCreate && (<CreateMapModal 
                                isVisible={showCreate} 
                                toggleShowCreate={toggleShowCreate} 
                                createMap={CreateMap}
                                selectMap={selectMap}
                                mapsLength={maps.length} />)
            }

        </WLayout>
        : 
        <Redirect to='/login' />
    );
}

export default Home;
