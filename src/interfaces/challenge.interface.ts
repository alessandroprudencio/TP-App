import { IChallengeStatus } from './challenge-status.enum.interface';
import { IMatch } from './match.interface';
export interface IChallenge {
  readonly _id: string;
  requester: string;
  dateTimeChallenge: string;
  dateTimeResponse: string;
  message: string;
  status: IChallengeStatus;
  category: string;
  players: any;
  match?: IMatch;
}
