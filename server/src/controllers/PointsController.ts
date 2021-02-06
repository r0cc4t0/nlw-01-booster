import { Request, Response } from 'express';
import knex from '../database/connection';

class PointsController {

  async index(request: Request, response: Response) {

    const { city, state, items } = request.query;

    const parsedItems = String(items)
      .split(',').map(item => Number(item.trim()));

    const points = await knex('points')
      .join('points_items', 'points.id', '=', 'points_items.point_id')
      .whereIn('points_items.item_id', parsedItems)
      .where('city', String(city))
      .where('state', String(state))
      .distinct()
      .select('points.*');

    const host = '192.168.1.7';

    const serializedPoints = points.map(point => {
      return {
        ...point,
        image: `http://${host}:3333/uploads/${point.image}`
      };
    });

    return response.json(serializedPoints);

  }

  async show(request: Request, response: Response) {

    const { id } = request.params;

    const point = await knex('points').where('id', id).first();

    if (!point) {
      return response.status(400).json({ message: 'Point not found.' });
    }

    const host = '192.168.1.7';

    const serializedPoint = {
      ...point,
      image: `http://${host}:3333/uploads/${point.image}`
    };

    const items = await knex('items')
      .join('points_items', 'items.id', '=', 'points_items.item_id')
      .where('points_items.point_id', id)
      .select('items.id', 'items.title');

    return response.json({ point: serializedPoint, items });

  }

  async create(request: Request, response: Response) {

    const {
      name, email, whatsapp, latitude, longitude, city, state, items
    } = request.body;

    const trx = await knex.transaction();

    const point = {
      image: request.file.filename,
      name, email, whatsapp, latitude, longitude, city, state
    };

    const insertedIDs = await trx('points').insert(point);

    const point_id = insertedIDs[0];

    const pointItems = items
      .split(',')
      .map((item: string) => Number(item.trim()))
      .map((item_id: number) => {
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
