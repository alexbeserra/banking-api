import { Router } from "express";
import { CheckingAccountController } from "./controllers/CheckingAccountController";
import { StatmentController } from "./controllers/StatementController";
import { AuthController } from "./controllers/AuthController";


const routes = Router();

const checkingAccountController = new CheckingAccountController();

const statementController = new StatmentController();
const authController = new AuthController;
const path = "/checkingaccounts";

routes.get(path, authController.authMiddleware, checkingAccountController.getAll);

routes.get(`${path}/searchByName`), authController.authMiddleware, checkingAccountController.getByName;

routes.get(`${path}/:id`, authController.authMiddleware, checkingAccountController.getById);

routes.post(path, authController.authMiddleware, checkingAccountController.create);

routes.put(`${path}/:id`, authController.authMiddleware, checkingAccountController.verifyIfExists, checkingAccountController.update);

routes.delete(`${path}/:id`, authController.authMiddleware, checkingAccountController.verifyIfExists, checkingAccountController.delete);

routes.post(`${path}/id/deposit`, authController.authMiddleware, checkingAccountController.verifyIfExists, statementController.deposit);

routes.get(`${path}/:id/statement`, authController.authMiddleware, checkingAccountController.verifyIfExists, statementController.getStatment);

routes.get(`${path}/:id/balance`, authController.authMiddleware, checkingAccountController.verifyIfExists, statementController.getBalance);

routes.post(`${path}/:id/withdraw`, authController.authMiddleware, checkingAccountController.verifyIfExists, statementController.withdraw);

routes.get(`${path}/:id/statement/period`, authController.authMiddleware, checkingAccountController.verifyIfExists, statementController.getByPrtiod)

routes.post(`${path}/:id/pix`, authController.authMiddleware, checkingAccountController.verifyIfExists, statementController.pix);

routes.post(`${path}/:id/ted`, authController.authMiddleware, checkingAccountController.verifyIfExists, statementController.ted);





export { routes }