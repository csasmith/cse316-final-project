import React from 'react';
import { WModal, WMHeader, WMMain, WButton } from 'wt-frontend';

const DeleteModal = (props) => {

    const handleDelete = (e) => {
        props.handleDelete(props.regionToDelete);
        props.setShowDelete(null);
    }

    return (
        <WModal visible={props.regionToDelete} cover={true} animation="slide-fade-top" className="delete-modal">
            <WMHeader className="modal-header" onClose={() => props.setShowDelete(null)}>
                Delete {props.label}?
			</WMHeader>

            <WMMain className='account-btns'>
                <WButton className="modal-button" onClick={handleDelete} clickAnimation="ripple-light" hoverAnimation="darken" shape="rounded" color="danger">
                    Delete
				</WButton>
                <label className="col-spacer">&nbsp;</label>
                <WButton className="modal-button cancel-button table-header-btn" onClick={() => props.setShowDelete(null)} wType="texted">
                    Cancel
				</WButton>
            </WMMain>
        </WModal>
    );
}

export default DeleteModal;