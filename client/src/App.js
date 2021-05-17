import React 						from 'react';
import Welcome 						from './components/Welcome';
import CreateAccount 				from './components/CreateAccount';
import UpdateAccount				from './components/UpdateAccount';
import Login 						from './components/Login';
import Home							from './components/Home';
import RegionSpreadSheet			from './components/RegionSpreadSheet';
import RegionViewer					from './components/RegionViewer';
import { useApolloClient, 
		 useMutation,
		 useQuery } 				from '@apollo/client';
import * as queries 				from './cache/queries';
import { LOGOUT }					from './cache/mutations';
import { jsTPS } 					from './utils/jsTPS';
import { BrowserRouter, Switch,
		 useHistory,
		 Route, Redirect } 			from 'react-router-dom';
 
const App = () => {

	const [Logout] = useMutation(LOGOUT);

	const history = useHistory();
	const client = useApolloClient();

	let user = null;
    let sheetTps = new jsTPS();
	let viewerTps = new jsTPS();
	
    const { loading, error, data, refetch } = useQuery(queries.GET_USER, {fetchPolicy: 'no-cache', notifyOnNetworkStatusChange: true});

    if(error) { console.log(error) };
	if(loading) { console.log(loading, 'user loading') };
	if(data) { 
		let { getCurrentUser } = data;
		if(getCurrentUser !== null) { user = getCurrentUser; }
    }

	const logout = async (e) => {
        await Logout();
        const { _, error, data } = await refetch();
        if (error) {console.log(error.message)};
        if (data) {
            let reset = client.resetStore(); // store reset while query was in flight?
            if (reset) history.push('/');
        } else {
            history.push('/');
        }
    }

	return(
		<BrowserRouter>
			<Switch>
				<Redirect exact from='/' to='/welcome' />
				<Route path='/welcome'>
					<Welcome />
				</Route>
				<Route path='/register'>
					<CreateAccount fetchUser={refetch} />
				</Route>
				<Route path='/login'>
					<Login fetchUser={refetch} />
				</Route>
				<Route path='/update'>
					<UpdateAccount fetchUser={refetch} user={user} logout={logout} />
				</Route>
				<Route exact path='/home'>
					<Home fetchUser={refetch} user={user} logout={logout} />
				</Route>
				<Route path='/home/sheet/:id'>
                    <RegionSpreadSheet fetchUser={refetch} user={user} sheetTps={sheetTps} logout={logout} />
                </Route>
				<Route path='/home/view/:id'>
					<RegionViewer fetchuser={refetch} user={user} viewerTps={viewerTps} logout={logout} />
				</Route>
			</Switch>
		</BrowserRouter>
	);
}

/*
<BrowserRouter>
			<Switch>
				<Redirect exact from="/" to={ {pathname: "/home"} } />
				<Route 
					path="/home" 
					name="home" 
					render={() => 
						<Homescreen tps={transactionStack} fetchUser={refetch} user={user} />
					} 
				/>
				<Route/>
			</Switch>
		</BrowserRouter>
*/

export default App;