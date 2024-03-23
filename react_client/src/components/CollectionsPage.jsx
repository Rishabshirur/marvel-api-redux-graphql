import React, { useState } from 'react';
import { connect } from 'react-redux';
import {useSelector, useDispatch} from 'react-redux';
import * as actions from '../actions';
import { Link } from 'react-router-dom';

import {
  Button
} from '@mui/material';

const CollectionsPage = () => {
  const dispatch = useDispatch();
  const collections = useSelector((state) => state.collections);
  const [newCollectionName, setNewCollectionName] = useState('');

  const handleAddCollection = () => {
    if (newCollectionName.trim() !== '') {
      dispatch(actions.addSubCollection(newCollectionName));
      setNewCollectionName('');
    }
  };

  return (
    <div>
      <h1>Collections</h1>
      <ul>
        {collections.subCollections.map((subCollection) => (
          <li key={subCollection.id}>
            {subCollection.name}{' '}
            {(collections.selectedSubCollectionId==subCollection.id)?<Button>Selected</Button>:<Button onClick={() => dispatch(actions.selectSubCollection(subCollection.id))}>Select</Button>}{' '}
            <Button onClick={() => dispatch(actions.deleteSubCollection(subCollection.id))}
            disabled={collections.selectedSubCollectionId==subCollection.id}>Delete</Button>
            <ul>
            {subCollection.comics.map((comic)=>(
            <li key={comic.comicId}>
              <Link to={`/marvel-comics/${comic.comicId}`}>{comic.comicName}</Link>
            </li>
          ))}
            </ul>
          </li>
          
        ))}

        
      </ul>
      <div>
        <input
          type="text"
          placeholder="Enter collection name"
          value={newCollectionName}
          onChange={(e) => setNewCollectionName(e.target.value)}
        />
        <button onClick={handleAddCollection}>Add Collection</button>
      </div>
    </div>
  );
};


export default CollectionsPage
