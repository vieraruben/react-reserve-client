import React, { useState, useEffect } from "react";
import { API } from "aws-amplify";
import { Link } from "react-router-dom";
import { useAppContext } from "../libs/contextLib";
import { onError } from "../libs/errorLib";

import { makeStyles } from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';
import CssBaseline from '@material-ui/core/CssBaseline';
import Typography from '@material-ui/core/Typography';
import Container from '@material-ui/core/Container';
import Button from '@material-ui/core/Button';
import CardMedia from '@material-ui/core/CardMedia';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import Divider from '@material-ui/core/Divider';

const useStyles = makeStyles((theme) => ({
  rootList: {
    width: '100%',
    backgroundColor: theme.palette.background.paper,
  },
  root: {
    flexGrow: 1,
  },
  paper: {
    padding: theme.spacing(2),
    textAlign: 'center',
    color: theme.palette.text.secondary,
  },
  fab: {
    margin: theme.spacing(2),
  },
  absolute: {
    position: 'absolute',
    bottom: theme.spacing(2),
    right: theme.spacing(3),
  },
  cardGrid: {
    // paddingTop: theme.spacing(8),
    paddingBottom: theme.spacing(8),
  },
  card: {
    height: '100%',
    display: 'flex',
    flexDirection: 'column',
  },
  cardMedia: {
    paddingTop: '56.25%', // 16:9
  },
  cardContent: {
    flexGrow: 1,
  },
}));

export default function Orders() {
  const [orders, setOrders] = useState([]);
  const { isAuthenticated } = useAppContext();
  const [isLoading, setIsLoading] = useState(true);
  const [total, setTotal] = useState(0);


  const classes = useStyles();

  useEffect(() => {
    async function onLoad() {
      if (!isAuthenticated) {
        return;
      }
      setIsLoading(true);
      try {
        const orders = await loadOrders()
        setOrders(orders)
      } catch (e) {
        onError(e);
      }
      setIsLoading(false);
    }
    onLoad();
  }, [isAuthenticated]);

  async function loadOrders() {
    return API.get("reserve", "/orders");
  }

  function deleteOrder(SK) {
    console.log(SK)
    return API.del("reserve", "/orders", {
      body: {
        "oderId": SK
    }
    });
  }

  async function handleCancel(key) {
    const SK = orders[key].SK
    const confirmed = window.confirm(
      "Are you sure you want to cancel this order?"
    );

    if (!confirmed) {
      return;
    }
    try {
      await deleteOrder(SK)
      const orders = await loadOrders()
      setOrders(orders)
    } catch (error) {
      console.log(error)
    }
  }

  return (
    <div className={classes.root}>
      <React.Fragment>
        <CssBaseline />
        <br />
        <Container className={classes.cardGrid} maxWidth="md">
          <Grid container>
            <Grid item xs={12}>
              <List className={classes.rootList}>
                {orders.map((order, key) => <React.Fragment key={key}>
                  <Divider component="li" />
                  <ListItem>
                    <Grid container spacing={4}>
                      <Grid item xs={9}>
                        <Typography variant="h6">
                          <strong>ORDER#{order.SK.substring(6, 14)}</strong>
                        </Typography>
                      </Grid>
                      <Grid item xs={3}>
                        <Button variant="contained" color="secondary" onClick={() => handleCancel(key)}>
                          Cancel
                      </Button>
                      </Grid>
                    </Grid>
                  </ListItem>
                  <Divider component="li" />
                  {order.items.map((item, key) => <ListItem key={key}>
                    <Grid container spacing={4}>
                      <Grid item xs={12} sm={6} md={6}>
                        <CardMedia
                          className={classes.cardMedia}
                          image={item.url + ""}
                          title={item.title}
                        />
                      </Grid>
                      <Grid item xs={12} sm={5} md={6}>
                        <form className={classes.root} noValidate autoComplete="off">
                          <div>
                            <Typography variant="h6">
                              <strong>{item.price}</strong>
                            </Typography>
                            <Typography variant="h6">
                              {item.quantity}*${item.price}
                            </Typography>
                            <br />
                          </div>
                        </form>
                      </Grid>
                    </Grid>
                  </ListItem>
                  )}
                </React.Fragment>)}
                {!isLoading && (orders.length==0) &&<ListItem>
                  <Typography variant="h6">
                    You don't have any orders in the system!
                          </Typography>
                </ListItem>}
              </List>
            </Grid>
          </Grid>
        </Container>
      </React.Fragment>
    </div>
  );
}
