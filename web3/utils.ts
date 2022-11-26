import Web3 from "web3";

export const getBalance = async (account: string): Promise<string> => {
  return new Promise((resolve, reject) => {
    const web3 = new Web3(window?.ethereum)
    web3.eth.getBalance(account, (err: any, result: any) => {
      if (err) {
        reject(err);
      } else {
        resolve(web3.utils.fromWei(result, "ether"));
      }
    });
  });
};