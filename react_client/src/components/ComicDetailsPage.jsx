import React, { useState } from 'react';
import { useQuery } from '@apollo/client';
import { FETCH_COMIC_BY_ID } from '../queries';
import { useParams,Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import noImage from '../img/download.jpeg';
import parse from 'html-react-parser';
import * as actions from '../actions';
import {
  Card,
  CardContent,
  CardMedia,
  Typography,
  CardHeader,
  Button
} from '@mui/material';
import Snackbar from '@mui/material/Snackbar';
import MuiAlert from '@mui/material/Alert';
import ErrorPage from './ErrorPage';


const findOnSaleDate = (dates) => {
  const onSaleDate = dates.find(date => date.type === "onsaleDate");
  let formattedDate;
  if(onSaleDate){
    const parsedDate = new Date(onSaleDate.date);

    const options = { year: 'numeric', month: 'long', day: 'numeric', hour: 'numeric', minute: 'numeric', second: 'numeric', timeZoneName: 'short' };
    formattedDate = new Intl.DateTimeFormat('en-US', options).format(parsedDate);
    
    console.log(formattedDate);
  }
  return onSaleDate ? formattedDate : 'N/A';
};

const findPrintPrice = (prices) => {
  const printPrice = prices.find(price => price.type === "printPrice");
  return printPrice ? printPrice.price : 'N/A';
};

function ComicDetailsPage() {
  const { id } = useParams();
  const [open, setOpen] = React.useState(false);
  const [open1, setOpen1] = React.useState(false);
  const dispatch = useDispatch();
  const collections = useSelector((state) => state.collections);
  const [selectedColl, setSelectedColl]=useState(collections.selectedSubCollectionId)
  const selectedSubCollection = collections.subCollections.find((collection) => collection.id === selectedColl);

  // Retrieve an array of all comic IDs for the selected sub-collection
  const allComicIds = selectedSubCollection ? selectedSubCollection.comics.map((comic) => comic.comicId) : [];
  const Alert = React.forwardRef(function Alert(props, ref) {
    return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
  });
  const handleClose = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }
    setOpen1(false);
    setOpen(false);
  };

  const handleCollect = (event, comicId,comicTitle) => {
    event.stopPropagation();
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

  const { loading, error, data } = useQuery(FETCH_COMIC_BY_ID, {
    variables: {  id: parseInt(id, 10) },
  });

  if (loading) return <p>Loading...</p>;
  if (error) return <ErrorPage></ErrorPage>;

  const comic = data.comic;

  return (
  <>
  <Link to='/marvel-comics/page/1'>Back to all comics...</Link>
    <Card
  variant='outlined'
  sx={{
    maxWidth: 600,
    height: 'auto',
    marginLeft: 'auto',
    marginRight: 'auto',
    borderRadius: 5,
    border: '1px solid #1e8678',
    boxShadow: '0 19px 38px rgba(0,0,0,0.30), 0 15px 12px rgba(0,0,0,0.22);'
  }}
>
  <CardHeader 
    title={comic.title}
    sx={{
      borderBottom: '1px solid #1e8678',
      fontWeight: 'bold'
    }}
  />
  <CardMedia
    component='img'
    image={
      comic.images[0] && comic.images[0].extension 
      ? `${comic.images[0].path}.${comic.images[0].extension}`
      : noImage
      }
    title='show image'
  />

  <CardContent>
    <Typography
      variant='body2'
      color='textSecondary'
      component='div'
      sx={{
        borderBottom: '1px solid #1e8678',
    fontWeight: 'bold',
    padding: 2,
    maxWidth: 500,
    wordWrap: 'break-word',
      }}
    >
      <dl>
        <div>
          <dt className='title'>Description:</dt>
          <dd >
            {comic.description? 
              parse(comic.description)
            : (
              'N/A'
            )
            }
          </dd>
        </div>
      </dl>


      <dl>
        <div>
          <dt className='title'>PrintPrice:</dt>
          <dd>
            {comic.prices && Array.isArray(comic.prices)? 
              findPrintPrice(comic.prices)
            : (
              'N/A'
            )
            }
          </dd>
        </div>
      </dl>

      <dl>
        <div>
          <dt className='title'>OnSaleDate:</dt>
          <dd>
            {comic.dates && Array.isArray(comic.dates)? 
              findOnSaleDate(comic.dates)
            : (
              'N/A'
            )
            }
          </dd>
        </div>
      </dl>
      <Link to='/marvel-comics/page/1'>Back to all comics...</Link>
    </Typography>
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
</Card>;
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
</>
  );
}

export default ComicDetailsPage;
