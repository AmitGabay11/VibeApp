import express, { Request, Response } from "express";
import mongoose from "mongoose";
import Grid from "gridfs-stream";

const router = express.Router();

// Initialize GridFS
const conn = mongoose.connection;
let gfs: Grid.Grid;

conn.once("open", () => {
  gfs = Grid(conn.db, mongoose.mongo);
  gfs.collection("uploads");
});

/**
 * @swagger
 * tags:
 *   name: Images
 *   description: Retrieve images from GridFS
 */


/**
 * @swagger
 * /images/{filename}:
 *   get:
 *     summary: Retrieve an image stored in GridFS by filename
 *     tags: [Images]
 *     parameters:
 *       - in: path
 *         name: filename
 *         required: true
 *         schema:
 *           type: string
 *         description: The name of the image file
 *     responses:
 *       200:
 *         description: Image streamed from database
 *       404:
 *         description: Image not found
 *       500:
 *         description: Error retrieving image
 */
router.get("/:filename", async (req: Request<{ filename: string }>, res: Response) => {
  try {
    if (!gfs) {
      return res.status(500).json({ message: "GridFS not initialized" });
    }

    const file = await gfs.files.findOne({ filename: req.params.filename });
    if (!file) {
      return res.status(404).json({ message: "File not found" });
    }

    const readStream = gfs.createReadStream(file.filename);
    readStream.pipe(res);
  } catch (err) {
    res.status(500).json({ message: "Error retrieving file" });
  }
});

export default router;
