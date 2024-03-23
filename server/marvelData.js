import axios from 'axios';
import md5 from 'blueimp-md5';
import { GraphQLError } from 'graphql';
import redis from 'redis';
const client = redis.createClient();
await client.connect()

const PUBLIC_KEY = "YOUR_PUBLIC_KEY";
const PRIVATE_KEY = "YOUR_PRIVATE_KEY";
const BASE_URL = 'https://gateway.marvel.com/v1/public/comics';

const getTotalPages = async () => {
  try {
    const ts = new Date().getTime();
    const hash = md5(ts + PRIVATE_KEY + PUBLIC_KEY);
    const url = `${BASE_URL}?ts=${ts}&apikey=${PUBLIC_KEY}&hash=${hash}`;
    const response = await axios.get(url);
    console.log(response.data.data.total);
    const total = response.data.data.total;
    return total;
  } catch (error) {
    throw new GraphQLError('Failed to fetch comics from Marvel API', { extensions: { code: 'MARVEL_API_ERROR' } });
  }
};

const getAllComics = async (pageNum) => {
  try {
    console.log("this is allcomics route");
    console.log(pageNum);
    let key = `ComicPage${pageNum}`;
    console.log(key);
    let exists = await client.exists(key);
    console.log(exists);
    if (exists) {
      console.log('Page in Cache');
      let comics = await client.get(key);
      comics = JSON.parse(comics);
      console.log('Sending page from Redis....');
      return comics;
    } else {
      console.log('Page Not in Cache');
      const ts = new Date().getTime();
      const hash = md5(ts + PRIVATE_KEY + PUBLIC_KEY);
      const url = `${BASE_URL}?ts=${ts}&apikey=${PUBLIC_KEY}&hash=${hash}&offset=${(pageNum - 1) * 50}&limit=50`;
      console.log(url);
      const response = await axios.get(url);
      const comics = response.data.data.results;
      comics.total = response.data.data.total;
      console.log(response.data.data.results.length);
      console.log(response.data.data.total);
      
      if (comics.length === 0) {
        throw new GraphQLError('Comics Not Found', { extensions: { code: 'NOT_FOUND' } });
      }
      
      await client.set(key, JSON.stringify(comics));
      return comics;
    }
  } catch (error) {
    throw new GraphQLError('Failed to fetch comics from Marvel API', { extensions: { code: 'MARVEL_API_ERROR' } });
  }
};

const getComicById = async (id) => {
  try {
    let exists = await client.exists(`comic${id}`);
    if (exists) {
      console.log('Comic in Cache');
      let comic = await client.get(`comic${id}`);
      comic = JSON.parse(comic);
      console.log('Sending comic from Redis....');
      return comic;
    } else {
      console.log('Comic Not in Cache');
      const ts = new Date().getTime();
      const hash = md5(ts + PRIVATE_KEY + PUBLIC_KEY);
      const url = `${BASE_URL}/${id}?ts=${ts}&apikey=${PUBLIC_KEY}&hash=${hash}`;

      const response = await axios.get(url);
      const comic = response.data.data.results[0];

      if (!comic) {
        throw new GraphQLError(`Comic with ID ${id} not found`, { extensions: { code: 'COMIC_NOT_FOUND' } });
      }
      
      await client.set(`comic${id}`, JSON.stringify(comic));
      return comic;
    }
  } catch (error) {
    console.error('Error fetching comic by ID:', error);
    throw new GraphQLError('Failed to fetch comic by ID from Marvel API', { extensions: { code: 'MARVEL_API_ERROR' } });
  }
};

export { getAllComics, getComicById, getTotalPages };
