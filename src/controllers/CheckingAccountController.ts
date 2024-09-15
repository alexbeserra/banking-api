import { NextFunction, Request, Response } from "express";
import { prisma } from "../prisma";
import { CheckingAccountService } from "../services/CheckingAccountService";
import { error } from "console";

class CheckingAccountController {

    private checkingAccountService: CheckingAccountService;

    constructor(){
        this.checkingAccountService = new CheckingAccountService();
    }

    create = async(req: Request, res: Response) => {
        try {
            const {name, email, number} = req.body;

            const validation = this.isValidNameAndEmailAndNumber(name, email, number);
            if(!validation.isValid) {
                return res.status(400).json({error: validation.msg});
            }
            const checkingAccount = await this.checkingAccountService.create(name, email, number);
            return res.status(201).json(checkingAccount);
        } catch (error) {
            this.handleError(res, error, "Error creating checkingAccount.");
        }
    }

    update = async(req:Request, res: Response) => {
        try {
            const idCheckingAccount = req.params.id;
            const { name, email, number } = req.body;
            const validation = this.isValidNameAndEmailAndNumber(name, email, number);
            if(!validation.isValid) {
                return res.status(400).json({error: validation.msg});
            }
            const checkingAccount = await this.checkingAccountService.update(idCheckingAccount, name, email, number);
            return res.status(200).json(checkingAccount);
        } catch (error) {
            this.handleError(res, error, "Error updating checkingAccount");
        }
    }

    delete = async(req:Request, res:Response) => {
        try {
            const idCheckingAccount = req.params.id;
            await this.checkingAccountService.delete(idCheckingAccount);
            return res.status(204).json();
        } catch (error) {
            this.handleError(res, error, "Error deleting checkingAccount.");
        }
    }

    getAll = async(req:Request, res:Response) => {
        try {
            const checkingAccounts = await this.checkingAccountService.getAll();
            return res.status(200).json(checkingAccounts);
        } catch (error) {
            this.handleError(res, error, "Error fetching checkingAccount.");
        }
    }

    getById = async(req:Request, res:Response) => {
        try {
            const idCheckingAccount = req.params.id;
            const checkingAccount = await this.checkingAccountService.getById(idCheckingAccount);
            if(!checkingAccount) {
                return res.status(404).json({error: "CheckingAccount not found."});
            }
            return res.status(200).json(checkingAccount);
        } catch (error) {   
            this.handleError(res, error, "Error fetching getById checkingAccount.");
        }
    }

    verifyIfExists = async(req:Request, res:Response, next:NextFunction) => {
        try {
            const id = req.params.id; 

            const checkingAccount = await this.checkingAccountService.getById(id);

            if(!checkingAccount) {
                return res.status(404).json({error: "CheckingAccount not found."});
            }
            return next();
        } catch (error) {
            this.handleError(res, error, "Error verify if exists checkingAccount.");
        }
    }

    getByName = async (req: Request, res: Response) => {
        try {
            const { name } = req. query;
            const checkingAccount = await this.checkingAccountService.getByName(name as string);
            console.log(`Name ${checkingAccount}`);
            return res.status(200).json(checkingAccount);
        } catch (error) {
            this.handleError(res, error, "Error fecthing by name checkingAccount.");
            
        }
    }

    private isValidNameAndEmailAndNumber(name: any, email: any, number:any) {
        if(typeof name !== "string" || name.trim().length == 0) {
            return {isValid: false, msg: "Invalid name: must be a non empty string."}
        }
        if (typeof email !== "string" || email.trim().length == 0) {
            return {isValid: false, msg: "Invalid email: must be a non empty string."}
        }
        if(typeof number !== "string" || number.trim().length == 0) {
            return {isValid: false, msg: "Invalid email: must be a non empty string."}
        }
        return  {isValid: true }
    }

    private handleError(res:Response, error:unknown, msg: string) {
        if (error instanceof Error) {
            console.error(`${msg}. ${error.message}`);
            return res.status(400).json({error: error.message});
        } else {
            console.error(`Unexpected error: ${error}`);
            return res.status(500).json({error: "An unexpected error occurred."});
        }
    }
}

export { CheckingAccountController }