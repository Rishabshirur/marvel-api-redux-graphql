import { gql } from '@apollo/client';

export const FETCH_COMICS = gql`
  query FetchComics($pageNum: Int!) {
    comics(pageNum: $pageNum) {
      id
      title
      description
      prices {
        type
        price
      }
      images {
        extension
        path
      }
      dates {
        date
        type
      }                     
    }
    totalComics
  }
`;

export const FETCH_COMIC_BY_ID = gql`
  query FetchComicById($id: Int!) {
    comic(id: $id) {
      id
      title
      description
      prices {
        type
        price
      }
      images {
        extension
        path
      }
      dates {
        date
        type
      }

    }
  }
`;