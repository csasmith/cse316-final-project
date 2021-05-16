import React, { useState } from 'react';
import { WModal, WMHeader, WMMain, WButton, WInput } from 'wt-frontend';

const CreateMapModal = (props) => {

    // do index stuff in resolver
    const [input, setInput] = useState({ _id: '', path: '', name: '', index: '' + props.mapsLength});

    const updateInput = (e) => {
        const { name, value } = e.target;
        const updated = { ...input, [name]: value };
        setInput(updated);
    }

    const handleCreate = async (e) => {
        console.log("hey!!!")
        if (!input['name']) {
            alert("Must fill out map name field");
            return
        }
        const { _, error, data } = await props.createMap({ variables: { subregion: input } });
        if (error) {
            console.log('input: ' + JSON.stringify(input));
            console.log(error.message);
            return
        }
        if (data.addSubregion === 'Error:DB') {
            alert("Failed to save new map");
            return
        }
        const mapId = data.addSubregion;
        console.log('mapId from handleCreate: ' + mapId);
        props.toggleShowCreate(false);
        props.selectMap(mapId);
    }

    return (
        <WModal visible={props.isVisible} cover={true} animation="slide-fade-top" className="create-modal">
            <WMHeader className="modal-header" onClose={() => props.toggleShowCreate(false)}>
                Create New Map
			</WMHeader>
            <WMMain className='account-content'>
                <WInput wType='outlined'
                        inputType='text'
                        name='name'
                        placeholderText='Enter New Map Name'
                        barAnimation='left-to-right'
                        labelAnimation='shrink'
                        hoverAnimation='solid'
                        onBlur={updateInput}
                />
                <div className='account-btns'>
                    <WButton className="modal-button" color='colored' 
                            onClick={handleCreate} hoverAnimation="lighten">
                        Create
                    </WButton>
                    <WButton className="modal-button" color='colored' 
                             onClick={() => props.toggleShowCreate(false)}
                             hoverAnimation='lighten'>
                        Cancel
                    </WButton>
                </div>
            </WMMain>
        </WModal>
    );
}

export default CreateMapModal;