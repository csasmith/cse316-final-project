import React, { useState }          from 'react';
import { NavLink, Redirect,
         useHistory, useParams }    from 'react-router-dom';
import { WLayout, WLHeader, 
         WLMain, WNavbar, 
         WNavItem, WButton, 
         WRow, WCol}                from 'wt-frontend';
import { ADD_SUBREGION,
         LOGOUT }                   from '../cache/mutations';
import { GET_REGION_BY_ID}          from '../cache/queries';
import { useMutation,
         useQuery, 
         useApolloClient }          from '@apollo/client';

const RegionEntry = (props) => {


    return (
        props.subregion._id ? 
        <WRow>
            <WCol size='7'>
                <WRow className='table-header-row'>
                    <WCol className='table-col' size='4'>
                        <WButton className='delete-table-entry-btn' wType='texted' ><i className='material-icons small'>close</i></WButton>
                        <WButton wType='texted' className='table-link'
                                 onClick={() => props.goToSubregion(props.subregion._id)}>
                            {props.subregion.name}
                        </WButton>
                    </WCol>
                    <WCol className='table-col' size='4'>
                        {props.subregion.capital}
                    </WCol>
                    <WCol className='table-col' size='4'>
                        {props.subregion.leader}
                    </WCol>
                </WRow>
            </WCol>
            <WCol className='table-col' size='1'>
                img
            </WCol>
            <WCol className='table-col' size='4'>
                <WButton wType='texted' className='table-link'>{props.subregion.landmarks}</WButton>
            </WCol>
        </WRow>
        : null
    )
}

export default RegionEntry;