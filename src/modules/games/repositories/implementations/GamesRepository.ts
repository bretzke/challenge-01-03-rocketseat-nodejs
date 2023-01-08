import { getRepository, Repository } from "typeorm";

import { User } from "../../../users/entities/User";
import { Game } from "../../entities/Game";

import { IGamesRepository } from "../IGamesRepository";

export class GamesRepository implements IGamesRepository {
  private repository: Repository<Game>;

  constructor() {
    this.repository = getRepository(Game);
  }

  async findByTitleContaining(title: string): Promise<Game[]> {
    const game = await this.repository
      .createQueryBuilder()
      .select("games")
      .from(Game, "games")
      .where(`LOWER(games.title) LIKE LOWER('%${title}%')`)
      .getMany();

    return game;
  }

  async countAllGames(): Promise<[{ count: string }]> {
    return this.repository.query("SELECT COUNT(*) FROM games"); // Complete usando raw query
  }

  async findUsersByGameId(id: string): Promise<User[]> {
    return this.repository.query(`
    select * from users u  
    left join users_games_games ugg 
    on (ugg."usersId" = u.id)
    left join games g  
    on (g.id = ugg."gamesId")
    where  g.id = '${id}'
    `); // não consegui usando query builder, apenas com .query
  }
}
