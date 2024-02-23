const { getProductReviews } = require("../controllers/productController");
const Product = require("../models/product");

jest.mock("../models/product");

describe("getProductReviews", () => {
  it("should retrieve product reviews successfully", async () => {
    const req = {
      query: { id: "product1" },
    };
    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };

    const mockProduct = {
      _id: "product1",
      name: "Product 1",
      reviews: [
        { _id: "review1", rating: 4, comment: "Great product" },
        { _id: "review2", rating: 5, comment: "Excellent quality" },
      ],
    };

    Product.findById.mockResolvedValue(mockProduct);

    await getProductReviews(req, res, jest.fn());

    expect(Product.findById).toHaveBeenCalledWith(req.query.id);
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith({
      success: true,
      reviews: mockProduct.reviews,
    });
  });

  it("should handle errors and pass them to the next middleware", async () => {
    const req = {
      query: { id: "product1" },
    };
    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };

    const mockError = new Error("Database error");
    Product.findById.mockRejectedValue(mockError);

    const next = jest.fn();

    await getProductReviews(req, res, next);

    expect(Product.findById).toHaveBeenCalledWith(req.query.id);
    expect(next).toHaveBeenCalledWith(mockError);
    expect(res.status).not.toHaveBeenCalled();
    expect(res.json).not.toHaveBeenCalled();
  });
});
