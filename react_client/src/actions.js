const addSubCollection = (name) => ({
    type: 'ADD_SUB_COLLECTION',
    payload: {name},
  });
  
const deleteSubCollection = (id) => ({
    type: 'DELETE_SUB_COLLECTION',
    payload: {id},
  });
const selectSubCollection = (id) => ({
    type: 'SELECT_SUB_COLLECTION',
    payload: {id},
  });

//////////////////////////

const addCollection = (id,subCollectionId,name) =>({
    type:'ADD_COMIC_TO_COLLECTION',
    payload:{
        subCollectionId: subCollectionId,
        comic: {
            comicId: id,
            comicName: name,
            }}
});

const deleteCollection =(comicId,subCollectionId)=>({
    type:'DELETE_COMIC_FROM_COLLECTION',
    payload:{comicId,subCollectionId}
});


export {addSubCollection, deleteSubCollection, selectSubCollection, addCollection, deleteCollection}  