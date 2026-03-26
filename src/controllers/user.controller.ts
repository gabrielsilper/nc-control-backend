import { Request, Response } from "express";
import UserService from "../services/user.service";
import { CreateUserDTO } from "../schemas/create-user.schema";
import { UpdateUserDTO } from "../schemas/update-user.schema";

export default class UserController {
  constructor(private userService: UserService) {}

  async getAll(_req: Request, res: Response) {
    const users = await this.userService.findAll();

    const usersDto = users.map((user) => user.toDto());

    return res.json(usersDto);
  }

  async getById(req: Request, res: Response) {
    const { id } = req.params;

    const user = await this.userService.findById(id as string);

    return res.json(user.toDto());
  }

  async create(req: Request, res: Response) {
    const userData = req.body as CreateUserDTO;

    const newUser = await this.userService.create(userData);

    return res.status(201).json(newUser.toDto());
  }

  async update(req: Request, res: Response) {
    const { id } = req.params;

    const userData = req.body as UpdateUserDTO;

    const updatedUser = await this.userService.update(id as string, userData);

    return res.json(updatedUser.toDto());
  }

  async delete(req: Request, res: Response) {
    const { id } = req.params;

    await this.userService.delete(id as string);

    return res.status(204).send();
  }
}