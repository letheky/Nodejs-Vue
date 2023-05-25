const { Seminar } = require("../models");
const { Op } = require("sequelize");

const create = async (req, res) => {
  try {
    const { seminarName, seminarPlan, peopleAssignNum, paperAssign } = req.body;

    await Seminar.create({
      seminarName,
      seminarPlan,
      peopleAssignNum,
      paperAssign
    });

    res.status(201).json({ message: "Seminar created" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error", error: error });
  }
};

const put = async (req, res) => {
  try {
    const {
      seminarID,
      seminarName,
      seminarPlan,
      peopleAssignNum,
      paperAssign,
    } = req.body;

    const seminar = await Seminar.findByPk(seminarID);

    if (!seminar) {
      return res.status(404).send("Seminar not found");
    }

    await seminar.update({
      seminarName,
      seminarPlan,
      peopleAssignNum,
      paperAssign,
    });

    res.status(201).json({ message: "Seminar edited successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error", error: error });
  }
};

const deleteSeminar =
  ("/",
  async (req, res) => {
    try {
      const { seminarID } = req.query;

      if (!seminarID) {
        return res
          .status(400)
          .json({ message: "seminarID parameter is required" });
      }

      const numDeleted = await Seminar.destroy({ where: { seminarID } });

      if (numDeleted === 0) {
        return res.status(404).json({
          message: `No Seminar with seminarID=${seminarID} was found`,
        });
      }

      res.json({
        message: `Seminar with seminarID=${seminarID} was deleted successfully`,
      });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Internal server error", seminarID });
    }
  });

const getAll = async (req, res) => {
  try {
    const Seminars = await Seminar.findAll();
    res.json(Seminars);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error", error: error });
  }
};

const getSeminarByID =
  ("/",
  async (req, res) => {
    try {
      const { seminarID } = req.query;

      if (!seminarID) {
        return res
          .status(400)
          .json({ message: "seminarID parameter is required" });
      }
      const whereClause = {};

      if (seminarID) {
        whereClause.seminarID = {
          [Op.like]: `%${seminarID}%`,
        };
      }

      const seminar = await Seminar.findAll({ where: whereClause });
      res.json(seminar);
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Internal server error", error: error });
    }
  });

module.exports = {
  create,
  put,
  deleteSeminar,
  getAll,
  getSeminarByID,
};
