import { gql } from "@apollo/client";

export const GET_USER = gql`
	query GetCurrentUser {
		getCurrentUser {
			_id
			name
		}
	}
`;

export const GET_MAPS = gql`
	query GetAllMaps {
		getAllMaps {
			_id
			name
			owner
			index
		}
	}
`;

export const GET_REGION_BY_ID = gql`
	query GetRegionById($id: String!) {
		getRegionById(_id: $id) {
			_id
			owner
			path
			name
			capital
			leader
			landmarks
			index
		}
	}
`;

export const GET_SUBREGIONS = gql`
	query GetSubregions($id: String!) {
		getSubregions(_id: $id) {
			_id
			owner
			path
			name
			capital
			leader
			landmarks
			index
		}
	}
`;

export const GET_ALL_SUBREGIONS = gql`
	query GetAllSubregions($id: String!) {
		getAllSubregions(_id: $id) {
			_id
			owner
			path
			name
			capital
			leader
			landmarks
			index
		}
	}
`;