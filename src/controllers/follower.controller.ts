import { Request, Response } from "express";
import db from "../database/prisma.connection";
import generateHash from "../utils/generateHash";

class FollowerController {
  public async create(req: Request, res: Response) {
    const token = req.headers.authorization;
    const { id } = req.body;

    try {
      const follow = await db.users.findUnique({
        where: {
          id,
        },
      });

      if (!follow) {
        return res.status(400).json({ success: false, msg: "User NOT Found." });
      }

      const user = await db.users.findFirst({
        where: {
          token,
        },
      });

      if (!user) {
        return res
          .status(400)
          .json({
            success: false,
            msg: "You Have to Be Logged to Follow an User.",
          });
      };

      if (user?.id === follow.id) {
        return res.status(400).json({
          success: false,
          msg: "You Can Not Follow Yourself.",
        });
      };

      const alreadyFollowing = await db.followers.findFirst({
        where: {
          userId: user.id,
          followerId: follow.id,
        },
      });

      if(alreadyFollowing){
        return res.status(400).json({
          success: false,
          msg: "You Are Already Following This User.",
        });
      };

      const followed = await db.followers.create({
        data: {
          userId: user.id,
          followerId: follow.id,
        },
      });

      return res
        .status(200)
        .json({ success: true, msg: "You Are Now Following This User" });
    } catch (error) {
      return res.status(500).json({ success: false, msg: "ERROR DATABASE" });
    };
  };

  public async list(req: Request, res: Response) {
    try {
      const followers = await db.followers.findMany();
      return res
        .status(200)
        .json({ success: true, msg: "Followers Listed", data: followers });
    } catch (error) {
      return res
        .status(500)
        .json({ success: false, msg: "Failed to produce a list" });
    };
  };

  public async show(req: Request, res: Response) {
    const { id } = req.params;

    try {
      const follower = await db.followers.findUnique({
        where: {
          id,
        },
      });

      if (follower) {
        return res.status(200).json({
          success: true,
          msg: "Follower Showed",
          data: follower,
        });
      };

      return res.status(404).json({
        success: false,
        msg: "Follower Not Found",
      });
    } catch (error) {
      return res.status(500).json({ success: false, msg: "ERROR DATABASE" });
    };
  };

  public async delete(req: Request, res: Response) {
    const { id } = req.params;

    try {
      const follower = await db.followers.findUnique({
        where: {
          id,
        },
      });

      if (follower) {
        await db.followers.delete({
          where: { id },
        });
        return res.status(200).json({
          success: true,
          msg: "You No Longer Follow This User",
        });
      };

      return res.status(404).json({
        success: false,
        msg: "Follower Not Found",
      });
    } catch (error) {
      return res.status(500).json({ success: false, msg: "ERROR DATABASE" });
    };
  };
};

export default FollowerController;
