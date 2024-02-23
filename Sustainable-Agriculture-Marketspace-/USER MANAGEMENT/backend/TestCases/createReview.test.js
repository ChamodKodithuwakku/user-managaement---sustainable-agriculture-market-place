const { createProductReview } = require("../controllers/productController");
const Product = require("../models/product");

jest.mock("../models/product");

describe("createProductReview", () => {
  it("should create a new review successfully", async () => {
    const req = {
      user: { _id: "user1", name: "John" },
      body: { rating: 5, comment: "Great product", productId: "product1" },
    };
    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };

    const mockProduct = {
      _id: "product1",
      name: "Product 1",
      reviews: [{ user: "user2", rating: 4, comment: "Good product" }],
      numOfReviews: 1,
      ratings: 4,
      save: jest.fn(),
    };

    Product.findById.mockResolvedValue(mockProduct);

    await createProductReview(req, res, jest.fn());

    expect(Product.findById).toHaveBeenCalledWith(req.body.productId);
    expect(mockProduct.reviews.length).toBe(2);
    expect(mockProduct.numOfReviews).toBe(2);
    expect(mockProduct.ratings).toBe(4.5);
    expect(mockProduct.save).toHaveBeenCalled();
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith({
      success: true,
    });
  });

  it("should update an existing review successfully", async () => {
    const req = {
      user: { _id: "user1", name: "John" },
      body: { rating: 5, comment: "Great product", productId: "product1" },
    };
    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };

    const mockProduct = {
      _id: "product1",
      name: "Product 1",
      reviews: [{ user: "user1", rating: 4, comment: "Good product" }],
      numOfReviews: 1,
      ratings: 4,
      save: jest.fn(),
    };

    Product.findById.mockResolvedValue(mockProduct);

    await createProductReview(req, res, jest.fn());

    expect(Product.findById).toHaveBeenCalledWith(req.body.productId);
    expect(mockProduct.reviews.length).toBe(1);
    expect(mockProduct.numOfReviews).toBe(1);
    expect(mockProduct.ratings).toBe(5);
    expect(mockProduct.save).toHaveBeenCalled();
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith({
      success: true,
    });
  });

  it("should handle errors and pass them to the next middleware", async () => {
    const req = {
      user: { _id: "user1", name: "John" },
      body: { rating: 5, comment: "Great product", productId: "product1" },
    };
    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };

    const mockError = new Error("Database error");
    Product.findById.mockRejectedValue(mockError);

    const next = jest.fn();

    await createProductReview(req, res, next);

    expect(Product.findById).toHaveBeenCalledWith(req.body.productId);
    expect(next).toHaveBeenCalledWith(mockError);
    expect(res.status).not.toHaveBeenCalled();
    expect(res.json).not.toHaveBeenCalled();
  });
});
