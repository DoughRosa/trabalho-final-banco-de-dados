import { Request, Response } from "express";
import db from "../database/prisma.connection";

class TweetController {
  public async create(req: Request, res: Response) {
    const token = req.headers.authorization;
    const { content } = req.body;

    if (!content) {
      return res.status(400).json({ success: true, msg: "Content Required" });
    }

    const findUser = await db.users.findFirst({
      where: {
        token,
      },
    });

    if (!findUser) {
      return res.status(400).json({
        success: false,
        msg: "You must be logged to tweet.",
      });
    }

    try {
      const tweet = await db.tweets.create({
        data: {
          content,
          userId: findUser.id,
          tweetType: "Tweet" || "Reply",
        },
      });

      if (tweet) {
        return res.status(200).json({
          success: true,
          msg: "Tweet Successfully Made",
          data: tweet,
        });
      }

      return res
        .status(500)
        .json({ success: false, msg: "Tweet Was NOT Created" });
    } catch (error) {
      return res.status(500).json({ success: false, msg: "ERROR DATABASE" });
    }
  }

  public async list(req: Request, res: Response) {
    try {
      const tweets = await db.tweets.findMany({
        include: {
          likes: true,
          user: {
            select: {
              name: true,
              username: true,
            },
          },
        },
      });
      return res
        .status(200)
        .json({ success: true, msg: "Tweets Listed", data: tweets });
    } catch (error) {
      return res
        .status(500)
        .json({ success: false, msg: "Failed to produce a list" });
    }
  }

  public async show(req: Request, res: Response) {
    const { userId } = req.params;

    try {
      const tweet = await db.tweets.findMany({
        where: {
          userId,
        },
        include: {
          likes: true,
          user: {
            select: {
              name: true,
              username: true,
            },
          },
        },
      });

      if (tweet) {
        return res.status(200).json({
          success: true,
          msg: "Tweet Showed",
          data: tweet,
        });
      }

      return res.status(404).json({
        success: false,
        msg: "Tweet Not Found",
      });
    } catch (error) {
      return res.status(500).json({ success: false, msg: "ERROR DATABASE" });
    }
  }

  public async update(req: Request, res: Response) {
    const { id } = req.params;
    const { content } = req.body;

    try {
      const tweet = await db.tweets.findUnique({
        where: {
          id,
        },
      });

      if (!tweet) {
        return res.status(404).json({
          success: false,
          msg: "Tweet Not Found",
        });
      }

      if (content) {
        await db.tweets.update({
          where: {
            id,
          },
          data: {
            content,
          },
        });

        return res.status(200).json({ success: true, msg: "Tweet Updated" });
      }

      return res.status(400).json({ success: false, msg: "Tweet NOT Updated" });
    } catch (error) {
      return res.status(500).json({ success: false, msg: "ERROR DATABASE" });
    }
  }

  public async delete(req: Request, res: Response) {
    const { id } = req.params;

    try {
      const tweet = await db.tweets.findUnique({
        where: {
          id,
        },
      });

      if (tweet) {
        await db.tweets.delete({
          where: { id },
        });
        return res.status(200).json({
          success: true,
          msg: "Tweet Deleted",
        });
      }

      return res.status(404).json({
        success: false,
        msg: "Tweet Not Found",
      });
    } catch (error) {
      return res.status(500).json({ success: false, msg: "ERROR DATABASE" });
    }
  }
}

export default TweetController;
