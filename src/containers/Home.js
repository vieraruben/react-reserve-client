import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useAppContext } from "../libs/contextLib";
import { onError } from "../libs/errorLib";

import products from "../data/products.json"; // Load initial products list - Replace with Free API

import { makeStyles } from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';
import SearchButton from '../components/SearchButton';
import CssBaseline from '@material-ui/core/CssBaseline';
import Typography from '@material-ui/core/Typography';
import Container from '@material-ui/core/Container';
import Box from '@material-ui/core/Box';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import CardMedia from '@material-ui/core/CardMedia';

const useStyles = makeStyles((theme) => ({
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

export default function Home() {
  const { isAuthenticated } = useAppContext();
  const [isLoading, setIsLoading] = useState(true);
  const [search, setSearch] = useState("");

  const classes = useStyles();

  useEffect(() => {
    async function onLoad() {
      if (!isAuthenticated) {
        return;
      }
      setIsLoading(true);
      try {
      } catch (e) {
        onError(e);
      }
      setIsLoading(false);
    }
    onLoad();
  }, [isAuthenticated]);

  return (
    <div className={classes.root}>
      {isAuthenticated && <React.Fragment>
        <CssBaseline />
        <Container maxWidth="md">
          <Box display="flex" justifyContent="center" m={1} p={1} >
            <SearchButton 
            search={search}
            setSearch={setSearch}
            />
          </Box>
        </Container>
        <Container className={classes.cardGrid} maxWidth="md">
          <Grid container spacing={4}>
            {products.filter(product => product.title.toLocaleLowerCase().includes(search)).map((product, index) => (
              <Grid item key={index} xs={12} sm={6} md={4}>
                <Card className={classes.card} component={Link} to={`/product/${index}`}>
                  <CardMedia
                    className={classes.cardMedia}
                    image={product.url}
                    title={product.title}
                  />
                  <CardContent className={classes.cardContent}>
                    <Typography gutterBottom variant="h5" component="h2">
                      {product.title}
                    </Typography>
                    <Typography>
                      {`$${product.price}`}
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        </Container>
      </React.Fragment>}
    </div>
  );
}