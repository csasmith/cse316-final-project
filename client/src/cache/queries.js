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

export const GET_MAP_BY_ID = gql`
	query GetMapById($id: String!) {
		getMapById(_id: $id) {
			_id
			name
			owner
			regions {
				_id
				map
				name
				parent
				capital
				leader
				landmarks
			}
		}
	}
`;

export const GET_REGION_BY_ID = gql`
	query GetRegionById($id: String!) {
		getRegionById(_id: $id) {
			_id
			map
			name
			parent
			subregions {
				_id
				map
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
