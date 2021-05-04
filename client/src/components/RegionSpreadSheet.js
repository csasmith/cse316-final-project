import React, { useState }          from 'react';
import RegionEntry                  from './RegionEntry';
import { NavLink, Redirect,
         useHistory, useParams,
         useLocation }              from 'react-router-dom';
import { WLayout, WLHeader, 
         WLMain, WNavbar, 
         WNavItem, WButton, 
         WRow, WCol}                from 'wt-frontend';
import { ADD_SUBREGION,
         LOGOUT }                   from '../cache/mutations';
import { GET_REGION_BY_ID }         from '../cache/queries';
import { useMutation,
         useQuery, 
         useApolloClient }          from '@apollo/client';

const RegionSpreadSheet = (props) => {

    const [Logout] = useMutation(LOGOUT);
    const [AddSubregion] = useMutation(ADD_SUBREGION);
    const client = useApolloClient();
    const [showDelete, toggleShowDelete] = useState(false);
    const [deleteRegionId, setDeleteRegionId] = useState({});
    let history = useHistory();
    let location = useLocation();
    let { id } = useParams();
    let regionData = {};
    let ancestors = location.state.ancestors; // [{id: id, name: name}]
    console.log("ancestors: " + JSON.stringify(ancestors));

    // get subregions data that will appear in table
    // console.log("id from params: " + id);
    const { _, error, data, refetch } = useQuery(GET_REGION_BY_ID, { variables : { id: id}, fetchPolicy: 'network-only' });
    if (error) {console.log(error, 'error')};
    if (data) {
        regionData = data.getRegionById;
        // console.log("regionData: " + JSON.stringify(regionData));
        console.log('regionData.name: ' + regionData.name);
    }

    const handleAddSubregion = async (e) => {
        const {_, error, data } = await AddSubregion({ variables: { subregion: { name: "Untitled", parent: id } } });
        if (error) {console.log(error, 'error')};
        if (data.addSubregion === 'Error:DB') {
            alert("Failed to save new region");
            return
        }
        const regionId = data.addSubregion;
        console.log(regionId); 
        await refetch();
    }

    const goToAncestor = (entry) => {
        ancestors.splice(ancestors.indexOf(entry));
        console.log('newAncestors: ' + JSON.stringify(ancestors));
        history.push({ pathname: `/home/sheet/${entry.id}`, state: { ancestors: ancestors }});
    }

    const goToSubregion = async (subregionId) => {
        ancestors.push({ id: id, name: regionData.name });
        console.log('newAncestors: ' + JSON.stringify(ancestors));
        await refetch({variables : { id: subregionId}});
        history.push({ pathname: `/home/sheet/${subregionId}`, state: { ancestors: ancestors }});
    }

    const handleLogout = async (e) => {
        await Logout();
        const { _, error, data } = await props.fetchUser();
        if (error) {console.log(error, 'error')};
        if (data) {
            let reset = await client.resetStore();
            if (reset) history.push('/');
        } else {
            history.push('/');
        }
    }

    // if this breaks just do props.user
    // console.log("location.state.user: " + JSON.stringify(location.state.user));
    // {{pathname: '/home', state: {user: location.state.user}}}
    return (
        props.user ? 
        <WLayout WLayout='header' className='container-secondary'>
            <WLHeader>
                <WNavbar color='colored'>
                    <ul className='toolbar-lside'>
                        <WNavItem>
                            <NavLink to='/home' className='home-link'>
                                <h4>The World<br />Data Mapper</h4>
                            </NavLink>
                        </WNavItem>
                        <div className='toolbar-path'>
                            {
                                ancestors.length ? 
                                    ancestors.map((entry, index) => (
                                        <WButton className='toolbar-path-entry' 
                                                 wType='texted'
                                                 onClick={() => goToAncestor(entry)}>
                                            {index ? `> ${entry.name}` : `${entry.name}`}
                                        </WButton>
                                    ))
                                    :
                                    null
                            }
                        </div>
                    </ul>
                    <ul></ul>
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
                <WLMain className='sheet-container'>
                    <WRow className='table-controls'>
                        <WCol size='1'>
                            <WButton className='add-region-btn' 
                                     wType='texted'
                                     onClick={handleAddSubregion}>
                                <i className='material-icons'>add</i>
                            </WButton>
                        </WCol>
                        <WCol size='3'>
                            <WButton className='sheet-undo' wType='texted'><i className='material-icons'>undo</i></WButton>
                            <WButton className='sheet-redo' wType='texted'><i className='material-icons'>redo</i></WButton>
                        </WCol>
                        <WCol className='login-link' size='2'><h4>Region Name:</h4></WCol>
                        <WCol size='2'><WButton wType='texted' className='main-region-name-link'>{regionData.name}</WButton></WCol>
                    </WRow>
                    <WRow className='table-header'>
                        <WCol size='7'>
                            <WRow className='table-header-row'>
                                <WCol className='table-header-col' size='4'>
                                    Name
                                    <WButton wType='texted' className='table-header-btn'><i className='material-icons small'>sort</i></WButton>
                                </WCol>
                                <WCol className='table-header-col' size='4'>
                                    Capital
                                    <WButton wType='texted' className='table-header-btn'><i className='material-icons small'>sort</i></WButton>
                                </WCol>
                                <WCol className='table-header-col' size='4'>
                                    Leader
                                    <WButton wType='texted' className='table-header-btn'><i className='material-icons small'>sort</i></WButton>
                                </WCol>
                            </WRow>
                        </WCol>
                        <WCol className='table-header-col' size='1'>
                            Flag
                            <WButton wType='texted' className='table-header-btn'><i className='material-icons small'>sort</i></WButton>
                        </WCol>
                        <WCol className='table-header-col' size='4'>
                            Landmarks
                            <WButton wType='texted' className='table-header-btn'><i className='material-icons small'>sort</i></WButton>
                        </WCol>
                    </WRow>
                    <WLMain className='table-entries'>
                        {
                            regionData.subregions ? 
                                regionData.subregions.map((subregion) => (
                                    <RegionEntry subregion={subregion}
                                                 goToSubregion={goToSubregion}/>
                                ))
                                :
                                null
                        }
                    </WLMain>
                </WLMain>
            </WLMain>
            {
                /* showDelete && (<DeleteModal isVisible={showDelete} delete={deleteMap}) */
            }
        </WLayout>
        : 
        <Redirect to='/login' />
    );
}

export default RegionSpreadSheet;