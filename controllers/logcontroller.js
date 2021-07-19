const { query } = require('express');
const Express = require('express');
const router = Express.Router();
let validateJWT = require("../middleware/validate-jwt");
// Import the Log Model
const {LogModel} = require('../models');

// Create Workout Log
router.post('/log', validateJWT, async(req, res) =>{
    const { description, definition, result } = req.body.log;
    const  owner_id  = req.user.id;
    const logEntry = {
        description,
        definition,
        result,
        owner_id: owner_id
    }
    console.log(owner_id)
    try {
        const newLog = await LogModel.create(logEntry);
        res.status(200).json(newLog);
    } catch (err) {
        res.status(500).json({ error: err });
    }
    LogModel.create(logEntry)
 });

 // Get all Workout Logs

router.get("/", async (req, res) => {
    try{
        const entries = await LogModel.findAll();
        res.status(200).json(entries);
    } catch (err) {
        res.status(500).json({ error: err });
    }
});

//Get Logs by User id
router.get("/find", validateJWT, async (req, res)=>{
    let  {id} = req.user;
    try {
        const userLogs = await LogModel.findAll({
            where: {
                owner_id: id
            }
        });
        res.status(200).json(userLogs);
    } catch (err) {
        res.status(500).json({ error: err });
    }
});

// update a log
router.put("/update/:id", validateJWT, async (req, res)=>{
    const {description, definition, result } = req.body.log;
    const LogId = req.params.id;
    const userId = req.user.id;

    const query = {
        where: {
            id: LogId,
            owner_id: userId
        }
    };

    const updatedLog = {
        description: description,
        definition: definition,
        result: result,
    };

    try {
        const update = await LogModel.update(updatedLog, query);
        res.status(200).json(update);
    } catch (err) {
        res.status(500).json({ error: err });
    }
});
// Delete a log
router.delete("/delete/:id", validateJWT, async (req, res)=> {
    const ownerId = req.user.id;
    const logId = req.params.id;

    try {
        const query = {
            where: {
                id: logId,
                owner_id: ownerId
            }
        };
        await LogModel.destroy(query);
        res.status(200).json({message: "Workout entry removed"});
    } catch (err) {
        res.status(500).json({ error: err });
    }
})
module.exports = router;