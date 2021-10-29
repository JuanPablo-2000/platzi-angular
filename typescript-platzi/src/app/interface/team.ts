import { Country, Player } from "./player";

export interface Team {
  $key?: string | null | undefined;
  name: string;
  country: Country;
  player: Player[]
}
