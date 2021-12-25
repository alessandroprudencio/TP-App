import { IPlayer } from './player.interface';

export interface ICategory {
  readonly _id: string;
  name: string;
  description: string;
  events: Array<Event>;
  players: Array<IPlayer>;
}
