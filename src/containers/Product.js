import React, { useState, useEffect } from "react";
import { Auth } from "aws-amplify";
import { useAppContext } from "../libs/contextLib";
import { onError } from "../libs/errorLib";
import { Link, useParams, useHistory } from "react-router-dom";
import { API } from "aws-amplify";
import ShoppingCartIcon from '@material-ui/icons/ShoppingCart';
import Button from '@material-ui/core/Button';
import CssBaseline from '@material-ui/core/CssBaseline';
import TextField from '@material-ui/core/TextField';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import Container from '@material-ui/core/Container';
import { makeStyles } from '@material-ui/core/styles';
import CardMedia from '@material-ui/core/CardMedia';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';

import products from "../data/products.json";

import CircularProgress from '@material-ui/core/CircularProgress';

const useStyles = makeStyles((theme) => ({
  rootList: {
    width: '100%',
    backgroundColor: theme.palette.background.paper,
  },
  alignItemsAndJustifyContent: {
    width: '100%',
    height: 80,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center'
  },
  paper: {
    marginTop: theme.spacing(8),
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
  },
  fab: {
    margin: theme.spacing(2),
  },
  absolute: {
    position: 'absolute',
    bottom: theme.spacing(2),
    right: theme.spacing(3),
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

export default function Product() {
  const classes = useStyles();
  const history = useHistory();
  const { id } = useParams();
  const { isAuthenticated } = useAppContext();
  const { userHasAuthenticated } = useAppContext();
  const [isLoading, setIsLoading] = useState(false);
  const [product, setProduct] = useState({});
  const [quantity, setQuantity] = useState(0);

  useEffect(() => {
    async function onLoad() {
      if (!isAuthenticated) {
        return;
      }
      setIsLoading(true);
      try {
        setProduct({ ...products[id], quantity: 0 })
      } catch (e) {
        onError(e);
      }
      setIsLoading(false);
    }
    onLoad();
  }, [isAuthenticated]);

  function createCardItem(item) {
    return API.put("reserve", `/cards`, {
      body: item
    });
  }

  async function handleSubmit(event) {
    event.preventDefault();
    if (quantity <= 0) {
      alert("Not allowed to add item to cart with quantity 0.");
      setQuantity(0)
      return
    }
    setIsLoading(true);
    try {
      await createCardItem({ ...product, quantity });
      history.push("/card");
    } catch (e) {
      // onError(e);
      setIsLoading(false);
    }

  }

  return (
    <React.Fragment>
      <CssBaseline />
      <br />
      <Container className={classes.cardGrid} maxWidth="md">
        {/* End hero unit */}
        <Grid container>
          <Grid item xs={12}>
            <List className={classes.rootList}>
              <ListItem>
                <Grid container spacing={4}>
                  <Grid item xs={12} sm={6} md={6}>
                    <CardMedia
                      className={classes.cardMedia}
                      image={product.url + ""}
                      title={product.title}
                    />
                  </Grid>
                  <Grid item xs={12} sm={6} md={6}>
                    <form className={classes.root} noValidate autoComplete="off" onSubmit={handleSubmit}>
                      <div>
                        <Typography variant="h6">
                          <strong>{product.title}</strong>
                        </Typography>
                        <Typography variant="h6">
                          {`${product.price}`}
                        </Typography>
                        <br />
                        <TextField
                          id="filled-number"
                          label="Number"
                          type="number"
                          value={quantity}
                          onChange={e => setQuantity(e.target.value)}
                          InputLabelProps={{
                            shrink: true,
                          }}
                          variant="filled"
                        />
                      </div>
                      <br />
                      <Button variant="contained" color="primary" type="submit">
                      <ShoppingCartIcon /> Add to Card
                    </Button>
                    </form>
                  </Grid>
                </Grid>
              </ListItem>
            </List>
          </Grid>
        </Grid>
      </Container>
    </React.Fragment>
  );
}






