import { IPlayer } from './player.interface';

export interface IAuth {
  user: IPlayer;
  jwtToken: string;
}
