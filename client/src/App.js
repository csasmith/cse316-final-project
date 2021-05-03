import React 			from 'react';
import Welcome 			from './components/Welcome';
import CreateAccount 	from './components/CreateAccount';
import Login 			from './components/Login';
import Home				from './components/Home';
import { useQuery } 	from '@apollo/client';
import * as queries 	from './cache/queries';
import { jsTPS } 		from './utils/jsTPS';
import { BrowserRouter, Switch, Route, Redirect, Link } from 'react-router-dom';
 
const App = () => {
	let user = null;
    // let transactionStack = new jsTPS();
	
    const { loading, error, data, refetch } = useQuery(queries.GET_USER);

    if(error) { console.log(error); }
	if(loading) { console.log(loading); }
	if(data) { 
		let { getCurrentUser } = data;
		if(getCurrentUser !== null) { user = getCurrentUser; }
    }

	// consider hashrouter instead

	// do something like App should render Welcome component, -- maybe redirect '/' to '/welcome'
	// and then switch/routes to all different paths
	// then those components (either in their file, or maybe this one?)
	// check for auth and if no auth they redirect to '/'

	// history seems nice bc ie when verifying login can history.push('/home')
	// location nice bc we can save info for when we go back?
	// almost definitely use useParams, might not even have to use location bc of this

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
				<Route path='/home'>
					<Home fetchUser={refetch} user={user} />
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