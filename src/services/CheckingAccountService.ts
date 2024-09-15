import { prisma } from "../prisma"

class CheckingAccountService {

    async create ( name:string, email: string, number: string) {
        try {
            const checkingAccount = await prisma.checkingAccount.create({
                data: {
                    name,
                    email,
                    number
                }

            });
            return checkingAccount;
        } catch (error) {
            console.error(`Error creating checkingAccount. ${error}`);
            throw error;
            
        }
    }

    async update (id: string, name: string, email: string, number: string) {
        try {
            const checkingAccount = await prisma.checkingAccount.update({
                where: {id},
                data: {
                    name,
                    email,
                    number
                }
            });
            return checkingAccount;
        } catch (error) {
            console.error(`Error updating checkingAccount. ${error}`);
            throw error;
        }
    }

    async delete(id:string) {
        try {
            await prisma.checkingAccount.delete({
                where: {
                    id
                }
            });
        } catch (error) {
            console.error(`Error deleting checkingAccount. ${error}`);
            throw error;
        }

    }

    async getAll() {
        try {
            const checkingAccounts = await prisma.checkingAccount.findMany({
                orderBy: {
                    name: "asc"
                }
            });
            return checkingAccounts
        } catch (error) {
            console.error(`Error fetching checkingAccount. ${error}`);
            throw error;
        }
    }

    async getById(id:string) {
        try {
            const checkingAccount = await prisma.checkingAccount.findUnique({
                where: {id}
            });
            if(!checkingAccount) {
                throw new Error("CheckingAccount not found.");
            }
            return checkingAccount;
        } catch (error) {
            console.error(`Error fetching checkingAccount. ${error}`);
            throw error;
        }
    }

    async getByName(name: string) {
        try {
            const checkingAccount = await prisma.checkingAccount.findMany({
                where: {
                    name: {
                        contains: name,
                        mode: "insensitive"
                    }
                },
                orderBy: {
                    name: "asc"
                }
            });
            return checkingAccount;
        } catch (error) {
            console.error(`Error fetching checkingAccount. ${error}`);
            throw error;
        }
    }
}

export { CheckingAccountService }