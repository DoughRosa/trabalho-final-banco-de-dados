import { Request, Response } from "express";
import db from "../database/prisma.connection";

class TweetController {
  public async create(req: Request, res: Response) {
    const { userId, content } = req.body;

    if(!content){
      return res.status(400).json({ success: true, msg: "Content Required"})
    }

    try {
      const tweet = await db.tweet.create({
        data: { userId, content },
      });

      if (tweet) {
        return res
          .status(200)
          .json({
            success: true,
            msg: "User Created Successfully",
            data: userId,
          });
      }

      return res
        .status(500)
        .json({ success: false, msg: "User Was NOT Created" });
    } catch (error) {
      return res.status(500).json({ success: false, msg: "ERROR DATABASE" });
    }
  }

  public async list(req: Request, res: Response) {
    try {
      const users = await db.user.findMany();
      return res
        .status(200)
        .json({ success: true, msg: "Users Listed", data: users });
    } catch (error) {
      return res
        .status(500)
        .json({ success: false, msg: "Failed to produce a list" });
    }
  }

  public async show(req: Request, res: Response) {
    const {id} = req.params;

    try {
      const user = await db.user.findUnique({
        where: {
          id,
        }
      });

      if(user){
        return res
          .status(200)
          .json({
            success: true,
            msg: "User Showed",
            data: user,
          });
      }

      return res
          .status(404)
          .json({
            success: false,
            msg: "User Not Found",
          });
      
    } catch (error) {
      return res.status(500).json({ success: false, msg: "ERROR DATABASE" });
    }
  }

  public async update(req: Request, res: Response) {
    const {id} = req.params;
    const {name, password} = req.body;


    try {
      const user = await db.user.findUnique({
        where: {
          id,
        }
      });

      if(!user){
        return res
          .status(404)
          .json({
            success: false,
            msg: "User Not Found",
          });
      }

      if(name){
        await db.user.update({
          where: {
            id
          },
          data: {
            name,
            password
          }
        });

        return res.status(200).json({ success: true, msg: "User Updated" });
      }

      return res.status(400).json({ success: false, msg: "User NOT Updated" });
      
    } catch (error) {
      return res.status(500).json({ success: false, msg: "ERROR DATABASE" });
    }
  }

  public async delete(req: Request, res: Response) {
    const {id} = req.params;

    try {
      const user = await db.user.findUnique({
        where: {
          id,
        }
      });

      if(user){

        await db.user.delete({
          where: {id},
        });
        return res
          .status(200)
          .json({
            success: true,
            msg: "User Deleted",
          });
      }

      return res
          .status(404)
          .json({
            success: false,
            msg: "User Not Found",
          });
      
    } catch (error) {
      return res.status(500).json({ success: false, msg: "ERROR DATABASE" });
    }
  }  
}

export default TweetController;