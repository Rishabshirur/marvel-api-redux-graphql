import React, { useState } from 'react';
import { useQuery } from '@apollo/client';
import { FETCH_COMICS } from '../queries';
import noImage from '../img/download.jpeg';
import { useDispatch, useSelector } from 'react-redux';
import { useParams, Link } from 'react-router-dom';
import * as actions from '../actions';
import ErrorPage from './ErrorPage';
import {
  Card,
  CardContent,
  CardMedia,
  CardActionArea,
  Link as MuiLink,
  Typography,
  CardHeader,
  Grid,
  Button,
  Box
} from '@mui/material';
import Snackbar from '@mui/material/Snackbar';
import MuiAlert from '@mui/material/Alert';


function MarvelComicsPage() {
  const dispatch = useDispatch();
  const collections = useSelector((state) => state.collections);
  const [selectedColl, setSelectedColl]=useState(collections.selectedSubCollectionId)
  const { pagenum } = useParams();
  const pageNum = parseInt(pagenum, 10);
  const [selectedComics, setSelectedComics] = useState([]);
  const [open, setOpen] = React.useState(false);
  const [open1, setOpen1] = React.useState(false);
  const Alert = React.forwardRef(function Alert(props, ref) {
    return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
  });

  const { loading, error, data } = useQuery(FETCH_COMICS, {
    variables: { pageNum },
  });
  
  if (loading) return <p>Loading...</p>;
  if (error) return <ErrorPage></ErrorPage>
  const regex = /(<([^>]+)>)/gi;

  const selectedSubCollection = collections.subCollections.find((collection) => collection.id === selectedColl);

  const allComicIds = selectedSubCollection ? selectedSubCollection.comics.map((comic) => comic.comicId) : [];
  
  console.log(allComicIds);
  if(pageNum<1 || pageNum > Math.ceil(data.totalComics/20)){
    return <ErrorPage></ErrorPage>
    }

  // const selectedSubCollection = useSelector((state) => state.selectedSubCollection);
  // const dispatch = useDispatch();
  const handleClose = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }
    setOpen1(false);
    setOpen(false);
  };

  const handleCollect = (event, comicId,comicTitle) => {
    event.stopPropagation();
    console.log(allComicIds.length)
    if(allComicIds.length>19){
      
      return setOpen1(true);
    }
    if(!selectedColl){
      setOpen(true);
    }

    dispatch(actions.addCollection(comicId,selectedColl,comicTitle))
  };

  const handleGiveUp = (event, comicId) => {
    event.stopPropagation();
    dispatch(actions.deleteCollection(comicId,selectedColl))
  };

  // const handleSelectSubCollection = (subCollectionId) => {
  //   dispatch(selectSubCollection(subCollectionId));
  // };
  return (
    <div>
      <Box sx={{ textAlign: 'center', marginTop: 2, marginBottom: 2 }}>
        {pageNum > 1 && (
          <Button
            component={Link}
            to={`/marvel-comics/page/${pageNum - 1}`}
            variant="contained"
            color="primary"
            sx={{ marginRight: 1 }}
          >
            Previous Page
          </Button>
        )}{
          `Page ${pageNum} of `+(Math.ceil(data.totalComics/50)) 
        }
        {data.comics.length > 0 && (pageNum < Math.ceil(data.totalComics/50)) && (
          <Button
            component={Link}
            to={`/marvel-comics/page/${pageNum + 1}`}
            variant="contained"
            color="primary"
          >
            Next Page
          </Button>
        )}
      </Box>
      <Grid
        container
        spacing={2}
        sx={{
          flexGrow: 1,
          flexDirection: 'row',
        }}
      >
        {data.comics.map((comic) => (
          <Grid item xs={12} sm={7} md={5} lg={4} xl={3} key={comic.id}>
          <div>
          
            <Card
              variant='outlined'
              sx={{
                maxWidth: 250,
                height: 'auto',
                marginLeft: 'auto',
                marginRight: 'auto',
                borderRadius: 5,
                border: '1px solid #1e8678',
                boxShadow:
                  '0 19px 38px rgba(0,0,0,0.30), 0 15px 12px rgba(0,0,0,0.22);',
              }}
            >
             <Link to={`/marvel-comics/${comic.id}`}> 
                <CardMedia
                  sx={{
                    height: '100%',
                    width: '100%',
                    ...(comic.images[0] && comic.images[0].extension
                    ? {}
                    : { height: '375px' }),
                       }}
                  component='img'
                  image={
                    comic.images[0] && comic.images[0].extension
                      ? `${comic.images[0].path}.${comic.images[0].extension}`
                      : noImage
                  }
                  title='show image'

                />
                </Link> 

                <CardContent>
                <Link to={`/marvel-comics/${comic.id}`}> 
                  <Typography
                    sx={{
                      borderBottom: '1px solid #1e8678',
                      fontWeight: 'bold',
                      paddingRight: 2,
                    }}
                    gutterBottom
                    variant='h6'
                    component='h3'
                  >
                    {comic.title}
                  </Typography>
                  </Link>
                  <Typography variant='body2' color='textSecondary' component='p' paddingRight={2}>
                    {comic.description
                      ? comic.description.replace(regex, '').substring(0, 139) + '...'
                      : 'No Description'}
                  
                  </Typography>
                  <Typography>{comic.id}</Typography>
                  <Button
                    onClick={(event) => {

                      handleCollect(event, comic.id,comic.title)}}
                    disabled={allComicIds.includes(comic.id)}
                  >
                    Collect
                  </Button>
                  <Button
                    onClick={(event) => handleGiveUp(event, comic.id)}
                    disabled={!(allComicIds.includes(comic.id))}
                  >
                    Give Up
                  </Button>
                </CardContent>
            
              
            </Card>
         
            </div>
          </Grid>
        ))}
      </Grid>
      <Snackbar open={open} autoHideDuration={6000} onClose={handleClose}>
        <Alert onClose={handleClose} severity="error" sx={{ width: '100%' }}>
          Please select the collection first!
        </Alert>
      </Snackbar>
      <Snackbar open={open1} autoHideDuration={6000} onClose={handleClose}>
        <Alert onClose={handleClose} severity="warning" sx={{ width: '100%' }}>
          Maximum 20 comics can be collected for a collection
        </Alert>
      </Snackbar>
    </div>
  );
}

export default MarvelComicsPage;