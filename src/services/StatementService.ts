import { prisma } from "../prisma";

class StatementService {

    async deposit(idCheckingAccount: string, amount: number, description: string) {
        try {
            if (amount <= 0) {
                throw new Error("Invalid amount.");
            }

            const statement = await prisma.statement.create({
                data:{
                    idCheckingAccount,
                    amount,
                    description,
                    type: "credit"
                }
            });
            return statement;
        } catch (error) {
            console.error(`Error creating deposit: ${error}`);
            throw error;
        }

    }

    async getBalance(idCheckingAccount: string) {
        try {
            const aggregate = await prisma.statement.aggregate({
                _sum: {
                    amount: true
                },
                where: { idCheckingAccount }
            });
            return aggregate._sum.amount ?? 0;
        } catch (error) {
            console.error(`Error fetching balance. ${error}`);
            throw error;
        }
    }

    async withdraw(idCheckingAccount:string, amount:number, description:string) {
        try {
            const withdraw = this.createDebit(idCheckingAccount, amount, `Withdraw - ${description}`);
            return withdraw;
        } catch (error) {
            console.error(`Error creating withdraw. ${error}`);
            throw error;

            
        }
    }

    async getAll(idCheckingAccount: string) {
        try {
            const statement = await prisma.statement.findMany({
                where: {
                    idCheckingAccount
                },
                orderBy: {
                    createAt: "desc"
                }
            });
            return statement
        } catch (error) {
            console.error(`Error fetching statement. ${error}`);
            throw error;
        }
    }

    async getById(id:string) {
        try {
            const statement = await prisma.statement.findUnique({
                where: {
                    id
                }
            });
            return statement;
        } catch (error) {
            console.error(`Error fteching statement. ${error}`);
            throw error;
        }
    }

    async getByPeriod(idCheckingAccount:string, startDate: Date, endDate: Date) {
        try {
            const statement = await prisma.statement.findMany({
                where: {
                    idCheckingAccount,
                    createAt: {
                        gte: startDate,
                        lte: endDate
                    }
                },
                orderBy: {
                    createAt: "desc"
                }
            });
            return statement;
        } catch (error) {
            console.error(`Error fetching statment. ${error}`);
            throw error;
        }
    }

    async pix(idCheckingAccount:string, amount:number, description:string) {
        try {
            const pix = await this.createDebit(idCheckingAccount, amount, `PIX - ${description}`);
            return pix;
        } catch (error) {
            console.error(`Error creating pix. ${error}`);
            throw error;
        }
    }

    async ted(idCheckingAccount:string, amount:number, description:string) {
        try {
            const ted = await this.createDebit(idCheckingAccount, amount, `TED - ${description}`);
            return ted;
        } catch (error) {
            console.error(`Error creating ted. ${error}`);
            throw error;
        }
    }

    private async createDebit(idCheckingAccount:string ,amount:number, description:string) {
        try {
            if(amount <= 0) {
                throw new Error("Invalid amount.");
            }
    
            const balance = await this.getBalance(idCheckingAccount);
    
            if(amount > balance) {
                throw new Error("Insufficient funds.");
            }
    
            const statement = await prisma.statement.create({
                data: {
                    idCheckingAccount,
                    amount: amount * -1,
                    description,
                    type: "debit"
                }
            });
            return statement;
        } catch (error) {
            console.error(`Error creating withdraw. ${error}`);
            throw error;
        }
    }
 
}

export{ StatementService }