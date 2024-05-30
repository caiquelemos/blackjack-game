class BaseDao {
  constructor(model) {
    this.model = model;
  }

  async create(data) {
    try {
      const record = await this.model.create(data);
      return record;
    } catch (error) {
      throw error;
    }
  }

  async getById(id) {
    try {
      const record = await this.model.findByPk(id);
      if (!record) {
        throw new Error(`${this.model.name} not found`);
      }
      return record;
    } catch (error) {
      throw error;
    }
  }

  async getAll() {
    try {
      const records = await this.model.findAll();
      return records;
    } catch (error) {
      throw error;
    }
  }

  async update(id, data) {
    try {
      const record = await this.model.findByPk(id);
      if (!record) {
        throw new Error(`${this.model.name} not found`);
      }
      return await record.update(data);
    } catch (error) {
      throw error;
    }
  }

  async delete(id) {
    try {
      const record = await this.model.findByPk(id);
      if (!record) {
        throw new Error(`${this.model.name} not found`);
      }
      await record.destroy();
      return true;
    } catch (error) {
      throw error;
    }
  }
}

export default BaseDao;
