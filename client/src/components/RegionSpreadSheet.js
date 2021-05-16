import React, { useState,
                useEffect }                 from 'react';
import RegionEntry                          from './RegionEntry';
import { NavLink, Redirect,
         useHistory, useParams,
         useLocation }                      from 'react-router-dom';
import { WLayout, WLHeader, 
         WLMain, WNavbar, 
         WNavItem, WButton, 
         WRow, WCol}                        from 'wt-frontend';
import { ADD_SUBREGION,
         LOGOUT, 
         DELETE_SUBREGION,
         SET_REGION_FIELD }                 from '../cache/mutations';
import { GET_REGION_BY_ID,
         GET_SUBREGIONS }                   from '../cache/queries';
import { useMutation,
         useQuery, 
         useApolloClient }                  from '@apollo/client';
import { AddDeleteSubregion_Transaction }   from '../utils/jsTPS';

const RegionSpreadSheet = (props) => {

    /* mutation hooks */
    const [Logout] = useMutation(LOGOUT);
    const [AddSubregion] = useMutation(ADD_SUBREGION);
    const [DeleteSubregion] = useMutation(DELETE_SUBREGION);
    const [SetRegionField] = useMutation(SET_REGION_FIELD);

    /* state hooks */
    const [deleteRegionId, toggleShowDeleteRegion] = useState(0);
    const [newIndex, setNewIndex] = useState(0);

    /* misc hooks */
    const client = useApolloClient();
    const history = useHistory();
    const location = useLocation();
    const { id } = useParams();

    /* our vars */
    let region = {};
    let subregions = [];
    const tps = props.sheetTps;
    let ancestors = location.state.ancestors;


    /**
     * 
     * INITIALIZATION
     * 
     */


    /* runs only once on first mount... supposedly */
    useEffect(() => {
        tps.clearAllTransactions();
        let maxIndex = -1;
        // can see potential issue where if this runs before first render subregions.length === 0 always
        if (subregions.length) { maxIndex = subregions.reduce( (accumulator, subregion) => Math.max(accumulator, subregion.index)) };
        setNewIndex(maxIndex + 1);
    }, []);

    /* gets parent region */
    const { _, error: regionError, data: regionData, refetch: refetchRegion } = useQuery(GET_REGION_BY_ID, { variables : { id: id}, fetchPolicy: 'network-only' });
    if (regionError) {console.log(regionError, 'error')};
    if (regionData) {
        region = regionData.getRegionById;
        console.log("region: " + JSON.stringify(region));
    }

    /* gets all immediate child subregions for the sheet */ 
    const { __, error: subregionError, data: subregionData, refetch: refetchSubregions } = useQuery(GET_SUBREGIONS, { variables: { id: id }, fetchPolicy: 'network-only'});
    if (subregionError) { console.log(subregionError, 'error')};
    if (subregionData) {
        subregions = subregionData.getSubregions;
        console.log("subregions: " + JSON.stringify(subregions));
    }


    /**
     * 
     * HANDLER FUNCTIONS
     * 
     */


    /* tps redo */
    const tpsRedo = async () => {
        const retval = await tps.doTransaction();
        await refetchSubregions();
        return retval;
    }

    /* tps undo */
    const tpsUndo = async () => {
        const retval = await tps.undoTransaction();
        await refetchSubregions();
        return retval;
    }


    /* Add new untitled subregion */
    const handleAddSubregion = (e) => { // does this actually have to be async?
        const newSubregion = {
            _id: '',
            path: region.path ? region.path + ',' + id : ',' + id,
            name: 'Untitled',
            index: '' + newIndex
        };
        let transaction = new AddDeleteSubregion_Transaction(newSubregion, 'add', AddSubregion, DeleteSubregion);
        tps.addTransaction(transaction);
        tpsRedo();
        setNewIndex(newIndex + 1);
        // maybe we should refetch subregions here instead of depending on render to do it?
    }

    const handleDeleteSubregion = (subregion) => { // maybe this should be async
        let transaction = new AddDeleteSubregion_Transaction(subregion, 'delete', AddSubregion, DeleteSubregion);
        tps.addTransaction(transaction);
        tpsRedo();
        refetchSubregions(); // maybe this should be awaited 
    }

    const goToAncestor = (entry) => {
        ancestors.splice(ancestors.indexOf(entry));
        console.log('newAncestors: ' + JSON.stringify(ancestors));
        history.push({ pathname: `/home/sheet/${entry._id}`, state: { ancestors: ancestors }});
    }

    const goToSubregion = async (subregionId) => {
        ancestors.push({ _id: id, name: region.name });
        console.log('newAncestors: ' + JSON.stringify(ancestors));
        // await refetchRegion({variables : { id: subregionId}});
        history.push({ pathname: `/home/sheet/${subregionId}`, state: { ancestors: ancestors }});
    }

    const goToRegionView = (regionId) => {
        ancestors.push({ _id: id, name: region.name });
        console.log('newAncestors: ' + JSON.stringify(ancestors));
        history.push({ pathname: `/home/view/${regionId}`, state: { ancestors: ancestors } });
    }

    const handleLogout = async (e) => {
        // props.logout();
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
        <WLayout wLayout='header' className='container-secondary'>
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
                            <WButton className='sheet-undo' 
                                     wType='texted' 
                                     disabled={!tps.hasTransactionToUndo()}
                                     onClick={tpsUndo}>
                                <i className='material-icons'>undo</i>
                            </WButton>
                            <WButton className='sheet-redo' 
                                     wType='texted' 
                                     disabled={!tps.hasTransactionToRedo()}
                                     onClick={tpsRedo}> 
                                <i className='material-icons'>redo</i>
                            </WButton>
                        </WCol>
                        <WCol className='login-link' size='2'><h4>Region Name:</h4></WCol>
                        <WCol size='2'><WButton wType='texted' className='main-region-name-link'>{region.name}</WButton></WCol>
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
                            subregions ? 
                                subregions.map((subregion) => (
                                    <RegionEntry subregion={subregion}
                                                 goToSubregion={goToSubregion}
                                                 goToRegionView={goToRegionView}
                                                 deleteSubregion={handleDeleteSubregion}
                                                 key={subregion._id}/>
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