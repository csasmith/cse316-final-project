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
		}
	}
`;

export const GET_REGION_BY_ID = gql`
	query GetRegionById($id: String!) {
		getRegionById(_id: $id) {
			_id
			owner
			name
			parent
			subregions {
				_id
				owner
				name
				parent
				capital
				leader
				landmarks
			}
			capital
			leader
			landmarks
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
