import accountList from '../../data/accounts'
import fs from 'fs'

export async function copyAccountList(fileLocation){ 
  const result = accountList.users.map(contact => contact.number);

  fs.writeFile('../lib/shared/accountsNumber.json', `{"accountsNumber" :[${result}]}`, function (err) {
    if (err) throw err;
    console.log('Saved!');
  });
}