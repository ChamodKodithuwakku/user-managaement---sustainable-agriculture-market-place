const { getUserDetails } = require("../controllers/authController");
const User = require("../models/user");
const ErrorHandler = require("../utils/errorHandler");

jest.mock("../models/user");
jest.mock("../utils/errorHandler");

describe("getUserDetails", () => {
  it("should return user details if user is found", async () => {
    const req = {
      params: {
        id: "mock_user_id",
      },
    };

    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };

    const mockUser = {
      _id: "mock_user_id",
      name: "John Doe",
      email: "johndoe@example.com",
    };

    User.findById.mockResolvedValue(mockUser);

    await getUserDetails(req, res, jest.fn());

    expect(User.findById).toHaveBeenCalledWith("mock_user_id");
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith({
      success: true,
      user: mockUser,
    });
  });
});
