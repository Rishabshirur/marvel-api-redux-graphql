import {combineReducers} from '@reduxjs/toolkit';
// import subCollectionsReducer from '../reducers/subCollectionsReducer';
// import selectedSubCollectionReducer from '../reducers/selectedSubCollectionReducer';
import collectionsReducer from '../reducers/collections';
const rootReducer = combineReducers({
    collections: collectionsReducer,
  });
  

export default rootReducer;