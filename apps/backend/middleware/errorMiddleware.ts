import { Request,Response,NextFunction } from "express";


export function errorMiddleware(err:Error, req:Request, res:Response, next:NextFunction):Response {
    const statusCode = res.statusCode ? res.statusCode : 500;

    return res.status(statusCode).json({
        message: err.message || "Internal Server Error",
        stack: process.env.NODE_ENV === "prod" ? null : err.stack,
    });
};
