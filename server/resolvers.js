import { getAllComics, getComicById, getTotalPages} from './marvelData.js';
// import redis from 'redis'
// const client = redis.createClient();
// await client.connect().then(() => {});
export const resolvers = {
  Query: {
    comics: (_, args) => getAllComics(args.pageNum),
    comic: (_, args) => getComicById(args.id),
    totalComics: (_, __, context) => getTotalPages(),
  },
};