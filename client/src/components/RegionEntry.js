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
        <WRow>
            <WCol size='7'>
                <WRow className='table-header-row'>
                    <WCol size='4'>
                        Rawr
                    </WCol>
                    <WCol className='table-header-col' size='4'>
                        Rawr
                    </WCol>
                    <WCol className='table-header-col' size='4'>
                        Rawr
                    </WCol>
                </WRow>
            </WCol>
            <WCol className='table-header-col' size='1'>
                Rawr
            </WCol>
            <WCol className='table-header-col' size='4'>
                Rawr
            </WCol>
        </WRow>
    )
}

export default RegionEntry;