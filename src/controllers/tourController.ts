import { NextFunction, Request, Response } from 'express';
import { Tour, tourSchema } from '../models/tourModel';
import { z } from 'zod';
import { pool } from '../db/postgres-pool';

export const validateTourBody = async (req: Request<{}, {}, Tour>, res: Response, next: NextFunction) => {
  try {
    req.body = tourSchema.parse(req.body);
    const tours = await pool.query('SELECT * FROM tours');

    // check if tour already exists in DB
    const tour: Tour = tours.rows.find((tour: Tour) => tour.name === req.body.name);

    if (tour) {
      res.status(409).json({
        status: 'fail',
        message: `Tour with ${tour.name} already exits`,
      });
      return;
    }
    next();
  } catch (err) {
    if (err instanceof z.ZodError) {
      const errorMessages = err.errors.map((e) => e.message);

      res.status(400).json({
        status: 'fail',
        message: errorMessages.join(', '),
      });
    }
    next(err);
  }
};

// Create tour
export const createTour = async (req: Request<{}, {}, Tour>, res: Response) => {
  const {
    name,
    price,
    description,
    summary,
    difficulty,
    duration,
    imageCover,
    images,
    maxGroupSize,
    startDates,
    priceDiscount,
    ratingsAverage,
    ratingsQuantity,
  } = req.body;
  try {
    const query = `
      INSERT INTO tours (name, price, description, summary, difficulty, duration, imageCover, images, maxGroupSize, startDates, priceDiscount, ratingsAverage, ratingsQuantity)
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9 ,$10, $11, $12, $13)
      RETURNING *
    `;

    const values = [
      name,
      price,
      description,
      summary,
      difficulty,
      duration,
      imageCover,
      images,
      maxGroupSize,
      startDates,
      priceDiscount,
      ratingsAverage,
      ratingsQuantity,
    ];

    const result = await pool.query(query, values);

    res.status(201).json({
      status: 'success',
      message: 'Tour created successfully',
      data: {
        tour: result.rows[0],
      },
    });
  } catch (err) {
    res.status(400).json({
      status: 'fail',
      message: 'An error occurred while creating tours. Please try again later.',
    });
  }
};

// Get all tours
export const getAllTours = async (req: Request, res: Response) => {
  try {
    const tours = await pool.query('SELECT * FROM tours');

    if (tours.rows.length) {
      res.status(200).json({
        status: 'success',
        message: 'Tours fetched successfully',
        result: tours.rows.length,
        data: {
          tours: tours.rows,
        },
      });
    } else {
      res.status(404).json({
        status: 'fail',
        message: 'No tours exists.Try adding some.',
      });
    }
  } catch (e) {
    res.status(500).json({
      status: 'fail',
      message: 'An error occurred while fetching tours. Please try again later.',
    });
  }
};

// Get tour by id
export const getTourById = async (req: Request<{ tourId: string }>, res: Response) => {
  const { tourId } = req.params;
  try {
    const tour = await pool.query('SELECT * FROM tours WHERE id = $1', [tourId]);

    if (!tour.rows.length) {
      res.status(404).json({
        status: 'fail',
        message: `Tour with id ${tourId} does not exists.`,
      });
      return;
    }

    res.status(200).json({
      status: 'success',
      message: 'Tour fetched successfully',
      data: {
        tour: tour.rows[0],
      },
    });
  } catch (err) {
    res.status(500).json({
      status: 'fail',
      message: 'An error occurred while fetching tours. Please try again later.',
    });
  }
};

// update tour
export const updateTour = async (req: Request<{ tourId: string }, {}, Tour>, res: Response) => {
  const { tourId } = req.params;
  const { name, price } = req.body;
  const query =
    'UPDATE tours SET name = $1,price = $2,rating = $3,updated_at = CURRENT_TIMESTAMP WHERE id = $4 RETURNING *';
  try {
    const tour = await pool.query('SELECT * FROM tours WHERE id = $1', [tourId]);

    console.log(tour.rows);

    if (!tour.rows.length) {
      res.status(404).json({
        status: 'fail',
        message: `Tour with id ${tourId} does not exists.`,
      });
      return;
    }
    if (tour.rows[0].name === name) {
      res.status(404).json({
        status: 'fail',
        message: `Name ${name} already exists in database`,
      });
      return;
    }

    const result = await pool.query(query, [name, price, tourId]);

    res.status(200).json({
      status: 'success',
      message: 'Tour has been updated successfully',
      data: {
        tour: result.rows[0],
      },
    });
  } catch (err) {
    res.status(500).json({
      status: 'fail',
      message: 'An error occurred while updating tour. Please try again later.',
    });
  }
};

// delete tour
export const deleteTour = async (req: Request<{ tourId: string }>, res: Response): Promise<void> => {
  const { tourId } = req.params;

  try {
    const result = await pool.query('DELETE FROM tours WHERE id = $1 RETURNING *', [tourId]);

    if (!result.rowCount) {
      res.status(404).json({
        status: 'fail',
        message: `Tour with id ${tourId} does not exists.`,
      });
      return;
    }
    res.status(200).json({
      status: 'success',
      message: 'Tour has been deleted successfully.',
      data: result.rows[0],
    });
  } catch (err) {
    res.status(500).json({
      status: 'fail',
      message: 'An error occurred while deleting the tour. Please try again later.',
    });
  }
};
