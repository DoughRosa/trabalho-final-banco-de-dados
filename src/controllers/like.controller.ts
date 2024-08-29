import { Request, Response } from "express";
import db from "../database/prisma.connection";

class LikeController {
  public async create(req: Request, res: Response) {
    const token = req.headers.authorization;
    const { tweetId } = req.body;

    try {
      const findUser = await db.users.findFirst({
        where: {
          token,
        },
      });

      if (!findUser) {
        return res.status(400).json({
          success: false,
          msg: "You must be logged to like a tweet.",
        });
      }

      if (!tweetId) {
        return res.status(400).json({
          success: false,
          msg: "Tweet not found.",
        });
      }

      const liked = await db.likes.findFirst({
        where: {
          tweetId,
          userId: findUser.id,
        },
      });

      if (liked) {
        return res.status(400).json({
          success: false,
          msg: "You Already Liked This Tweet.",
        });
      }

      const like = await db.likes.create({
        data: {
          tweetId,
          userId: findUser.id,
        },
      });

      return res.status(200).json({
        success: true,
        msg: "Tweet Liked!",
        data: like,
      });
    } catch (error) {
      return res.status(500).json({ success: false, msg: "ERROR DATABASE" });
    };
  };

  public async list(req: Request, res: Response) {
    try {
      const likes = await db.likes.findMany();
      return res
        .status(200)
        .json({ success: true, msg: "Likes Listed", data: likes });
    } catch (error) {
      return res
        .status(500)
        .json({ success: false, msg: "Failed to produce a list" });
    };
  };

  public async show(req: Request, res: Response) {
    const { id } = req.params;

    try {
      const like = await db.tweets.findUnique({
        where: {
          id,
        },
      });

      if (like) {
        return res.status(200).json({
          success: true,
          msg: "Like Showed",
          data: like,
        });
      };

      return res.status(404).json({
        success: false,
        msg: "Like Not Found",
      });
    } catch (error) {
      return res.status(500).json({ success: false, msg: "ERROR DATABASE" });
    };
  };

  public async delete(req: Request, res: Response) {
    const { id } = req.params;

    try {
      const like = await db.likes.findUnique({
        where: {
          id,
        },
      });

      if (like) {
        await db.tweets.delete({
          where: { id },
        });
        return res.status(200).json({
          success: true,
          msg: "Like Deleted",
        });
      };

      return res.status(404).json({
        success: false,
        msg: "Like Not Found",
      });
    } catch (error) {
      return res.status(500).json({ success: false, msg: "ERROR DATABASE" });
    };
  };
};

export default LikeController;