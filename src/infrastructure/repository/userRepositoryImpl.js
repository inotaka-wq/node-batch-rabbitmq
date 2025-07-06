import { User } from "../db/models/User.js";
import { UserRepository } from "../../domain/repository/userRepository.js";

export class UserRepositoryImpl extends UserRepository {
  /**
   * @param {object} user - { name: string, email: string }
   */
  async insert(user) {
    await User.create({
      name: user.name,
      email: user.email,
    });
  }
}
