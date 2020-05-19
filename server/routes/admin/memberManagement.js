/*
    GET / - shows all needed data for manage users page
    GET /edit/:memberId - shows needed data for member
    PUT /edit/:memberId - edit member permissions
    POST /ban/:memberId - ban member
    POST /unban/:memberId - unban member
    POST /accept/:memberId - accept member access
    POST /decline/:memberId - decline member access
*/

const router = require("express").Router();
const auth = require("../../auth/tokenAuth");
const { processQuery } = require("../../utils/db");

/*
    @Route /admin/members
    @Auth Protected
*/
router.get("/", auth, async (req, res) => {
    if (req.user.rank === "moderator" || req.user.rank === "admin" || req.user.rank === "owner") {
        const users = await processQuery("SELECT id, username, rank, leo, ems_fd, dispatch, tow, banned, ban_reason FROM `users`");
        const pendingUsers = await processQuery("SELECT username, whitelist_status FROM `users` WHERE `users`.`whitelist_status` = ?", ["pending"]);

        return res.json({ users: users, pendingUsers: pendingUsers });
    } else {
        res.sendStatus(403);
    };

});


/*
    @Route /admin/members/edit/:memberId
    @Auth Protected
*/
router.get("/edit/:memberId", auth, async (req, res) => {
    if (req.user.rank === "moderator" || req.user.rank === "admin" || req.user.rank === "owner") {
        const user = await processQuery("SELECT username, rank, leo, ems_fd, dispatch, tow, banned, ban_reason FROM `users` WHERE `id` = ?", [req.params.memberId]);

        // Check if user exists
        if (!user[0]) return res.json({ msg: "User not found!" });


        // "Current" is to check if the username are not the same so users can't ban them selfs
        return res.json({ user: user, current: req.user.username });
    } else {
        res.sendStatus(403);
    };
});

/*
    @Route /admin/members/edit/:memberId
    @Auth Protected
*/
router.put("/edit/:memberId", auth, async (req, res) => {
    if (req.user.rank === "moderator" || req.user.rank === "admin" || req.user.rank === "owner") {
        const { rank, leo, ems_fd, dispatch, tow } = req.body;
        let query;
        let data = []

        if (rank === undefined) {
            query = "UPDATE `users` SET `leo` = ?, `ems_fd` = ?, `dispatch` = ?, `tow` = ? WHERE `users`.`id` = ?";
            data = [leo, ems_fd, dispatch, tow, req.params.memberId];
        } else {
            query = "UPDATE `users` SET `leo` = ?, `ems_fd` = ?, `dispatch` = ?, `tow` = ?, `rank` = ? WHERE `users`.`id` = ?";
            data = [leo, ems_fd, dispatch, tow, rank, req.params.memberId];
        }

        processQuery(query, data)
            .then(() => {
                return res.json({ msg: "Updated Member" })
            })
            .catch(err => console.log(err));

    } else {
        res.sendStatus(403);
    };
})

/*
    @Route /admin/members/ban/:memberId
    @Auth Protected
*/
router.post("/ban/:memberId", auth, async (req, res) => {
    if (req.user.rank === "admin" || req.user.rank === "owner") {
        let { banReason } = req.body;

        if (banReason === "") {
            banReason = "Not Specified";
        }

        const user = await processQuery("SELECT username, rank FROM `users` WHERE `users`.`id` = ?", [req.params.memberId]);

        if (!user[0]) return res.json({ msg: "User not found!" });

        // Can't ban the CAD owner
        if (user[0].rank === "owner") {
            return res.json({ msg: "You can't ban the owner!" })
        }

        // Can't ban your self
        if (user[0].username === req.user.username) {
            return res.json({ msg: "You can't ban your self!" });
        };

        processQuery("UPDATE `users` SET `banned` = ?, `ban_reason` = ? WHERE `users`.`id` = ?", ['true', banReason, req.params.memberId])
            .then(() => {
                return res.json({ msg: "User Banned", reason: banReason });
            })
            .catch(err => console.log(err));

    } else {
        res.sendStatus(403);
    };
});

/*
    @Route /admin/members/unban/:memberId
    @Auth Protected
*/
router.post("/unban/:memberId", auth, async (req, res) => {
    if (req.user.rank === "admin" || req.user.rank === "owner") {
        const memberId = req.params.memberId;
        processQuery("UPDATE `users` SET `banned` = 'false', `ban_reason` = '' WHERE `users`.`id` = ?", [memberId])
            .then(() => {
                return res.json({ msg: "User Unbanned" });
            })
            .catch(err => console.log(err));
    } else {
        res.sendStatus(404)
    }


})

/*
    @Route /admin/members/accept/:memberId
    @Auth Protected
*/
router.post("/accept/:memberId", auth, async (req, res) => {
    processQuery("UPDATE `users` SET `whitelist_status` = ? WHERE `users`.`id` = ?", ["accepted", req.params.memberId])
        .then(() => {
            return res.json({ msg: "User Accepted" });
        })
        .catch(err => console.log(err));
})

/*
    @Route /admin/members/decline/:memberId
    @Auth Protected
*/
router.post("/decline/:memberId", auth, async (req, res) => {
    processQuery("UPDATE `users` SET `whitelist_status` = ? WHERE `users`.`id` = ?", ["declined", req.params.memberId])
        .then(() => {
            return res.json({ msg: "User Declined" });
        })
        .catch(err => console.log(err));
})

module.exports = router;