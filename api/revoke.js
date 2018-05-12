import fs from 'fs'

const dataRootFile = '../lib/shared/';
const companyUsers = 'companyUsers.json';
const offersList = 'offersList.json';

function revokeOffer(number, partnerName, date){

  return new Promise(resolve => {
    const data = JSON.parse(fs.readFileSync(`${dataRootFile}${companyUsers}`, 'utf8'));
    let fileUpdated = false;

    if (data && data[number]) {
      if (data[number].partnerName === partnerName) {
        fileUpdated = true;

        if (data[number].expireDate > date){
          data[number].expireDate = date
        } else {
          delete data[number];
        }
      }
    }

    if(fileUpdated){
      fs.writeFileSync(`${dataRootFile}${companyUsers}`, JSON.stringify({ ...data }))
    }
    
    resolve(true);
  });

}

export default async function (req, res) {
  const { clientsList, companyName } = req.body;

  clientsList.forEach(async (client) => {
    await revokeOffer(client.number, companyName, client.date)
  });
  res.status(200).send();

}
