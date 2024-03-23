import {Request, Response} from "express";

export class InformationController {
    public async getInformation(req: Request, res: Response) {
        res.status(200).send({message: "Very secret information!"});
    }

}