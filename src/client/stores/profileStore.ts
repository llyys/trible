import { observable, action } from "mobx";

class ProfileStore {
  @observable user: any;

  @action
  currentUser(user) {
    this.user = user;
  }
}

export default new ProfileStore();
