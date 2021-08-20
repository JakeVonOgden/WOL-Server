const router = require("express").Router();
const validateJWT = require('../middleware/validate-jwt');
const { LogModel } = require('../models');
/*
======================
    Create Log
======================
*/
router.post("/", validateJWT, async (req, res) => {
    const {description, definition, result} = req.body
    const {id} = req.user
    try {
        const Log = await LogModel.create({
            description,
            definition,
            result,
            owner_id: id
        })
        res.status(201).json ({
            message: "log created",
            Log,
        });
    } catch (e) {
        res.status(500).json({
            error: e 
        });
    }
});
/*
======================
    Get all Logs
======================
*/

router.get("/", async (req, res) => {
    try{
        const entries = await LogModel.findAll();
        res.status(200).json(entries);
    } catch (e) {
        res.status(500).json({
            error: e
        })
    }
})

/*
========================
    Get Logs by User
========================
router.get("/:name", async (req, res) => {
  try {
    const locatedPie = await PieModel.findOne({
      where: {
        nameOfPie: req.params.name,
      },
    });

    res.status(200).json({
      message: "Pies successfully retrieved",
      locatedPie,
    });
  } catch (err) {
    res.status(500).json({
      message: `Failed to retrieve pies: ${err}`,
    });
  }
});

*/

router.get("/:id", validateJWT, async (req, res) => {
    const {id} = req.user
    try {
        const LocatedLog = await LogModel.findOne({
            where: {
                id: req.params.id
            },
        });
        res.status(200).json({
            message: "Log succesfully retrieved",
            LocatedLog,
        });
    }   catch (e) {
        res.status(500).json({
            message: `Failed to retrieve log: ${e}`
        })
    }
})



/*
======================
    Update A Log
======================
*/
router.put("/:id", validateJWT, async (req, res) => {
    const { description, definition, result } = req.body;
    const logId = req.params.id;
    const userId = req.user.id;

    const query = {
        where: {
            id: logId,
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
        res.status(200).json({
            message: "log succesfully updated",
            update
        });
    } catch (e) {
        res.status(500).json({
            error: e
        })
    }
})



/*
======================
    Delete Log
======================
*/

router.delete("/:id", validateJWT, async (req, res) => {
  

    try {
        const deletedLog = await LogModel.destroy({
            where: {
                id: req.params.id,
            },
        });
      
      
        res.status(200).json({
            message: "Log entry removed",
            deletedLog,
        });
    } catch (e) {
        res.status(500).json({
            message: "Failed to retrieve log",
            error: e
        })
    }
})

module.exports = router;