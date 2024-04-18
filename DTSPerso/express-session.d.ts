/**
* Exportation de UserModel dans le format des session
* Exportation de VisitorModel dans le format des session
**/

export declare module 'express-session' {
  export interface SessionData {
    visitor: VisitorModel;
    user: UserModel;
  }
}