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

// this seems like high trickery
export const GET_CHILDREN_LANDMARKS = gql`
	query GetChildrenLandmarks($id: String!) {
		getChildrenLandmarks(_id: $id)
	}
`;

export const GET_THIS_REGION_LANDMARKS = gql`
	query GetThisRegionLandmarks($id: String) {
		getThisRegionLandmarks(_id: $id)
	}
`;
