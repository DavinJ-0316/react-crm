import * as React from 'react';
import '../styles.scss';
// import MuiThemeProvider from "@material-ui/core/styles/MuiThemeProvider";
import { ThemeProvider as MuiThemeProvider } from '@material-ui/core/styles';
import { Route } from 'react-router-dom';
import AppNavBar from '../components/AppNavBar';
import AppNavMenu from '../components/AppNavMenu';
import { WithWidth } from '@material-ui/core/withWidth';
import { withStyles, WithStyles } from '@material-ui/core/styles';
import themeDefault from '../theme-default';
import { connect } from 'react-redux';
import LoginPage from './SignInPage';
import styles from '../styles';
import { User } from '../types';

import { thunkAuth } from '../services/thunks';
import { SIGN_IN, HttpMethod, SIGN_OUT } from '../store/types';
import CustomerListPage from './CustomerListPage';
import CustomerFormPage from './CustomerFormPage';
import AboutPage from './AboutPage';

const isSmallsWindowScreen = () => {
  return window.innerWidth <= 600;
};
const drawerWidth = 250;

const useStyles = (navDrawerOpen: boolean) => {
  return {
    appBar: {
      position: 'fixed',
      top: 0,
      overflow: 'hidden',
      maxHeight: 58,
      minHeight: 0,
      width: navDrawerOpen ? `calc(100% - ${drawerWidth}px)` : `100%`,
      marginLeft: navDrawerOpen && !isSmallsWindowScreen() ? drawerWidth : 0,
    },
    drawer: {
      width: isSmallsWindowScreen() ? drawerWidth : 0,
      // flexShrink: 0,
      overflow: 'auto',
    },
    content: {
      // margin: '10px 20px 20px 15px',
      flexGrow: 1,
      paddingLeft: navDrawerOpen ? drawerWidth : 0,
    },
  };
};

type AppProps = {
  children: React.ReactChildren;
  isAuthenticated: boolean;
  errorMessage: string;
  user: User;
  isFetching: boolean;
  signInUser: typeof thunkAuth;
  signOutUser: typeof thunkAuth;
} & WithStyles<typeof styles> &
  WithWidth;

interface AppState {
  navDrawerOpen: boolean;
  isSmallScreen: boolean;
}

class App extends React.Component<AppProps, AppState> {
  constructor(props) {
    super(props);
    this.state = {
      navDrawerOpen: !isSmallsWindowScreen(),
      isSmallScreen: isSmallsWindowScreen(),
    };
    this.signOut = this.signOut.bind(this);
  }

  signInAction = {
    type: SIGN_IN,
    endpoint: 'login/',
    method: HttpMethod.POST,
    data: {},
  };

  signOutAction = {
    type: SIGN_OUT,
    endpoint: 'logout/',
    method: HttpMethod.GET,
    data: {},
  };

  componentDidMount() {
    window.addEventListener('resize', this.resize.bind(this));
    this.resize();
  }

  handleDrawerToggle() {
    this.setState({
      navDrawerOpen: !this.state.navDrawerOpen,
    });
  }

  resize() {
    this.setState({
      isSmallScreen: isSmallsWindowScreen(),
    });
  }

  signIn(c) {
    debugger;
    console.log(c);
    this.signInAction.data = c;
    this.props.signInUser(this.signInAction);
  }

  signOut() {
    this.props.signOutUser(this.signOutAction);
  }

  render() {
    const { isAuthenticated, user } = this.props;

    const firstname = user && user.firstname ? user.firstname : '';
    const lastname = user && user.lastname ? user.lastname : '';

    let { navDrawerOpen, isSmallScreen } = this.state;
    const appStlyes = useStyles(navDrawerOpen);

    return (
      <MuiThemeProvider theme={themeDefault}>
        {/* <CssBaseline /> */}
        <div>
          {isAuthenticated && (
            // isFetching &&
            <div>
              <AppNavBar styles={appStlyes} handleDrawerToggle={this.handleDrawerToggle.bind(this)}></AppNavBar>
              {/* <React.Fragment> */}
              <AppNavMenu
                drawerStyle={appStlyes.drawer}
                navDrawerOpen={navDrawerOpen}
                username={`${firstname} ${lastname}`}
                onLogoutClick={this.signOut}
                handleDrawerToggle={this.handleDrawerToggle.bind(this)}
                isSmallScreem={isSmallScreen}
              />
              {/* </React.Fragment> */}
              <div style={appStlyes.content}>
                <Route exact path={`/customers`} component={CustomerListPage} />
                <Route path={`/customer/:id`} component={CustomerFormPage} />
                <Route path={`/newcustomer/`} component={CustomerFormPage} />
                <Route path={`/about`} component={AboutPage} />
              </div>
            </div>
          )}
          {!isAuthenticated && <LoginPage onSignInClick={creds => this.signIn(creds)} />}
        </div>
      </MuiThemeProvider>
    );
  }
}

function mapStateToProps(state) {
  const { auth } = state;
  const { isFetching, isAuthenticated, user } = auth;

  return {
    isAuthenticated,
    isFetching,
    // errorMessage,
    user,
  };
}

function mapDispatchToProps(dispatch) {
  return {
    signInUser: (action: TODO) => dispatch(thunkAuth(action)),
    signOutUser: (action: TODO) => dispatch(thunkAuth(action)),
  };
}

export default withStyles(styles)(connect(mapStateToProps, mapDispatchToProps)(App));