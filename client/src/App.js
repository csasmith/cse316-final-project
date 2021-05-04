import React 						from 'react';
import Welcome 						from './components/Welcome';
import CreateAccount 				from './components/CreateAccount';
import UpdateAccount				from './components/UpdateAccount';
import Login 						from './components/Login';
import Home							from './components/Home';
import RegionSpreadSheet			from './components/RegionSpreadSheet';
import RegionViewer					from './components/RegionViewer';
import { useQuery } 				from '@apollo/client';
import * as queries 				from './cache/queries';
import { jsTPS } 					from './utils/jsTPS';
import { BrowserRouter, Switch,
		 Route, Redirect } 			from 'react-router-dom';
 
const App = () => {
	let user = null;
    // let transactionStack = new jsTPS();
	
    const { loading, error, data, refetch } = useQuery(queries.GET_USER, {fetchPolicy: 'network-only'});

    if(error) { console.log(error); }
	if(loading) { console.log(loading); }
	if(data) { 
		let { getCurrentUser } = data;
		if(getCurrentUser !== null) { user = getCurrentUser; }
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
					<UpdateAccount fetchUser={refetch} user={user} />
				</Route>
				<Route exact path='/home'>
					<Home fetchUser={refetch} user={user} />
				</Route>
				<Route path='/home/sheet/:id'>
                    <RegionSpreadSheet fetchUser={refetch} user={user} />
                </Route>
				<Route path='/home/view/:id'>
					<RegionViewer fetchuser={refetch} user={user} />
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