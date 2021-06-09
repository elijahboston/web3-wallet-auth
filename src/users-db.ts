interface User {
  nonce: string;
}

export const _data: Record<string, User> = {};

const UserStore = {
  add: (id: string, user: User) => (_data[id] = user),
  get: (id: string) => _data[id],
  update: (id: string, user: User) => {
    _data[id] = user;
  },
};

Object.freeze(UserStore);
export default UserStore;
