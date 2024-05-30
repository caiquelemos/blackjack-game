import BaseDao from "../../../src/daos/baseDao";

describe("BaseDao", () => {
  let mockModel;
  let baseDao;

  beforeEach(() => {
    mockModel = {
      create: jest.fn(),
      findByPk: jest.fn(),
      findAll: jest.fn(),
      update: jest.fn(),
      destroy: jest.fn(),
    };
    baseDao = new BaseDao(mockModel);
  });

  describe("create", () => {
    test("should create a record", async () => {
      const data = { name: "Test" };
      mockModel.create.mockResolvedValue(data);

      const result = await baseDao.create(data);

      expect(mockModel.create).toHaveBeenCalledWith(data);
      expect(result).toEqual(data);
    });

    test("should throw an error if creation fails", async () => {
      const data = { name: "Test" };
      const error = new Error("Creation failed");
      mockModel.create.mockRejectedValue(error);

      await expect(baseDao.create(data)).rejects.toThrow("Creation failed");
    });
  });

  describe("getById", () => {
    test("should get a record by ID", async () => {
      const data = { id: 1, name: "Test" };
      mockModel.findByPk.mockResolvedValue(data);

      const result = await baseDao.getById(1);

      expect(mockModel.findByPk).toHaveBeenCalledWith(1);
      expect(result).toEqual(data);
    });

    test("should throw an error if record not found", async () => {
      mockModel.findByPk.mockResolvedValue(null);

      await expect(baseDao.getById(1)).rejects.toThrow("undefined not found");
    });

    test("should throw an error if fetching fails", async () => {
      const error = new Error("Fetch failed");
      mockModel.findByPk.mockRejectedValue(error);

      await expect(baseDao.getById(1)).rejects.toThrow("Fetch failed");
    });
  });

  describe("getAll", () => {
    test("should get all records", async () => {
      const data = [{ id: 1, name: "Test" }];
      mockModel.findAll.mockResolvedValue(data);

      const result = await baseDao.getAll();

      expect(mockModel.findAll).toHaveBeenCalled();
      expect(result).toEqual(data);
    });

    test("should throw an error if fetching all records fails", async () => {
      const error = new Error("Fetch all failed");
      mockModel.findAll.mockRejectedValue(error);

      await expect(baseDao.getAll()).rejects.toThrow("Fetch all failed");
    });
  });

  describe("update", () => {
    test("should update a record", async () => {
      const data = { id: 1, name: "Test" };
      const updatedData = { name: "Updated Test" };
      const updatedRecord = { id: 1, ...updatedData };
      mockModel.findByPk.mockResolvedValue({
        update: jest.fn().mockResolvedValue(updatedRecord),
      });

      const result = await baseDao.update(1, updatedData);

      expect(mockModel.findByPk).toHaveBeenCalledWith(1);
      expect(result).toEqual(updatedRecord);
    });

    test("should throw an error if record not found for update", async () => {
      mockModel.findByPk.mockResolvedValue(null);

      await expect(baseDao.update(1, { name: "Updated Test" })).rejects.toThrow(
        "undefined not found"
      );
    });

    test("should throw an error if update fails", async () => {
      const error = new Error("Update failed");
      mockModel.findByPk.mockRejectedValue(error);

      await expect(baseDao.update(1, { name: "Updated Test" })).rejects.toThrow(
        "Update failed"
      );
    });
  });

  describe("delete", () => {
    test("should delete a record", async () => {
      const data = { id: 1, name: "Test" };
      mockModel.findByPk.mockResolvedValue({
        destroy: jest.fn().mockResolvedValue(true),
      });

      const result = await baseDao.delete(1);

      expect(mockModel.findByPk).toHaveBeenCalledWith(1);
      expect(result).toBe(true);
    });

    test("should throw an error if record not found for delete", async () => {
      mockModel.findByPk.mockResolvedValue(null);

      await expect(baseDao.delete(1)).rejects.toThrow("undefined not found");
    });

    test("should throw an error if delete fails", async () => {
      const error = new Error("Delete failed");
      mockModel.findByPk.mockRejectedValue(error);

      await expect(baseDao.delete(1)).rejects.toThrow("Delete failed");
    });
  });
});
