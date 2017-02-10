import dotenv from 'dotenv';

dotenv.config({ silent: true });
export const {
  APP_SECRET,
  MONGO_URL,
} = process.env;
console.log('key', GROW_APP_SECRET);


