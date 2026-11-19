const express = require("express");
const { eq } = require("drizzle-orm");
const renderErrorHandler = require("../utilities/renderErrorHandler");

const db = require("../db/db");
const { potions } = require("../db/schema");

const router = express.Router();

router.get("/", async (req, res) => {
  try {
    const allpotions = await db.select().from(potions);
    return res.status(200).json(allpotions);
  } catch (err) {
    return res.status(500).json({
      succes: false,
      message: "Iternal server error",
    });
  }
});

router.get("/:id", async (req, res) => {
  try {
    const [entry] = await db
      .select()
      .from(potions)
      .where(eq(potions.id, +req.params.id));

    if (!entry) {
      return res.status(404).json({
        message: "hiba van öcsi",
      });
    }

    return res.status(200).json(entry);
  } catch (err) {
    return renderErrorHandler(res, err);
  }
});

router.post("/", async (req, res) => {
  try {
    const { name, effect, isDangerous } = req.body;

    if (!name) return res.status(400).json({ message: "'name' is required" });
    if (!effect)
      return res.status(400).json({ message: "'effect' is required" });
    if (typeof isDangerous !== "boolean")
      return res
        .status(400)
        .json({ message: "'isDangerous' must be a boolean" });

    await db.insert(potions).values({
      name,
      effect,
      isDangerous,
    });

    return res.status(201).json({ message: "Posted successfully" });
  } catch (err) {
    return renderErrorHandler(res, err);
  }
});

module.exports = router;
