import express from 'express';
import { createNewUser, deleteUser, getAllUsers, getUserById, updateUser } from '../controllers/userController';
export const userRouter = express.Router();
userRouter.route('/').get(getAllUsers).post(createNewUser);
userRouter.route('/:userId').get(getUserById).patch(updateUser).delete(deleteUser);
