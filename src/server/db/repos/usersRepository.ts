import { IDatabase, IMain, IBaseProtocol } from "pg-promise";
import { IUserProfile } from "~/server/config/passport/passport";

export interface IUser{
  users_id: number,
  displayName: string,
  media_url: string
}

export class UsersRepository {
  constructor(db: any, pgp: IMain) {
    this.db = db;
  }
  private db: IDatabase<any>;
  private pgp: IMain;

  findById(id: number) {
    return this.db.oneOrNone("SELECT * FROM users WHERE id = $1", +id);
  }
  async getOrCreateUserProfile(profile: IUserProfile):Promise<IUser> {
    let result = await this.db.task('getOrCreateUserProfile', async (task) => {
      let user:IUser = await this.getUserFromProfile(profile, task);
      if (user) return user;
      let {users_id} = await task.one(`insert into users (displayName)  values ($(displayName)) returning users_id`, { displayName: profile.displayName })
      let profileId = await this.addProfileToUser(users_id, profile, task);
      return {users_id, displayName:profile.displayName, media_url:''}
    });
    return result;
  }

  getUserFromProfile(profile: IUserProfile, task?: IBaseProtocol<any>): Promise<IUser> {
    let t = task || this.db;
    return t.oneOrNone(
      `SELECT users.users_id, displayName, avatar FROM users, users_profile
       WHERE provider = $(provider) AND providerId = $(providerId) AND users.users_id=users_profile.users_id`,
      profile
    )
  }

  addProfileToUser(userId:number, profile: IUserProfile, task?: IBaseProtocol<any>) {
    let t = task || this.db;

    return t.one(`insert into users_profile (users_id, provider, providerId, providerData) values ($(userId), $(provider), $(providerId), $(providerData)) returning users_profile_id`,
    { userId:userId, provider: profile.provider, providerId:profile.providerId, providerData:profile.providerData })
  }
}
