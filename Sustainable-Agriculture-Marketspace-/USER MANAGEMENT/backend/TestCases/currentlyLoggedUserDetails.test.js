const { getUserProfile } = require("../controllers/authController");
const User = require("../models/user");

jest.mock("../models/user");

describe("getUserProfile", () => {
  it("should retrieve the user profile successfully", async () => {
    const req = {
      user: { id: "user1" },
    };
    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };

    const mockUser = { _id: "user1", name: "John Doe" };

    User.findById.mockResolvedValue(mockUser);

    await getUserProfile(req, res, jest.fn());

    expect(User.findById).toHaveBeenCalledWith(req.user.id);
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith({
      success: true,
      user: mockUser,
    });
  });

  it("should handle errors and pass them to the next middleware", async () => {
    const req = {
      user: { id: "user1" },
    };
    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };

    const mockError = new Error("Database error");
    User.findById.mockRejectedValue(mockError);

    const next = jest.fn();

    await getUserProfile(req, res, next);

    expect(User.findById).toHaveBeenCalledWith(req.user.id);
    expect(next).toHaveBeenCalledWith(mockError);
    expect(res.status).not.toHaveBeenCalled();
    expect(res.json).not.toHaveBeenCalled();
  });
});
