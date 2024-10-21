import {account_status_util} from "../utils/account_status_util.js";

export const isActive = (req, res, next) => {

    if (account_status_util(res, req.user.account_status_id)) return next()
}