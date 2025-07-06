import { InsertUserUsecase } from "../usecase/insertUserUsecase.js";
import { UserRepositoryImpl } from "../infrastructure/repository/userRepositoryImpl.js";

const userRepository = new UserRepositoryImpl();
const insertUserUsecase = new InsertUserUsecase(userRepository);

export async function batch1Service(payload) {
  await insertUserUsecase.execute(payload);
}
