import React, { useState, 
                useEffect }         from 'react';
import { NavLink, Redirect,
         useHistory, useParams,
         useLocation }              from 'react-router-dom';
import { WLayout, WLHeader, 
         WLMain, WNavbar, 
         WNavItem, WButton, 
         WRow, WCol, WInput}        from 'wt-frontend';
import { LOGOUT }                   from '../cache/mutations';
import { GET_ALL_SUBREGIONS,
         GET_REGION_BY_ID }         from '../cache/queries';
import { useMutation,
         useQuery, 
         useApolloClient }          from '@apollo/client';

const RegionViewer = (props) => {

    /* mutation hooks */
    const [Logout] = useMutation(LOGOUT);

    /* state hooks */
    const [tpsMutex, toggleMutex] = useState(false);

    /* misc hooks */
    const client = useApolloClient();
    let history = useHistory();
    let location = useLocation();
    let { id } = useParams();

    /* our vars */
    const tps = props.viewerTps;
    let region = {};
    let allSubregions = [];
    let ancestors = location.state.ancestors;
    let siblings = location.state.siblings;
    let leftSibling = siblings.find((_, i, arr) => {
        return (i < (arr.length - 1) && arr[i+1]._id === id)
    });
    let rightSibling = siblings.find((_, i, arr) => {
        return (i > 0 && arr[i-1]._id === id)
    });
    console.log('left: ' + JSON.stringify(leftSibling));
    console.log('right: ' + JSON.stringify(rightSibling));


    /**
     * 
     * INITIALIZATION
     * 
     */


    /* runs once on mount */
    useEffect(() => {
        tps.clearAllTransactions();
    }, []);
    
    /* get parent region info */ 
    const { _, error, data, refetch } = useQuery(GET_REGION_BY_ID, { variables : { id: id}, fetchPolicy: 'network-only' });
    if (error) {console.log(error, 'error')};
    if (data) {
        region = data.getRegionById;
        // console.log("region: " + JSON.stringify(region));
        console.log('region.name: ' + region.name);
    }

    /* get ALL subregions */
    const { __, error: subregionError, data: subregionData, refetch: refetchAllSubregions } = useQuery(GET_ALL_SUBREGIONS, { variables: { id: id }, fetchPolicy: 'network-only'});
    if (subregionError) { console.log(error, 'error')};
    if (subregionData) {
        allSubregions = subregionData.getAllSubregions;
    }


    /**
     * 
     * HANDLER FUNCTIONS
     * 
     */


    /* tps redo */
    const tpsRedo = async () => {
        if (!tpsMutex) {
            toggleMutex(true); // idk why this works because async function...
            const retval = await tps.doTransaction();
            await refetchAllSubregions();
            toggleMutex(false);
            return retval;
        }
        
    }

    /* tps undo */
    const tpsUndo = async () => {
        if (!tpsMutex) {
            toggleMutex(true);
            const retval = await tps.undoTransaction();
            await refetchAllSubregions();
            toggleMutex(false);
            return retval;
        }
    }
    
    const goToAncestor = (entry) => {
        ancestors.splice(ancestors.indexOf(entry));
        console.log('newAncestors: ' + JSON.stringify(ancestors));
        history.push({ pathname: `/home/sheet/${entry._id}`, state: { ancestors: ancestors }});
    }

    const goToSibling = (dir) => {
        if (dir === 'left' && leftSibling) {
            history.push({ pathname: `/home/view/${leftSibling._id}`, state: { ancestors: ancestors, siblings: siblings } });
        } else if (dir === 'right' && rightSibling) {
            history.push({ pathname: `/home/view/${rightSibling._id}`, state: { ancestors: ancestors, siblings: siblings } });
        }
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
                                                 key={entry._id}
                                                 onClick={() => goToAncestor(entry)}>
                                            {index ? `> ${entry.name}` : `${entry.name}`}
                                        </WButton>
                                    ))
                                    :
                                    null
                            }
                        </div>
                    </ul>
                    <ul>
                        <WButton className='arrow leftarrow' 
                                 wType='texted'
                                 disabled={!leftSibling}
                                 onClick={() => goToSibling('left')}>
                            <i className='material-icons'>arrow_back</i>
                        </WButton>
                        <WButton className='arrow rightarrow'
                                 wType='texted'
                                 disabled={!rightSibling}
                                 onClick={() => goToSibling('right')}>
                            <i className='material-icons'>arrow_forward</i>
                        </WButton>
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
            <WLMain className='viewer-main'>
                <WLMain className='viewer viewer-lside'>
                    {/* Could maybe change first two to WLMain tags */}
                    <WRow>
                        <WButton wType='texted' className='arrow'><i className='material-icons'>undo</i></WButton>
                        <WButton wType='texted' className='arrow'><i className='material-icons'>redo</i></WButton>
                    </WRow>
                    <WRow><img src='/flag.jpg' alt='flag' width='200' height='200'></img></WRow>
                    <WRow>
                        <WCol size='6'>Region Name:</WCol>
                        <WCol size='6'>{region.name}</WCol>
                    </WRow>
                    <WRow>
                        <WCol size='6'>Parent Region: </WCol>
                        <WCol size='6'>
                            <WButton className='parent-region-link table-link' wType='texted'
                                    onClick={() => goToAncestor({id: ancestors[ancestors.length - 1].id, name: ancestors[ancestors.length - 1].name})}>
                                {ancestors[ancestors.length - 1].name}
                            </WButton>
                        </WCol>
                    </WRow>
                    <WRow>
                        <WCol size='6'>Region Capital:</WCol>
                        <WCol size='6'>{region.capital}</WCol>
                    </WRow>
                    <WRow>
                        <WCol size='6'>Region Leader:</WCol>
                        <WCol size='6'>{region.leader}</WCol>
                    </WRow>
                    <WRow>
                        <WCol size='6'>Number of Subregions:</WCol>
                        <WCol size='6'>{allSubregions ? allSubregions.length : 0}</WCol>
                    </WRow>
                </WLMain>
                <WLMain className='viewer viewer-rside'>
                    <div>Region Landmarks</div>
                    <WLMain className='landmarks-editor'></WLMain>
                    <WRow className='input-landmark'>
                        <WCol size='1'>
                            <WButton className='add-region-btn add-landmark-btn' wType='texted'><i className='material-icons small'>add</i></WButton>
                        </WCol>
                        <WCol size='11'>
                        <WInput wType='outlined'
                                inputType='text'
                                name='name'
                                placeholderText='Add New Landmark'
                                barAnimation='left-to-right'
                                labelAnimation='shrink'
                                hoverAnimation='solid'
                        />
                        </WCol>
                    </WRow>
                </WLMain>
            </WLMain>
            {
                /* showDelete && (<DeleteModal isVisible={showDelete} delete={deleteMap}) */
            }
        </WLayout>
        : 
        <Redirect to='/login' />
    )
}

export default RegionViewer;