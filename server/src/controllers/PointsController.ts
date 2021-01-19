import { Request, Response } from 'express';
import knex from '../database/connection';

class PointsController {

  async create(request: Request, response: Response) {

    const {
      name, email, whatsapp, latitude, longitude, city, state, items
    } = request.body;

    const trx = await knex.transaction();

    const point = {
      image: 'image-fake', name, email, whatsapp, latitude, longitude, city, state
    };

    const insertedIDs = await trx('points').insert(point);

    const point_id = insertedIDs[0];

    const pointItems = items.map((item_id: number) => {
      return { item_id, point_id };
    });

    await trx('points_items').insert(pointItems);

    await trx.commit();

    return response.json({
      id: point_id,
      ...point
    });

  }

}

export default PointsController;
