export const users = {
  address: {
    publicAddress: "",
    nonce: "",
  },
};

interface User {
  publicKey: string;
  nonce: string;
}

const _data: User[] = [];

const UserStore = {
  add: (item: User) => _data.push(item),
  get: (id: string) => _data.find((d) => d.publicKey === id),
  update: (id: string, item: User) => {
    const found = _data.find((d) => d.publicKey === id);
    if (found) {
      _data[found.publicKey] = item;
    }
  },
};

Object.freeze(UserStore);
export default UserStore;
