import React, { useState }          from 'react';
import { NavLink, Redirect,
         useHistory, useParams }    from 'react-router-dom';
import { WLayout, WLHeader, 
         WLMain, WNavbar, 
         WNavItem, WButton,
         WInput, 
         WRow, WCol}                from 'wt-frontend';
import { ADD_SUBREGION,
         LOGOUT }                   from '../cache/mutations';
import { GET_REGION_BY_ID}          from '../cache/queries';
import { useMutation,
         useQuery, 
         useApolloClient }          from '@apollo/client';

const RegionEntry = (props) => {

    const [editField, toggleEdit] = useState('');

    const editRegionEntry = (e) => {
        const _id = props.subregion._id;
        const field = editField; // or editField
        const oldValue = props.subregion[field];
        const newValue = e.currentTarget.value;
        if (newValue) {
            props.editRegionEntry(_id, field, oldValue, newValue);
        }
        toggleEdit('');
    }

    return (
        props.subregion._id ? 
        <WRow>
            <WCol size='7'>
                <WRow className='table-header-row'>
                    <WCol className='table-col' size='4'>
                        <WButton className='delete-table-entry-btn' 
                                 wType='texted' 
                                 onClick={() => props.handleDeleteSubregion(props.subregion)}>
                            <i className='material-icons small'>close</i>
                        </WButton>
                        {
                            editField !== 'name' ? 
                            <WButton wType='texted' className='table-link'
                                     onClick={() => props.goToSubregion(props.subregion._id)}>
                                {props.subregion.name}
                            </WButton> 
                            :
                            <WInput wType='outlined'
                                    className='map-edit-name'
                                    inputType='text'
                                    name='name'
                                    placeholderText='Enter Region Name'
                                    barAnimation='left-to-right'
                                    labelAnimation='shrink'
                                    hoverAnimation='solid'
                                    autoFocus={true}
                                    onBlur={editRegionEntry}
                            />
                        }
                        <WButton wType='texted' 
                                 className='table-name-edit' 
                                 onClick={(e) => toggleEdit('name')}>
                            <i className='material-icons small'>edit</i>
                        </WButton>
                    </WCol>
                    <WCol className='table-col' size='4'>
                        {
                            editField !== 'capital' ? 
                            <WButton wType='texted' 
                                     className='table-col' 
                                     onClick={() => toggleEdit('capital')}>
                                {props.subregion.capital}
                            </WButton>
                            :
                            <WInput wType='outlined'
                                    className='map-edit-name'
                                    inputType='text'
                                    name='capital'
                                    placeholderText='Enter Capital'
                                    barAnimation='left-to-right'
                                    labelAnimation='shrink'
                                    hoverAnimation='solid'
                                    autoFocus={true}
                                    onBlur={editRegionEntry}
                            />
                        }
                    </WCol>
                    <WCol className='table-col' size='4'>
                        {
                            editField !== 'leader' ? 
                            <WButton wType='texted' 
                                     className='table-col' 
                                     onClick={() => toggleEdit('leader')}>
                                {props.subregion.leader}
                            </WButton>
                            :
                            <WInput wType='outlined'
                                    className='map-edit-name'
                                    inputType='text'
                                    name='leader'
                                    placeholderText='Enter Leader'
                                    barAnimation='left-to-right'
                                    labelAnimation='shrink'
                                    hoverAnimation='solid'
                                    autoFocus={true}
                                    onBlur={editRegionEntry}
                            />
                        }
                    </WCol>
                </WRow>
            </WCol>
            <WCol className='table-col' size='1'>
                img
            </WCol>
            <WCol className='table-col' size='4'>
                <WButton wType='texted' className='table-link'
                         onClick={() => props.goToRegionView(props.subregion._id)}> 
                    {props.subregion.landmarks.join(', ')} 
                </WButton>
            </WCol>
        </WRow>

        : null
    )
}

export default RegionEntry;