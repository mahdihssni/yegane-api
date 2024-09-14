import { Schema } from 'mongoose';

export const UserSchema = new Schema({
  name: String,
  username: String,
  email: String,
  password: String,
});
