import { IPlayer } from './player.interface';

export interface ICategory {
  readonly _id: string;
  name: string;
  description: string;
  players?: Array<IPlayer>;
}
