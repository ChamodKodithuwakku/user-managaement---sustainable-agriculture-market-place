const { allUsers } = require("../controllers/authController");
const User = require("../models/user");

jest.mock("../models/user");

describe("allUsers", () => {
  it("should retrieve all users successfully", async () => {
    const req = {};
    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };

    const mockUsers = [
      { _id: "user1", name: "John Doe" },
      { _id: "user2", name: "Jane Smith" },
    ];

    User.find.mockResolvedValue(mockUsers);

    await allUsers(req, res, jest.fn());

    expect(User.find).toHaveBeenCalled();
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith({
      success: true,
      users: mockUsers,
    });
  });

  it("should handle errors and pass them to the next middleware", async () => {
    const req = {};
    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };

    const mockError = new Error("Database error");
    User.find.mockRejectedValue(mockError);

    const next = jest.fn();

    await allUsers(req, res, next);

    expect(User.find).toHaveBeenCalled();
    expect(next).toHaveBeenCalledWith(mockError);
    expect(res.status).not.toHaveBeenCalled();
    expect(res.json).not.toHaveBeenCalled();
  });
});
