import { Request, Response } from "express";
import { StatementService } from "../services/StatementService";
import { error } from "console";

class StatmentController {

    private statementService: StatementService;

    constructor() {
        this.statementService = new StatementService();
    }

    deposit = async (req: Request, res: Response) => {
        try {
            const idCheckingAccount = req.params.id;
            const { amount, description } = req.body;

            const validation = this.isValidAmountAndDescription(amount, description);
            if(!validation.isValid) {
                return res.status(400).json({error: validation.msg});
            }

            const statement = await this.statementService.deposit(idCheckingAccount, amount, description);
            return res.status(201).json(statement);
        } catch (error) {
            this.handleError(res, error, "Error fetching deposit.")
        }
    }

   getStatment = async(req:Request, res:Response) => {
        try {
            const idCheckingAccount = req.params.id;
            const statment = await this.statementService.getAll(idCheckingAccount);
            return res.status(200).json(statment);
        } catch (error) {
            this.handleError(res, error, "Error fetching statement.")    
        }
   }

   getBalance = async(req:Request, res:Response) => {
        try {
            const idCheckingAccount = req.params.id;
            const balance = await this.statementService.getBalance(idCheckingAccount);
            return res.status(200).json({ balance });
        } catch (error) {
            this.handleError(res, error, "Error fetching balance.")           
        }
   }

   withdraw = async(req:Request, res:Response) => {
        try {
            const idCheckingAccount = req.params.id;
            const { amount, description } = req.body;

            const validation = this.isValidAmountAndDescription(amount, description);
            if(!validation.isValid) {
                return res.status(400).json({error: validation.msg});
            }

            const withdraw = await this.statementService.withdraw(idCheckingAccount, amount, description);
            return res.status(201).json(withdraw);
        } catch (error) {
            this.handleError(res, error, "Error fetching withdraw.")
            
        }
   }

   getByPrtiod = async(req:Request, res:Response) => {
        try {
            const idCheckingAccount = req.params.id;
            const { startDate, endDate} = req.query;
            if(!startDate || !endDate) {
                return res.status(400).json({error: "Start date and end date are required."});
            }
            const start = new Date(startDate as string);
            const end = new Date(endDate as string);

            if (isNaN(start.getDate()) || isNaN(end.getDate())) {
                return res.status(400).json({ error: "Invalid date format."});
            }
            const statement = await this.statementService.getByPeriod(idCheckingAccount, start, end);
            return res.status(200).json(statement);
        } catch (error) {
            this.handleError(res, error, "Error fetching statement by period")
        }
   }

   private handleError(res:Response, error:unknown, msg: string) {
        if (error instanceof Error) {
            console.error(`${msg}, ${error.message}`);
            return res.status(400).json({error: error.message});
        } else {
            console.error(`Unexpected error: ${error}`);
            return res.status(500).json({error: "An unexpected error ocurred"});
        }
   }

   pix = async(req:Request, res: Response) => {
        try {
            const idCheckingAccount = req.params.id;
            const { amount, description } = req.body;

            const validation = this.isValidAmountAndDescription(amount, description);
            if (!validation.isValid) {
                return res.status(400).json({error: validation.msg});
            }
            const pix = await this.statementService.pix(idCheckingAccount, amount, description);
            return res.status(201).json(pix);
        } catch (error) {
            this.handleError(res, error, "Error creating pix.");
        }
   }

   ted = async(req:Request, res: Response) => {
        try {
            const idCheckingAccount = req.params.id;
            const { amount, description } = req.body;

            const validation = this.isValidAmountAndDescription(amount, description);
            if(!validation.isValid) {
                return res.status(400).json({error: validation.msg});
            }
            const ted = await this.statementService.ted(idCheckingAccount, amount, description);
            return res.status(201).json(ted);
        } catch (error) {
            this.handleError(res, error, "Error creating ted");
        }
   }

   private isValidAmountAndDescription(amount: any, description: any) {
        if (typeof amount !== "number" || amount <= 0) {
            return {isValid: false, msg: "Invalid amount: must be a positive number."}
        }
        if (typeof description !== "string" || description.trim().length == 0){
            return {isValid: false, msg: "Invalid description must be a non empty string."}
        }
        return {isValid: true}
    }

    private isValidAmountAndDescription2(amount: any, description: any, res: Response) {
        if (typeof amount !== "number" || amount <= 0) {
            return res.status(400).json({error: "Invalid amount: must be a positivie number."});
        }
        if (typeof description !== "string" || description.trim().length == 0){
            return res.status(400).json({error: "Invalid description: must be a non empty string."});
        }
        return {isValid: true}
    }

}

export {StatmentController}