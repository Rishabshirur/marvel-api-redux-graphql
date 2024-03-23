
import { v4 as uuid } from 'uuid';

const initialState = {
  subCollections: [],
  selectedSubCollectionId: null,
};

const collectionsReducer = (state = initialState, action) => {
  switch (action.type) {
    case 'ADD_SUB_COLLECTION':
      const newSubCollection = {
        id: uuid(),
        name: action.payload.name,
        comics: [],
      };

      return {
        ...state,
        subCollections: [...state.subCollections, newSubCollection],
      };

    case 'DELETE_SUB_COLLECTION':
      return {
        ...state,
        subCollections: state.subCollections.filter((subCollection) => subCollection.id !== action.payload.id),
      };

    case 'SELECT_SUB_COLLECTION':
      return {
        ...state,
        selectedSubCollectionId: action.payload.id,
      };

    case 'ADD_COMIC_TO_COLLECTION':
      const { subCollectionId, comic } = action.payload;
      const updatedCollectionsAdd = state.subCollections.map((subCollection) =>
        subCollection.id === subCollectionId
          ? { ...subCollection, comics: [...subCollection.comics, comic] }
          : subCollection
      );

      return {
        ...state,
        subCollections: updatedCollectionsAdd,
      };

    case 'DELETE_COMIC_FROM_COLLECTION':
      const { subCollectionId: deleteSubCollectionId, comicId } = action.payload;
      const updatedCollectionsDelete = state.subCollections.map((subCollection) =>
        subCollection.id === deleteSubCollectionId
          ? { ...subCollection, comics: subCollection.comics.filter((comic) => comic.comicId !== comicId) }
          : subCollection
      );
    
      return {
        ...state,
        subCollections: updatedCollectionsDelete,
    };

    default:
      return state;
  }
};

export default collectionsReducer;
