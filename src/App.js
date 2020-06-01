import React, { useState, useEffect } from "react";
import { Auth } from "aws-amplify";
import { Link, useHistory } from "react-router-dom";
import ErrorBoundary from "./components/ErrorBoundary";
import { AppContext } from "./libs/contextLib";
import { onError } from "./libs/errorLib";
import Routes from "./Routes";
import "./App.css";

import { makeStyles } from '@material-ui/core/styles';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import IconButton from '@material-ui/core/IconButton';
import ShoppingCartIcon from '@material-ui/icons/ShoppingCart';

const useStyles = makeStyles((theme) => ({
  root: {
    flexGrow: 1,
  },
  menuButton: {
    marginRight: theme.spacing(2),
  },
  title: {
    flexGrow: 1,
  },
  icon: {
    marginRight: theme.spacing(2),
  },
  heroContent: {
    // backgroundColor: theme.palette.background.paper,
    padding: theme.spacing(8, 0, 6),
  },
  heroButtons: {
    // marginTop: theme.spacing(4),
  },
  cardGrid: {
    // paddingTop: theme.spacing(8),
    paddingBottom: theme.spacing(8),
  },
  footer: {
    backgroundColor: theme.palette.background.paper,
    padding: theme.spacing(6),
  },
}));

function App() {
  const history = useHistory();
  const [isAuthenticating, setIsAuthenticating] = useState(true);
  const [isAuthenticated, userHasAuthenticated] = useState(false);

  const classes = useStyles();

  useEffect(() => {
    onLoad(); // uncomment
  }, []);

  async function onLoad() {
    try {
      await Auth.currentSession()
      userHasAuthenticated(true)
    }
    catch (e) {
      if (e !== 'No current user') {
        onError(e)
      }
    }
    setIsAuthenticating(false)
  }

  async function handleLogout() {
    await Auth.signOut()
    userHasAuthenticated(false)
    history.push("/login")
  }

  return (
    <div className="">
      <div className={classes.root}>
        <AppBar position="static" style={{ margin: 0 }} color="inherit">
          <Toolbar>
            <IconButton edge="start" className={classes.menuButton} color="inherit" aria-label="menu" component={Link} to="/">
              <ShoppingCartIcon />
            </IconButton>
            <Typography variant="h6" >
              ReactReserve
            </Typography>
            {isAuthenticated ? (
              <>
                <Typography variant="h6"
                  className={classes.title}
                >
                </Typography>
                <Button
                  color="inherit"
                  component={Link}
                  to="/card"
                >CARD</Button>
                <Button
                  color="inherit"
                  component={Link}
                  to="/orders"
                >ORDERS</Button>
                <Button
                  color="inherit"
                  onClick={handleLogout}
                >Logout</Button>
              </>
            ) : (
                <>
                  <Typography variant="h6"
                    className={classes.title}
                  >
                  </Typography>
                  <Button
                    color="inherit"
                    component={Link}
                    to="/signup"
                  >SIGNUP</Button>
                  <Button
                    color="inherit"
                    component={Link}
                    to="/login"
                  >LOGIN</Button>
                </>
              )}
          </Toolbar>
        </AppBar>
      </div>
      <ErrorBoundary>
        <AppContext.Provider value={{ isAuthenticated, userHasAuthenticated }}>
          <Routes />
        </AppContext.Provider>
      </ErrorBoundary>
    </div>)
}

export default App;
