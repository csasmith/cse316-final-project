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
	mutation Update($name: String!, $email: String!, $password: String!) {
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
 * REGION MUTATIONS
 * 
 */

export const ADD_SUBREGION = gql`
	mutation AddSubregion($subregion: RegionInput!) {
		addSubregion(subregion: $subregion)
	}
`;

// not sure how undo will work with this
export const DELETE_SUBREGION = gql`
	mutation DeleteSubregion($id: String!) {
		deleteSubregion(_id: $id) 
	}
`;

export const CHANGE_SUBREGION_PARENT = gql`
	mutation ChangeSubregionParent($subregion_id: String!, $newParent_id: String!) {
		changeSubregionParent(subregion_id: $subregion_id, newParent_id: $newParent_id)
	}
`;

export const SET_REGION_FIELD = gql`
	mutation SetRegionField($id:String!, $field:String!, $val:String!) {
		setRegionField(_id: $id, field: $field, val: $val)
	}
`;
