import { gql } from "@apollo/client";

/**
 * 
 * USER MUTATIONS
 * 
 */

// decided to return all User fields bc I think resolver returns User no? (does that even matter...)
export const LOGIN = gql`
	mutation Login($email: String!, $password: String!) {
		login(email: $email, password: $password) {
			_id
			name
			email
			password
		}
	}
`;

export const REGISTER = gql`
	mutation Register($name: String!, $email: String!, $password: String!) {
		register(name: $name, email: $email, password: $password) {
			_id
			name
			email
			password
		}
	}
`;

export const UPDATE = gql`
	mutation Update($name:String!, $email:String!, $password:String!) {
		update(name: $name, email: $email, password: $password) {
			_id
			name
			email
			password
		}
	}
`;

// also, why does this even need to be a mutation, go look at the resolver...
export const LOGOUT = gql`
	mutation Logout {
		logout 
	}
`;

/**
 * 
 * MAP MUTATIONS
 * 
 */

// add_item in todolist had index field for undo...
export const ADD_MAP = gql`
	mutation AddMap($map: MapInput!) {
		addMap(map: $map)
	}
`;

export const DELETE_MAP = gql`
	mutation DeleteMap($id: String!) {
		deleteMap(_id: $id)
	}
`;

export const SET_MAP_NAME = gql`
	mutation SetMapName($id: String!, $name: String!) {
		setMapName(_id: $id, name: $name)
	}
`;

/**
 * 
 * REGION MUTATIONS
 * 
 */

export const ADD_SUBREGION = gql`
	mutation AddSubRegion($subregion: RegionInput!) {
		addSubRegion(subregion: $subregion)
	}
`;

export const DELETE_SUBREGION = gql`
	mutation DeleteSubregion($id: String!) {
		deleteSubregion(_id: $id)
	}
`;

export const SET_REGION_FIELD = gql`
	mutation SetRegionField($id:String!, $field:String!, $val:String!) {
		setRegionField(_id: $id, field: $field, val: $val)
	}
`;

export const DELETE_ITEM = gql`
	mutation DeleteItem($itemId: String!, $_id: String!) {
		deleteItem(itemId: $itemId, _id: $_id) {
			_id
			id
			description
			due_date
			assigned_to
			completed
		}
	}
`;
