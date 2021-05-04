import React, { useState }          from 'react';
import { NavLink, Redirect,
         useHistory, useParams,
         useLocation }              from 'react-router-dom';
import { WLayout, WLHeader, 
         WLMain, WNavbar, 
         WNavItem, WButton, 
         WRow, WCol, WInput}        from 'wt-frontend';
import { LOGOUT }                   from '../cache/mutations';
import { GET_REGION_BY_ID }         from '../cache/queries';
import { useMutation,
         useQuery, 
         useApolloClient }          from '@apollo/client';

const RegionViewer = (props) => {

    const [Logout] = useMutation(LOGOUT);
    const client = useApolloClient();
    let history = useHistory();
    let location = useLocation();
    let { id } = useParams();
    let regionData = {};
    let ancestors = location.state.ancestors; // [{id: id, name: name}]
    console.log("ancestors: " + JSON.stringify(ancestors));

    const { _, error, data, refetch } = useQuery(GET_REGION_BY_ID, { variables : { id: id}, fetchPolicy: 'network-only' });
    if (error) {console.log(error, 'error')};
    if (data) {
        regionData = data.getRegionById;
        // console.log("regionData: " + JSON.stringify(regionData));
        console.log('regionData.name: ' + regionData.name);
    }

    const goToAncestor = (entry) => {
        ancestors.splice(ancestors.indexOf(entry));
        console.log('newAncestors: ' + JSON.stringify(ancestors));
        history.push({ pathname: `/home/sheet/${entry.id}`, state: { ancestors: ancestors }});
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
                    <ul>
                        <WButton className='arrow leftarrow' wType='texted'>
                            <i className='material-icons'>arrow_back</i>
                        </WButton>
                        <WButton className='arrow rightarrow' wType='texted'>
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
                        <WCol size='6'>{regionData.name}</WCol>
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
                        <WCol size='6'>{regionData.capital}</WCol>
                    </WRow>
                    <WRow>
                        <WCol size='6'>Region Leader:</WCol>
                        <WCol size='6'>{regionData.leader}</WCol>
                    </WRow>
                    <WRow>
                        <WCol size='6'>Number of Subregions:</WCol>
                        <WCol size='6'>{regionData.subregions ? regionData.subregions.length : 0}</WCol>
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