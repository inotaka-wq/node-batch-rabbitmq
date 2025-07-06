export class InsertUserUsecase {
  constructor(userRepository) {
    this.userRepository = userRepository;
  }

  /**
   * ユーザーを登録するユースケース
   * @param {object} payload - { name: string, email: string }
   */
  async execute(payload) {
    const { name, email } = payload;

    if (!name || !email) {
      throw new Error("name と email は必須です");
    }

    // Entity 生成（今回は軽め）
    const user = {
      name,
      email,
    };

    // Repository を経由して INSERT 実行
    await this.userRepository.insert(user);
  }
}
