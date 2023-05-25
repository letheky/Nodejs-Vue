const { Topic } = require("../models");
const { Student } = require("../models");
const { Circular } = require("../models");
const { Instructor } = require("../models");
const { Op } = require("sequelize");

const create = async (req, res) => {
  try {
    const {
      topicName,
      duration,
      leaderID,
      instructorID,
      members,
      progress,
      allocationCircularID,
      councilCircularID,
      evaluationResult,
      evaluationDate,
      councilMembers,
    } = req.body;

    await Topic.create({
      topicName,
      duration,
      leaderID,
      instructorID,
      members,
      progress,
      allocationCircularID,
      councilCircularID,
      evaluationResult,
      evaluationDate,
      councilMembers,
    });

    res.status(201).json({ message: "Topic created" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error", error: error });
  }
};

const put = async (req, res) => {
  try {
    const {
      topicID,
      topicName,
      duration,
      leaderID,
      instructorID,
      members,
      progress,
      allocationCircularID,
      councilCircularID,
      evaluationResult,
      evaluationDate,
      councilMembers,
    } = req.body;

    const topic = await Topic.findByPk(topicID);

    if (!topic) {
      return res.status(404).send("Topic not found");
    }

    await topic.update({
      topicName,
      duration,
      leaderID,
      instructorID,
      members,
      progress,
      allocationCircularID,
      councilCircularID,
      evaluationResult,
      evaluationDate,
      councilMembers,
    });

    res.status(201).json({ message: "Topic edited successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error", error: error });
  }
};

const deleteTopic =
  ("/",
  async (req, res) => {
    try {
      const { topicID } = req.query;

      if (!topicID) {
        return res
          .status(400)
          .json({ message: "topicID parameter is required" });
      }

      const numDeleted = await Topic.destroy({ where: { topicID } });

      if (numDeleted === 0) {
        return res.status(404).json({
          message: `No Topic with topicID=${topicID} was found`,
        });
      }

      res.json({
        message: `Topic with topicID=${topicID} was deleted successfully`,
      });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Internal server error", topicID });
    }
  });

const getAll = async (req, res) => {
  try {
    const Topics = await Topic.findAll({
      include: [
        { model: Circular, as: "allocationCircular" },
        { model: Circular, as: "councilCircular" },
        { model: Student, as: "Leader" },
        { model: Instructor, as: "Instructor" },
      ],
    });
    res.json(Topics);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error", error: error });
  }
};
const getStudentInResearch = async (req, res) => {
  try {
    // Find all researches
    const topics = await Topic.findAll();

    // Extract the member and leader student IDs from all researches
    const studentNames = [];
    topics.forEach((topic) => {
      const memberStudentNames = topic.members.split(",");
      const leaderStudentName = topic.leaderName;
      studentNames.push(...memberStudentNames, leaderStudentName);
    });

    // Find the students by their IDs in the database
    const students = await Student.findAll({
      where: {
        studentName: studentNames,
      },
    });

    res.status(200).json(students);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error", error: error });
  }
};

const getTopicByID =
  ("/",
  async (req, res) => {
    try {
      const { topicID } = req.query;

      if (!topicID) {
        return res
          .status(400)
          .json({ message: "topicID parameter is required" });
      }
      const whereClause = {};

      if (topicID) {
        whereClause.topicID = {
          [Op.like]: `%${topicID}%`,
        };
      }

      const topic = await Topic.findAll({
        where: whereClause,
        include: [
          { model: Circular, as: "allocationCircular" },
          { model: Circular, as: "councilCircular" },
          { model: Student, as: "Leader" },
          { model: Instructor, as: "Instructor" },
        ],
      });
      res.json(topic);
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Internal server error", error: error });
    }
  });

module.exports = {
  create,
  put,
  deleteTopic,
  getAll,
  getTopicByID,
  getStudentInResearch,
};
