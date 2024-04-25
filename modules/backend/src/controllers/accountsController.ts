import {Request, Response} from "express";

export class AccountsController {

    private accounts = [
        { type: 'Girokonto', iban: 'DE57 3704 0044 5601 017749', balance: 320 },
        { type: 'Sparbuch', iban: 'DE81 3704 0044 8713 4801 70', balance: 1520 },
        { type: 'Tagesgeld', iban: 'DE42 3704 0044 4735 6439 59', balance: 1120 },
        { type: 'Festgeld', iban: 'DE14 3704 0044 8062 1720 80', balance: 530 },
        { type: 'Gemeinschaftskonto', iban: 'DE90 3704 0044 4689 9360 73', balance: 4230 }
    ];

    getAccounts = async (req: Request, res: Response) => {
        res.json(this.accounts);
    }

}