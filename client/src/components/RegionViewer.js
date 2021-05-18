import React, { useState, 
                useEffect }         from 'react';
import { NavLink, Redirect,
         useHistory, useParams,
         useLocation }              from 'react-router-dom';
import { WLayout, WLHeader, 
         WLMain, WNavbar, 
         WNavItem, WButton, 
         WRow, WCol, WInput}        from 'wt-frontend';
import { SET_REGION_FIELD,
         LOGOUT }                   from '../cache/mutations';
import { GET_ALL_SUBREGIONS,
         GET_REGION_BY_ID }         from '../cache/queries';
import { useMutation,
         useQuery, 
         useApolloClient }          from '@apollo/client';
import { EditRegion_Transaction } from '../utils/jsTPS';

const RegionViewer = (props) => {

    /* mutation hooks */
    const [Logout] = useMutation(LOGOUT);
    const [SetRegionField] = useMutation(SET_REGION_FIELD);

    /* state hooks */
    const [input, setInput] = useState('');
    const[editLandmarkName, toggleEdit] = useState('');
    const [tpsMutex, toggleMutex] = useState(false);

    /* misc hooks */
    const client = useApolloClient();
    let history = useHistory();
    let location = useLocation();
    let { id } = useParams();

    /* our vars */
    const tps = props.viewerTps;
    let ancestors = location.state.ancestors;
    let siblings = location.state.siblings;
    let leftSibling = siblings.find((_, i, arr) => {
        return (i < (arr.length - 1) && arr[i+1]._id === id)
    });
    let rightSibling = siblings.find((_, i, arr) => {
        return (i > 0 && arr[i-1]._id === id)
    });
    // console.log('left: ' + JSON.stringify(leftSibling));
    // console.log('right: ' + JSON.stringify(rightSibling));
    let region = siblings.find((reg) => reg._id === id);
    let allSubregions = [];


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
    const { loading, error, data, refetch } = useQuery(GET_REGION_BY_ID, { variables : { id: id}, notifyOnNetworkStatusChange: true });
    if (loading) {console.log(loading, 'get region loading')};
    if (error) {console.log(error, 'get region error')};
    if (data) {
        region = data.getRegionById;
        // console.log("region: " + JSON.stringify(region));
        console.log('region.name: ' + region.name);
    }

    /* get ALL subregions */
    const { loading: subregionLoading, error: subregionError, data: subregionData, refetch: refetchAllSubregions } = useQuery(GET_ALL_SUBREGIONS, { variables: { id: id }, notifyOnNetworkStatusChange: true});
    if (subregionLoading) { console.log(subregionLoading, 'subregions loading')};
    if (subregionError) { console.log(subregionError, 'subregion error')};
    if (subregionData) {
        allSubregions = subregionData.getAllSubregions;
        // console.log('ALL subregions: ' + JSON.stringify(allSubregions));
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
            await refetch();
            toggleMutex(false);
            return retval;
        }
        
    }

    /* tps undo */
    const tpsUndo = async () => {
        if (!tpsMutex) {
            toggleMutex(true);
            const retval = await tps.undoTransaction();
            console.log(retval);
            await refetch();
            toggleMutex(false);
            return retval;
        }
    }

    const updateInput = (e) => {
        console.log('landmark input: ' + e.target.value);
        setInput(e.target.value);
    }

    const handleAddLandmark = async () => {
        if (input) {
            const oldValue = region.landmarks;
            let newValue = region.landmarks.slice();
            newValue.push(input);
            newValue = newValue.join();
            console.log('newValue ' + newValue);
            console.log('oldValue ' + oldValue);
            let transaction = new EditRegion_Transaction(id, 'landmarks', oldValue, newValue, SetRegionField);
            tps.addTransaction(transaction);
            setInput('');
            tpsRedo();
        }
    }

    const handleEditLandmark = async (e) => {
        // const newName = e.currentTarget.value;
        // if (newName) {
        //     const oldName = editLandmarkName;
        //     let newRegionLandmarks = region.landmarks.slice();
        //     let oldNameIndex = newRegionLandmarks.indexOf(oldName);
        //     newRegionLandmarks.splice(oldNameIndex, 1, newName);
        //     let transaction = new EditRegion_Transaction(id, 'landmarks', region.landmarks, newRegionLandmarks, SetRegionField);
        //     tps.addTransaction(transaction);
        //     toggleEdit('');
        //     tpsRedo();
        // } else {
        //     toggleEdit('');
        // }

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

    const handleKeyDown = (e) => {
        if (e.ctrlKey) {
            if (e.keyCode === 90) {
                tpsUndo();
            } else if (e.keyCode === 89) {
                tpsRedo();
            }
        }
    }

    return (
        props.user ? 
        <WLayout tabIndex='0' onKeyDown={handleKeyDown} wLayout='header' className='container-secondary'>
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
                        <WButton wType='texted' 
                                 className='arrow'
                                 disabled={!tps.hasTransactionToUndo()}
                                 onClick={tps.hasTransactionToUndo() ? () => {} : tpsUndo}>
                            <i className='material-icons'>undo</i>
                        </WButton>
                        <WButton wType='texted' 
                                 className='arrow'
                                 disabled={!tps.hasTransactionToRedo()}
                                 onClick={tps.hasTransactionToRedo() ? () => {} : tpsRedo}>
                            <i className='material-icons'>redo</i>
                        </WButton>
                    </WRow>
                    <WRow><img src='/flag.jpg' alt='flag' width='200' height='200'></img></WRow>
                    <WRow>
                        <WCol size='5'>Region Name:</WCol>
                        <WCol size='5'>{region.name}</WCol>
                    </WRow>
                    <WRow>
                        <WCol size='5'>Parent Region: </WCol>
                        <WCol size='4'>
                            <WButton className='parent-region-link table-link' wType='texted'
                                    onClick={() => goToAncestor({_id: ancestors[ancestors.length - 1]._id, name: ancestors[ancestors.length - 1].name})}>
                                {ancestors[ancestors.length - 1].name}
                            </WButton>
                        </WCol>
                        <WCol size='2'>
                            <WButton className='parent-region-link' wType='texted' 
                                    onClick={() => {console.log('change parent stub')}}>
                                <i className='material-icons small'>edit</i>
                            </WButton>
                        </WCol>
                    </WRow>
                    <WRow>
                        <WCol size='5'>Region Capital:</WCol>
                        <WCol size='5'>{region.capital}</WCol>
                    </WRow>
                    <WRow>
                        <WCol size='5'>Region Leader:</WCol>
                        <WCol size='5'>{region.leader}</WCol>
                    </WRow>
                    <WRow>
                        <WCol size='5'>Number of Subregions:</WCol>
                        <WCol size='5'>{allSubregions ? allSubregions.length : 0}</WCol>
                    </WRow>
                </WLMain>
                <WLMain className='viewer viewer-rside'>
                    <div>Region Landmarks</div>
                    <WLMain className='landmarks-editor'>
                        {
                            region.landmarks.length ? 
                            region.landmarks.map((landmark, index) => (
                                <WRow key={region._id + index} 
                                        className='landmark-row'>
                                    <WCol size='2'>
                                        <WButton className='delete-table-entry-btn'
                                                 wType='texted'>
                                            <i className='material-icons small'>close</i>
                                        </WButton>
                                    </WCol>
                                    <WCol size='10'>
                                        {
                                            editLandmarkName !== landmark ? 
                                            <WButton wType='texted' className='landmark-entry'
                                                     onClick={() => toggleEdit(landmark)}>
                                                {landmark}
                                            </WButton> 
                                            :
                                            <WInput wType='outlined'
                                                    className='map-edit-name'
                                                    inputType='text'
                                                    name='landmark'
                                                    placeholderText='Enter Landmark Name'
                                                    barAnimation='left-to-right'
                                                    labelAnimation='shrink'
                                                    hoverAnimation='solid'
                                                    autoFocus={true}
                                                    onBlur={handleEditLandmark}
                                            />
                                        }
                                    </WCol>
                                </WRow>
                            ))
                            :
                            null
                        }
                        {
                            allSubregions ? 
                            allSubregions.map((subregion) => (
                                subregion.landmarks.length ? 
                                subregion.landmarks.map((landmark, index) => (
                                    <WRow key={subregion._id + index} 
                                        className='landmark-row'>
                                        <WCol size='2'>
                                            <WButton className='invisible-btn'
                                                    wType='texted'>
                                                <i className='material-icons small'>close</i>
                                            </WButton>
                                        </WCol>
                                        <WCol size='10'>
                                            <WButton wType='texted' className='landmark-entry' disabled={false}
                                                     onClick={() => {}}>
                                                {`${landmark} - ${subregion.name}`}
                                            </WButton> 
                                        </WCol>
                                    </WRow>
                                ))
                                :
                                null
                            ))
                            :
                            null 
                        }
                    </WLMain>
                    <WRow className='input-landmark'>
                        <WCol size='1'>
                            <WButton className='add-region-btn add-landmark-btn' 
                                     wType='texted'
                                     onClick={handleAddLandmark}>
                                <i className='material-icons small'>add</i>
                            </WButton>
                        </WCol>
                        <WCol size='11'>
                        <WInput wType='outlined'
                                inputType='text'
                                id='newlandmark'
                                placeholderText='Add New Landmark'
                                barAnimation='left-to-right'
                                labelAnimation='shrink'
                                hoverAnimation='solid'
                                onBlur={updateInput}
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