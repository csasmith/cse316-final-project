import React, { useState, useEffect } 	from 'react';
import Logo 							from '../navbar/Logo';
import NavbarOptions 					from '../navbar/NavbarOptions';
import MainContents 					from '../main/MainContents';
import SidebarContents 					from '../sidebar/SidebarContents';
import Login 							from '../modals/Login';
import Delete 							from '../modals/Delete';
import CreateAccount 					from '../modals/CreateAccount';
import { GET_DB_TODOS } 				from '../../cache/queries';
import * as mutations 					from '../../cache/mutations';
import { useMutation, useQuery } 		from '@apollo/client';
import { WNavbar, WSidebar, WNavItem } 	from 'wt-frontend';
import { WLayout, WLHeader, WLMain, WLSide } from 'wt-frontend';
import { UpdateListField_Transaction, 
	UpdateListItems_Transaction, 
	ReorderItems_Transaction, 
	EditItem_Transaction, 
	SortColumn_Transaction} 				from '../../utils/jsTPS';
import WInput from 'wt-frontend/build/components/winput/WInput';


const Homescreen = (props) => {

	let todolists 							= [];
	const [activeList, setActiveList] 		= useState({});
	const [showDelete, toggleShowDelete] 	= useState(false);
	const [showLogin, toggleShowLogin] 		= useState(false);
	const [showCreate, toggleShowCreate] 	= useState(false);

	const [ReorderTodoItems] 		= useMutation(mutations.REORDER_ITEMS);
	const [UpdateTodoItemField] 	= useMutation(mutations.UPDATE_ITEM_FIELD);
	const [UpdateTodolistField] 	= useMutation(mutations.UPDATE_TODOLIST_FIELD);
	const [DeleteTodolist] 			= useMutation(mutations.DELETE_TODOLIST);
	const [DeleteTodoItem] 			= useMutation(mutations.DELETE_ITEM);
	const [AddTodolist] 			= useMutation(mutations.ADD_TODOLIST);
	const [AddTodoItem] 			= useMutation(mutations.ADD_ITEM);
	const [SetItems]				= useMutation(mutations.SET_ITEMS);


	const { loading, error, data, refetch } = useQuery(GET_DB_TODOS);
	if(loading) { console.log(loading, 'loading'); }
	if(error) { console.log(error, 'error'); }
	if(data) { 
		todolists = data.getAllTodos;
		if (activeList._id) {
			todolists = todolists.filter(list => list._id !== activeList._id)
			todolists.unshift(activeList);
		}
	}

	const auth = props.user === null ? false : true;

	const refetchTodos = async (refetch) => {
		const { loading, error, data } = await refetch();
		if (data) {
			todolists = data.getAllTodos;
			if (activeList._id) {
				let tempID = activeList._id;
				let list = todolists.find(list => list._id === tempID);
				setActiveList(list);
			}
		}
	}

	const tpsUndo = async () => {
		const retVal = await props.tps.undoTransaction();
		refetchTodos(refetch);
		return retVal;
	}

	const tpsRedo = async () => {
		const retVal = await props.tps.doTransaction();
		refetchTodos(refetch);
		return retVal;
	}


	// Creates a default item and passes it to the backend resolver.
	// The return id is assigned to the item, and the item is appended
	//  to the local cache copy of the active todolist. 
	const addItem = async () => {
		let list = activeList;
		const items = list.items;
		const lastID = items.length >= 1 ? items[items.length - 1].id + 1 : 0;
		const newItem = {
			_id: '',
			id: lastID,
			description: 'No Description',
			due_date: 'No Date',
			assigned_to: "Not Assigned",
			completed: false
		};
		let opcode = 1;
		let itemID = newItem._id;
		let listID = activeList._id;
		let transaction = new UpdateListItems_Transaction(listID, itemID, newItem, opcode, AddTodoItem, DeleteTodoItem);
		props.tps.addTransaction(transaction);
		tpsRedo();
	};


	const deleteItem = async (item, index) => {
		let listID = activeList._id;
		let itemID = item._id;
		let opcode = 0;
		let itemToDelete = {
			_id: item._id,
			id: item.id,
			description: item.description,
			due_date: item.due_date,
			assigned_to: item.assigned_to,
			completed: item.completed
		}
		let transaction = new UpdateListItems_Transaction(listID, itemID, itemToDelete, opcode, AddTodoItem, DeleteTodoItem, index);
		props.tps.addTransaction(transaction);
		tpsRedo();
	};

	const editItem = async (itemID, field, value, prev) => {
		let flag = 0;
		if (field === 'completed') flag = 1;
		let listID = activeList._id;
		let transaction = new EditItem_Transaction(listID, itemID, field, prev, value, flag, UpdateTodoItemField);
		props.tps.addTransaction(transaction);
		tpsRedo();

	};

	const reorderItem = async (itemID, dir) => {
		let listID = activeList._id;
		let transaction = new ReorderItems_Transaction(listID, itemID, dir, ReorderTodoItems);
		props.tps.addTransaction(transaction);
		tpsRedo();

	};


	const createNewList = async () => {
		props.tps.clearAllTransactions();
		const length = todolists.length
		const id = length >= 1 ? todolists[length - 1].id + Math.floor((Math.random() * 100) + 1) : 1; // just why?
		let list = {
			_id: '',
			id: id,
			name: 'Untitled',
			owner: props.user._id,
			items: [],
		}
		const { data } = await AddTodolist({ variables: { todolist: list }, refetchQueries: [{ query: GET_DB_TODOS }] });
		await refetchTodos(refetch);
		if (data) {
			let _id = data.addTodolist;
			let newList = todolists.find(list => list._id === _id);
			setActiveList(newList);
		}
	};

	const deleteList = async (_id) => {
		props.tps.clearAllTransactions();
		DeleteTodolist({ variables: { _id: _id }, refetchQueries: [{ query: GET_DB_TODOS }] });
		refetch();
		setActiveList({});
	};

	const updateListField = async (_id, field, value, prev) => { // this takes care of 
		let transaction = new UpdateListField_Transaction(_id, field, prev, value, UpdateTodolistField);
		props.tps.addTransaction(transaction);
		tpsRedo();

	};


	const sortColumn = async (col) => {
		if (activeList._id) { // which should always be true when called anyway...
			let prevItems = JSON.parse(JSON.stringify(activeList.items));
			let newItems = JSON.parse(JSON.stringify(activeList.items));
			
			// check if items are sorted, reverse sorted, or unsorted
			const isSorted = (arr, col, rev=false) => {
				return !rev ? 
					arr.every((item, index) => { // ascending
						return index === 0 || item[col].toString().localeCompare(arr[index - 1][col].toString()) >= 0
					})
					:
					arr.every((item, index) => { // descending
						return index === 0 || item[col].toString().localeCompare(arr[index - 1][col].toString()) <= 0
					});
			}
			if (isSorted(activeList.items, col) || isSorted(activeList.items, col, true)) {
				newItems.reverse();
			} else {
				newItems.sort((a, b) => a[col].toString().localeCompare(b[col].toString()));
			}
			let transaction = new SortColumn_Transaction(activeList._id, prevItems, newItems, SetItems);
			props.tps.addTransaction(transaction);
			tpsRedo();
		}
    }

	const handleSetActive = (id) => {
		props.tps.clearAllTransactions();
		const todo = todolists.find(todo => todo._id === id); // why the _id?
		setActiveList(todo);
	};

	
	/*
		Since we only have 3 modals, this sort of hardcoding isnt an issue, if there
		were more it would probably make sense to make a general modal component, and
		a modal manager that handles which to show.
	*/
	const setShowLogin = () => {
		toggleShowDelete(false);
		toggleShowCreate(false);
		toggleShowLogin(!showLogin);
	};

	const setShowCreate = () => {
		toggleShowDelete(false);
		toggleShowLogin(false);
		toggleShowCreate(!showCreate);
	};

	const setShowDelete = () => {
		toggleShowCreate(false);
		toggleShowLogin(false);
		toggleShowDelete(!showDelete)
	}

	const canUndo = () => {
		return props.tps.hasTransactionToUndo();
	}

	const canRedo = () => {
		return props.tps.hasTransactionToRedo();
	}

	const handleKeyDown = (event) => {
		console.log('hey');
		if (event.ctrlKey) {
			if (event.keyCode === 90) {
			  tpsUndo();
			} else if (event.keyCode === 89) {
			  tpsRedo();
			}
		}
	}

	return (
		<WLayout tabIndex='0' onKeyDown={handleKeyDown} wLayout="header-lside">
			<WLHeader>
				<WNavbar color="colored">
					<ul>
						<WNavItem>
							<Logo className='logo' />
						</WNavItem>
					</ul>
					<ul>
						<NavbarOptions
							fetchUser={props.fetchUser} auth={auth} 
							setShowCreate={setShowCreate} setShowLogin={setShowLogin}
							refetchTodos={refetch} setActiveList={setActiveList}
						/>
					</ul>
				</WNavbar>
			</WLHeader>

			<WLSide side="left">
				<WSidebar>
					{
						activeList ?
							<SidebarContents
								todolists={todolists} activeid={activeList._id} auth={auth}
								handleSetActive={handleSetActive} createNewList={createNewList}
								undo={tpsUndo} redo={tpsRedo}
								updateListField={updateListField}
							/>
							:
							<></>
					}
				</WSidebar>
			</WLSide>
			<WLMain>
				{
					activeList ? 
							<div className="container-secondary">
								<MainContents
									addItem={addItem} deleteItem={deleteItem}
									editItem={editItem} reorderItem={reorderItem}
									setShowDelete={setShowDelete}
									activeList={activeList} setActiveList={setActiveList}
									sortColumn={sortColumn}
									undo={tpsUndo} redo={tpsRedo}
									canUndo={canUndo} canRedo={canRedo}
								/>
							</div>
						:
							<div className="container-secondary" />
				}

			</WLMain>

			{
				showDelete && (<Delete isVisible={showDelete} deleteList={deleteList} activeid={activeList._id} setShowDelete={setShowDelete} />)
			}

			{
				showCreate && (<CreateAccount isVisible={showCreate} fetchUser={props.fetchUser} setShowCreate={setShowCreate} />)
			}

			{
				showLogin && (<Login isVisible={showLogin} fetchUser={props.fetchUser} refetchTodos={refetch}setShowLogin={setShowLogin} />)
			}

		</WLayout>
	);
};

export default Homescreen;