import express from 'express';
import { createTour, deleteTour, getAllTours, getTourById, updateTour, validateTourBody, } from '../controllers/tourController';
const tourRouter = express.Router();
// tourRouter.param('tourId', validateTourId);
tourRouter.route('/').get(getAllTours).post(validateTourBody, createTour);
tourRouter.route('/:tourId').get(getTourById).patch(updateTour).delete(deleteTour);
export default tourRouter;
