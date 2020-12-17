import { Injectable } from '@angular/core';
import { Password, SimpleWallet, Account, Address, NetworkType, PublicAccount, Crypto, WalletAlgorithm,MosaicNonce,NamespaceInfo,MosaicInfo,MosaicId, Transaction, TransactionHttp,ChainHttp,AccountHttp, MosaicHttp, NamespaceHttp, BlockHttp, MosaicService, TransactionStatusError, NamespaceService, QueryParams} from 'tsjs-xpx-chain-sdk';
import { BlockchainNetworkType } from 'tsjs-chain-xipfs-sdk';
import { Observable } from 'rxjs/internal/Observable';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';



@Injectable({
  providedIn: 'root'
})

export class ProximaxProvider {

  blockchainHttp: ChainHttp; // Update-sdk-dragon
  url: any;
  infoMosaic: MosaicInfo;
  transactionHttp: TransactionHttp;
  websocketIsOpen = false;
  accountHttp: AccountHttp;
  mosaicHttp: MosaicHttp;
  namespaceHttp: NamespaceHttp;
  blockHttp: BlockHttp;
  mosaicService: MosaicService;
  namespaceService: NamespaceService;
  transactionStatusError: TransactionStatusError;


  constructor(public http: HttpClient,) {
  
  }

  createAccountSimple(walletName: string, password: Password, network: number): SimpleWallet {
    return SimpleWallet.create(walletName, password, network);
  }

  createPassword(value: string): Password {
    return new Password(value);
  }

  createAccountFromPrivateKey(nameWallet: string, password: Password, privateKey: string, network: number): SimpleWallet {
    return SimpleWallet.createFromPrivateKey(nameWallet, password, privateKey, network);
  
  }

  decryptPrivateKey(password: Password, encryptedKey: string, iv: string): string {
      const common: commonInterface = {
        password: password.value,
        privateKey: ''
      };

      const wallet: { encrypted: string; iv: string; } = {
        encrypted: encryptedKey,
        iv,
      };

    Crypto.passwordToPrivateKey(common, wallet, WalletAlgorithm.Pass_bip32);
    return common.privateKey;
  
  
  }

  createPublicAccount(publicKey: string, network: NetworkType = environment.typeNetwork.value): PublicAccount {
    return PublicAccount.createFromPublicKey(publicKey, network);  
  }

  createAddressFromPublicKey(publicKey: string, networkType: NetworkType): Address {
    return Address.createFromPublicKey(publicKey, networkType);
  
  }

  createFromRawAddress(address: string): Address {
    return Address.createFromRawAddress(address);
  }

  createNonceRandom() {
    const nonce = MosaicNonce.createRandom();
    return nonce;
  }

  getNamespaceFromAccount(address: Address): Observable<NamespaceInfo[]> {
    return this.namespaceHttp.getNamespacesFromAccount(address);
  } 

  getPublicAccountFromPrivateKey(privateKey: string, net: NetworkType): PublicAccount {
    return Account.createFromPrivateKey(privateKey, net).publicAccount;
  }
  
  getMosaics(mosaicIsd: MosaicId[]): Observable<MosaicInfo[]> {
    return this.mosaicHttp.getMosaics(mosaicIsd);
  }

  getTransactionsFromAccount(publicAccount: PublicAccount, queryParams?): Observable<Transaction[]> {
    return this.accountHttp.transactions(publicAccount, new QueryParams(100));
  }

 getTransactionInformation(hash: string, node = ''): any { // Observable<Transaction> {
    const transaction: TransactionHttp = (node === '') ? this.transactionHttp : new TransactionHttp(environment.protocol + '://' + `${node}`);
    return transaction.getTransaction(hash);
  }


initInstances(url: string) {
    this.url = `${environment.protocol}://${url}`;
    this.blockHttp = new BlockHttp(this.url);
    this.blockchainHttp = new ChainHttp(this.url); // Update-sdk-dragon
    this.accountHttp = new AccountHttp(this.url);
    this.mosaicHttp = new MosaicHttp(this.url);
    this.namespaceHttp = new NamespaceHttp(this.url);
    this.mosaicService = new MosaicService(this.accountHttp, this.mosaicHttp);
    this.namespaceService = new NamespaceService(this.namespaceHttp);
    this.transactionHttp = new TransactionHttp(this.url);
  }

}

export interface commonInterface {
  password: string;
  privateKey: string;
}
