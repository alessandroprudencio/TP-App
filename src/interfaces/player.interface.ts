import { ICategory } from './category.interface';

export interface IPlayer {
  readonly _id: string;
  phoneNumber: string;
  readonly email: string;
  name: string;
  ranking: string;
  positionRanking: number;
  score: number;
  avatar: string;
  category: ICategory;
}
