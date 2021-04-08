import React from 'react';

import { WButton, WRow, WCol } from 'wt-frontend';

const TableHeader = (props) => {

    const buttonStyle = props.disabled ? ' table-header-button-disabled ' : 'table-header-button ';
    const undoStyle = props.canUndo() ? '' : 'general-disable';
    const redoStyle = props.canRedo() ? '' : 'general-disable';
    const clickDisabled = () => { };

    return (
        <WRow className="table-header">
            <WCol size="3">
                <WButton className='table-header-section' onClick={props.disabled ? clickDisabled : () => props.sortColumn('description')} wType="texted" >Task</WButton>
            </WCol>
            <WCol size="2">
                <WButton className='table-header-section' onClick={props.disabled ? clickDisabled : () => props.sortColumn('due_date')} wType="texted">Due Date</WButton>
            </WCol>

            <WCol size="2">
                <WButton className='table-header-section' onClick={props.disabled ? clickDisabled : () => props.sortColumn('completed')} wType="texted" >Status</WButton>
            </WCol>

            <WCol size="2">
                <WButton className='table-header-section' onClick={props.disabled ? clickDisabled : () => props.sortColumn('assigned_to')} wType="texted" >Assigned To</WButton>
            </WCol>

            <WCol size="3">
                <div className="table-header-buttons">
                    <WButton className={`${undoStyle} ${buttonStyle}`} onClick={props.disabled ? clickDisabled : props.undo} wType="texted" clickAnimation="ripple-light" shape="rounded">
                        <i className="material-icons">undo</i>
                    </WButton>
                    <WButton className={`${redoStyle} ${buttonStyle}`} onClick={props.disabled ? clickDisabled : props.redo} wType="texted" clickAnimation="ripple-light" shape="rounded">
                        <i className="material-icons">redo</i>
                    </WButton>
                    <WButton onClick={props.disabled ? clickDisabled : props.addItem} wType="texted" className={`${buttonStyle}`}>
                        <i className="material-icons">add_box</i>
                    </WButton>
                    <WButton onClick={props.disabled ? clickDisabled : props.setShowDelete} wType="texted" className={`${buttonStyle}`}>
                        <i className="material-icons">delete_outline</i>
                    </WButton>
                    <WButton onClick={props.disabled ? clickDisabled : () => props.setActiveList({})} wType="texted" className={`${buttonStyle}`}>
                        <i className="material-icons">close</i>
                    </WButton>
                </div>
            </WCol>

        </WRow>
    );
};

export default TableHeader;