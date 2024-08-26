import { Request, Response } from "express";
import db from "../database/prisma.connection";

class ReplyController {

  public async create(req: Request, res: Response) {
    const token = req.headers.authorization;
    const { tweetId, content } = req.body;

    if(!tweetId){
      return res.status(400).json({ success: true, msg: "Tweet Not Found"});
    };

    if(!content){
      return res.status(400).json({ success: true, msg: "Content Required"});
    };

    const findUser = await db.users.findFirst({
      where: {
        token,
      },
    });

    if(!findUser){
      return res.status(400).json({
        success: false, msg: "You must be logged to reply."
      });
    };

    try {
      const reply = await db.replies.create({
        data: { 
          content,
          userId: findUser.id,
          tweetId,
         },
      });

      if (reply) {
        return res
          .status(200)
          .json({
            success: true,
            msg: "You Replied This Tweet Successfully.",
            data: reply,
          });
      };

      return res
        .status(500)
        .json({ success: false, msg: "Reply Was NOT Created" });
    } catch (error) {
      return res.status(500).json({ success: false, msg: "ERROR DATABASE" });
    };
  };

  public async list(req: Request, res: Response) {
    try {
      const replies = await db.replies.findMany();
      return res
        .status(200)
        .json({ success: true, msg: "Replies Listed", data: replies });
    } catch (error) {
      return res
        .status(500)
        .json({ success: false, msg: "Failed to produce a list" });
    };
  };

  public async show(req: Request, res: Response) {
    const {id} = req.params;

    try {
      const reply = await db.replies.findUnique({
        where: {
          id,
        }
      });

      if(reply){
        return res
          .status(200)
          .json({
            success: true,
            msg: "Reply Showed",
            data: reply,
          });
      };

      return res
          .status(404)
          .json({
            success: false,
            msg: "Reply Not Found",
          });
      
    } catch (error) {
      return res.status(500).json({ success: false, msg: "ERROR DATABASE" });
    };
  };

  public async update(req: Request, res: Response) {
    const {id} = req.params;
    const {content} = req.body;

    try {
      const reply = await db.replies.findUnique({
        where: {
          id,
        }
      });

      if(!reply){
        return res
          .status(404)
          .json({
            success: false,
            msg: "Reply Not Found",
          });
      };

      if(content){
        await db.tweets.update({
          where: {
            id
          },
          data: {
            content
          }
        });

        return res.status(200).json({ success: true, msg: "Reply Updated" });
      }

      return res.status(400).json({ success: false, msg: "Reply NOT Updated" });
      
    } catch (error) {
      return res.status(500).json({ success: false, msg: "ERROR DATABASE" });
    }
  };

  public async delete(req: Request, res: Response) {
    const {id} = req.params;

    try {
      const reply = await db.replies.findUnique({
        where: {
          id,
        }
      });

      if(reply){

        await db.tweets.delete({
          where: {id},
        });
        return res
          .status(200)
          .json({
            success: true,
            msg: "Reply Deleted",
          });
      };

      return res
          .status(404)
          .json({
            success: false,
            msg: "Reply Not Found",
          });
      
    } catch (error) {
      return res.status(500).json({ success: false, msg: "ERROR DATABASE" });
    };
  };
};

export default ReplyController;