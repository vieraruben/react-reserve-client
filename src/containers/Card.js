import React, { useState, useEffect } from "react";
import { API } from "aws-amplify";
import { useParams, useHistory } from "react-router-dom";
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

import CircularProgress from '@material-ui/core/CircularProgress';

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

export default function CardComponent() {
  const [cardItems, setCardItems] = useState([]);
  const { isAuthenticated } = useAppContext();
  const [isLoading, setIsLoading] = useState(true);
  const [total, setTotal] = useState(0);
  const history = useHistory();
  const classes = useStyles();

  useEffect(() => {
    async function onLoad() {
      if (!isAuthenticated) {
        return;
      }
      setIsLoading(true);
      try {
        const result = await loadCardItems()
        let total = 0;
        for (let index = 0; index < result.length; index++)
          total += result[index].price * 1 * result[index].quantity

        if (total > 0) {
          setTotal(total)
          setCardItems(result)
        }
      } catch (e) {
        onError(e);
      }
      setIsLoading(false);
    }
    onLoad();
  }, [isAuthenticated]);

  async function loadCardItems() {
    return API.get("reserve", "/cards");
  }

  function deleteCardItem(SK) {
    return API.del("reserve", "/cards", {
      body: {
        "cardId": SK
      }
    });
  }

  async function handleDelete(item) {
    const confirmed = window.confirm(
      "Are you sure you want to delete this item?"
    );
    if (!confirmed) {
      return;
    }
    try {
      await deleteCardItem(item.SK)
      setTotal(total-(item.price*1*item.quantity))
      const result = await loadCardItems()
      setCardItems(result)
    } catch (error) {
      console.log(error)
    }
  }

  function createOrder(items) {
    return API.put("reserve", `/orders`, {
      body: {
        items: items
      }
    });
  }

  async function handleCheckout() {
    try {
      setIsLoading(true)
      await createOrder(cardItems)
      for (let index = 0; index < cardItems.length; index++) // Clear Shopping Card
        await deleteCardItem(cardItems[index].SK)
      setIsLoading(false)
      history.push("/orders");
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
                {cardItems.map((item, key) => <ListItem key={key}>
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
                            {item.quantity}*${item.price.toFixed(2)}
                          </Typography>
                          <br />
                        </div>
                        <br />
                        <Button variant="contained" color="secondary" onClick={() => handleDelete(item)}>
                          REMOVE
                    </Button>
                      </form>
                    </Grid>
                  </Grid>
                </ListItem>
                )}
                {total == 0 && <ListItem>
                  <Typography variant="h6">
                    Card is Empty!
                          </Typography>
                </ListItem>}
                <Divider component="li" />
                {(cardItems.length > 0) && <ListItem>
                  <Grid container spacing={4}>
                    <Grid item xs={9}>
                      <Typography variant="h6">
                        <strong>Sub Total:</strong> ${total.toFixed(2)}
                      </Typography>
                    </Grid>
                    <Grid item xs={3}>
                      <Button variant="contained" color="primary" onClick={() => handleCheckout()}>
                        CHECKOUT
                        </Button>
                    </Grid>
                  </Grid>
                </ListItem>}
              </List>
            </Grid>
          </Grid>
        </Container>
      </React.Fragment>
    </div>
  );
}
