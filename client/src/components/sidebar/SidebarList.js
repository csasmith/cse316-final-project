import React        from 'react';
import SidebarEntry from './SidebarEntry';

const SidebarList = (props) => {

    return (
        <>
            {
                props.todolists &&
                props.todolists.map(todo => (
                    <SidebarEntry
                        handleSetActive={props.handleSetActive} activeid={props.activeid}
                        id={todo.id} key={todo.id} name={todo.name} _id={todo._id}
                        updateListField={props.updateListField}
                    />
                ))
            }
        </>
    );
};

// filter out the todolist with activeid === id, then unshift it to todolists?

export default SidebarList;