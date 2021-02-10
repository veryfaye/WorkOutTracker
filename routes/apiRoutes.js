const router = require("express").Router();
const Workout = require("../models/workout.js");
const ObjectId = require("mongoose").Types.ObjectId;

//create a new work out
router.post("/api/workouts", ({ body }, res) => {
  Workout.create(body)
    .then((dbWorkout) => {
      res.json(dbWorkout);
    })
    .catch((err) => {
      res.status(400).json(err);
    });
});

//Get work outs sorted decending by date
router.get("/api/workouts", (req, res) => {
  Workout.aggregate([
    {
      $addFields: {
        totalDuration: {
          $sum: "$exercises.duration",
        },
      },
    },
  ])
    .sort({ date: -1 })
    .then((dbWorkout) => {
      res.json(dbWorkout);
    })
    .catch((err) => {
      res.status(400).json(err);
    });
});

//update one excercise
router.put("/api/workouts/:id", (req, res) => {
  Workout.findOneAndUpdate(
    { _id: ObjectId(req.params.id) },
    { $push: { exercises: req.body } },
    { new: true }
  )
    .then((dbWorkout) => {
      res.json(dbWorkout);
    })
    .catch((err) => {
      res.json(err);
    });
});

router.get("/api/workouts/range", (req, res) => {
  Workout.aggregate([
    {
      $addFields: {
        totalDuration: {
          $sum: "$exercises.duration",
        },
      },
    },
    {
      $sort: {
        day: -1,
      },
    },
    {
      $limit: 7,
    },
  ])
    .then((dbWorkout) => {
      res.json(dbWorkout);
    })
    .catch(({ err }) => {
      res.json(err);
    });
});

module.exports = router;
