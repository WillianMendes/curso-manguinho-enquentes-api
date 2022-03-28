import AccountModel from '../model/account.model';

interface AddAccountModel {
  name: string;
  email: string;
  password: string;
}

interface AddAccount {
  add(account: AddAccountModel): Promise<AccountModel>;
}

export { AddAccount, AddAccountModel };
