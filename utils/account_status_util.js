export const account_status_util = (res, account_status_id) => {
    switch (account_status_id) {
        case 1:
             return true
        case 2:
            return res.status(403).json({error: "Inactive"});
        case 3:
            return res.status(403).json({error: "Suspended"});
        case 4:
            return res.status(403).json({error: "Banned"});
        default:
            return res.status(403).json({error: "Undefined status"});
    }
}