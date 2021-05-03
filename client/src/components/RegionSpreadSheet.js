import React, { useState }          from 'react';
import { NavLink, Redirect,
         useHistory, useParams }    from 'react-router-dom';
import { WLayout, WLHeader, 
         WLMain, WNavbar, 
         WNavItem, WButton, 
         WLSide}                    from 'wt-frontend';
import { ADD_SUBREGION }            from '../cache/mutations';
import { useMutation, 
         useApolloClient }          from '@apollo/client';

const RegionSpreadSheet = (props) => {
    return (
        <WLayout>
            Yo
        </WLayout>
    );
}

export default RegionSpreadSheet;