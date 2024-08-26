import { Request, Response } from "express";
import db from "../database/prisma.connection";
import generateHash from "../utils/generateHash";

class UserController {
  public async create(req: Request, res: Response) {
    const { email, name, password } = req.body;

    if (!email || !password || !name) {
      return res
        .status(400)
        .json({ success: true, msg: "Please, fill all the required fields" });
    }

    try {
      const userFind = await db.users.findUnique({
        where: { email },
      });

      if (userFind) {
        return res.status(400).json({ success: false, msg: "User Already Exists." });
      }

      const hash = generateHash(password);

      const newUser = await db.users.create({
        data: { email, password: hash, name },
      });

      if (newUser) {
        return res.status(200).json({
          success: true,
          msg: "New User Successfully Created",
          data: {
            id: newUser.id,
            user: newUser.name,
            email: newUser.email
          },
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
      const users = await db.users.findMany();
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
    const { id } = req.params;

    try {
      const user = await db.users.findUnique({
        where: {
          id,
        },
      });

      if (user) {
        return res.status(200).json({
          success: true,
          msg: "User Showed",
          data: user,
        });
      }

      return res.status(404).json({
        success: false,
        msg: "User Not Found",
      });
    } catch (error) {
      return res.status(500).json({ success: false, msg: "ERROR DATABASE" });
    }
  }

  public async update(req: Request, res: Response) {
    const { id } = req.params;
    const { name, password } = req.body;

    try {
      const user = await db.users.findUnique({
        where: {
          id,
        },
      });

      if (!user) {
        return res.status(404).json({
          success: false,
          msg: "User Not Found",
        });
      }

      if (name) {
        await db.users.update({
          where: {
            id,
          },
          data: {
            name,
            password,
          },
        });

        return res.status(200).json({ success: true, msg: "User Updated" });
      }

      return res.status(400).json({ success: false, msg: "User NOT Updated" });
    } catch (error) {
      return res.status(500).json({ success: false, msg: "ERROR DATABASE" });
    }
  }

  public async delete(req: Request, res: Response) {
    const { id } = req.params;

    try {
      const user = await db.users.findUnique({
        where: {
          id,
        },
      });

      if (user) {
        await db.users.delete({
          where: { id },
        });
        return res.status(200).json({
          success: true,
          msg: "User Deleted",
        });
      }

      return res.status(404).json({
        success: false,
        msg: "User Not Found",
      });
    } catch (error) {
      return res.status(500).json({ success: false, msg: "ERROR DATABASE" });
    }
  }
}

export default UserController;