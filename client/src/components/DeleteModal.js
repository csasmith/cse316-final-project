import React from 'react';
import { WModal, WMHeader, WMMain, WButton } from 'wt-frontend';

const DeleteModal = (props) => {

    const handleDelete = (e) => {
        props.delete(props.relevantDeletionInformation);
        props.setShowDelete(false);
    }

    return (
        <WModal visible={props.isVisible} cover={true} animation="slide-fade-top" className="delete-modal">
            <WMHeader className="modal-header" onClose={() => props.setShowDelete(false)}>
                Delete {props.relevantDeletionInformation.name}?
			</WMHeader>

            <WMMain className='modal-main'>
                <WButton className="modal-button cancel-button" onClick={() => props.setShowDelete(false)} wType="texted">
                    Cancel
				</WButton>
                <label className="col-spacer">&nbsp;</label>
                <WButton className="modal-button" onClick={handleDelete} clickAnimation="ripple-light" hoverAnimation="darken" shape="rounded" color="danger">
                    Delete
				</WButton>
            </WMMain>
        </WModal>
    );
}

export default DeleteModal;