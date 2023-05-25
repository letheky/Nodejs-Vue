const { Research } = require("../models");
const { Instructor } = require("../models");
const { Circular } = require("../models");
const { Op } = require("sequelize");

const create = async (req, res) => {
  try {
    const {
      researchTitle,
      researchLevel,
      description,
      usage,
      duration,
      leaderID,
      members,
      allocationCircularID,
      councilCircularID,
      councilMembers,
      evaluationDate,
      progress,
      evaluationResult,
      budget,
      auditCircularID,
    } = req.body;

    await Research.create({
      researchTitle,
      researchLevel,
      description,
      usage,
      duration,
      leaderID,
      members,
      allocationCircularID,
      councilCircularID,
      councilMembers,
      evaluationDate,
      progress,
      evaluationResult,
      budget,
      auditCircularID,
    });

    res.status(201).json({ message: "Research created" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error", error: error });
  }
};

const put = async (req, res) => {
  try {
    const {
      researchID,
      researchTitle,
      researchLevel,
      description,
      usage,
      duration,
      leaderID,
      members,
      allocationCircularID,
      councilCircularID,
      councilMembers,
      evaluationDate,
      progress,
      evaluationResult,
      budget,
      auditCircularID,
    } = req.body;

    const research = await Research.findByPk(researchID);

    if (!research) {
      return res.status(404).send("Research not found");
    }

    await research.update({
      researchTitle,
      researchLevel,
      description,
      usage,
      duration,
      leaderID,
      members,
      allocationCircularID,
      councilCircularID,
      councilMembers,
      evaluationDate,
      progress,
      evaluationResult,
      budget,
      auditCircularID,
    });

    res.status(201).json({ message: "Research edited successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error", error: error });
  }
};

const deleteResearch =
  ("/",
  async (req, res) => {
    try {
      const { researchID } = req.query;

      if (!researchID) {
        return res
          .status(400)
          .json({ message: "researchID parameter is required" });
      }

      const numDeleted = await Research.destroy({ where: { researchID } });

      if (numDeleted === 0) {
        return res.status(404).json({
          message: `No Research with researchID=${researchID} was found`,
        });
      }

      res.json({
        message: `Research with researchID=${researchID} was deleted successfully`,
      });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Internal server error", researchID });
    }
  });

const getAll = async (req, res) => {
  try {
    const Researchs = await Research.findAll({
      include: [
        { model: Circular, as: "allocationCircular" },
        { model: Circular, as: "councilCircular" },
        { model: Circular, as: "auditCircular" },
        { model: Instructor, as: "Leader" },
      ],
    });
    res.json(Researchs);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error", error: error });
  }
};
const getInstructorInResearch = async (req, res) => {
  try {
    // Find all researches
    const researches = await Research.findAll();

    // Extract the member and leader student IDs from all researches
    const instructorNames = [];
    researches.forEach((research) => {
      const memberInstructorNames = research.members.split(",");
      const leaderInstructorName = research.leaderName;
      instructorNames.push(...memberInstructorNames, leaderInstructorName);
    });

    // Find the students by their IDs in the database
    const instructors = await Instructor.findAll({
      where: {
        instructorName: instructorNames,
      },
    });

    res.status(200).json(instructors);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error", error: error });
  }
};

const getResearchByID =
  ("/",
  async (req, res) => {
    try {
      const { researchID } = req.query;

      if (!researchID) {
        return res
          .status(400)
          .json({ message: "researchID parameter is required" });
      }
      const whereClause = {};

      if (researchID) {
        whereClause.researchID = {
          [Op.like]: `%${researchID}%`,
        };
      }

      const research = await Research.findAll({
        where: whereClause,
        include: [
          { model: Circular, as: "allocationCircular" },
          { model: Circular, as: "councilCircular" },
          { model: Circular, as: "auditCircular" },
          { model: Instructor, as: "Leader" },
        ],
      });
      res.json(research);
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Internal server error", error: error });
    }
  });

module.exports = {
  create,
  put,
  deleteResearch,
  getAll,
  getResearchByID,
  getInstructorInResearch,
};
