const Cart = require("../models/CartModel");
const Product = require("../models/ProductModel");

const AddProductInCart = async (userId, productId, quantity) => {
  try {
    // Lấy sản phẩm từ database
    const product = await Product.findById(productId);
    if (!product) {
      throw { status: 404, message: "Product not found" };
    }

    // Kiểm tra xem số lượng sản phẩm trong kho có đủ không
    if (quantity > product.quantityInStock) {
      throw {
        status: 400,
        message: `Not enough stock for ${product.name}. Available: ${product.quantityInStock}`
      };
    }

    // Lấy giỏ hàng hiện tại của người dùng
    const existingCart = await Cart.findOne({ userId });
    const cart =
      existingCart ||
      new Cart({
        userId,
        products: []
      });

    // Tìm sản phẩm trong giỏ hàng
    const productIndex = cart.products.findIndex(
      (p) => p.productId.toString() === productId.toString()
    );

    // Nếu sản phẩm đã có trong giỏ, cập nhật số lượng
    if (productIndex > -1) {
      const newQuantity = cart.products[productIndex].quantity + quantity;

      // Kiểm tra xem số lượng mới có vượt quá số lượng trong kho không
      if (newQuantity > product.quantityInStock) {
        throw {
          status: 400,
          message: `Not enough stock for ${product.name}. Available: ${product.quantityInStock}`
        };
      }

      cart.products[productIndex].quantity = newQuantity;
    } else {
      // Nếu sản phẩm chưa có trong giỏ, thêm vào giỏ với số lượng yêu cầu
      cart.products.push({ productId, quantity });
    }

    // Tính toán lại tổng giá trị giỏ hàng
    cart.totalPrice = await cart.products.reduce(
      async (totalPromise, productItem) => {
        const total = await totalPromise;
        const productInDB = await Product.findById(productItem.productId);
        const productPrice = productInDB
          ? productInDB.promotionPrice ?? productInDB.prices
          : 0;
    
        return (
          total +
          (isNaN(productPrice) || productPrice < 0
            ? 0
            : productPrice * productItem.quantity)
        );
      },
      Promise.resolve(0)
    );

    // Lưu giỏ hàng
    await cart.save();
    const populatedCart = await Cart.findById(cart._id).populate(
      "products.productId"
    );
    return populatedCart;
  } catch (error) {
    console.error("Error in AddProductInCart service:", error);
    throw { status: 500, message: "Internal server error" };
  }
};

const UpdateProductInCart = async (userId, productId, quantity, action) => {
  try {
    console.log(`User: ${userId}, Product: ${productId}, Action: ${action}`);

    if (!action) {
      throw { status: 400, message: "Action is required (increase/decrease)" };
    }  
    // Tìm giỏ hàng của người dùng
    const cart = await Cart.findOne({ userId });
    if (!cart) {
      throw { status: 404, message: "Cart not found" };
    }

    // Tìm sản phẩm trong giỏ hàng
    const productIndex = cart.products.findIndex(
      (p) => p.productId.toString() === productId.toString()
    );

    if (productIndex === -1) {
      throw { status: 404, message: "Product not found in cart" };
    }

     // Kiểm tra sản phẩm có trong database không
     const productInDB = await Product.findById(productId);
     if (!productInDB) {
       console.log("Product not found in database");
       throw { status: 404, message: "Product not found in database" };
     }
 
     console.log("Product in DB:", productInDB);
 
     // Xử lý tăng hoặc giảm số lượng
     if (action === "increase") {
       if (cart.products[productIndex].quantity < productInDB.quantityInStock) {
         cart.products[productIndex].quantity += 1;
       } else {
         console.log("Not enough stock available");
         throw { status: 400, message: "Not enough stock available" };
       }
     } else if (action === "decrease") {
       if (cart.products[productIndex].quantity > 1) {
         cart.products[productIndex].quantity -= 1;
       } else {
         console.log("Cannot decrease quantity below 1");
         throw { status: 400, message: "Cannot decrease quantity below 1" };
       }
     } else {
       console.log("Invalid action:", action);
       throw { status: 400, message: "Invalid action" };
     }
 
     console.log("Updated quantity:", cart.products[productIndex].quantity);

    // Tính toán lại tổng giá (`totalPrice`)
    cart.totalPrice = await cart.products.reduce(
      async (totalPromise, productItem) => {
        const total = await totalPromise;
        const productInDB = await Product.findById(productItem.productId);
        const productPrice = productInDB
          ? productInDB.promotionPrice ?? productInDB.prices
          : 0;
    
        return (
          total +
          (isNaN(productPrice) || productPrice < 0
            ? 0
            : productPrice * productItem.quantity)
        );
      },
      Promise.resolve(0)
    );

    // Lưu giỏ hàng
    await cart.save();

    // Populate thông tin sản phẩm và trả về
     console.log('Calculating total price...');
    const populatedCart = await Cart.findById(cart._id).populate(
      "products.productId"
    );

    return populatedCart;
  } catch (error) {
    console.error("Error in DecreaseProductQuantity service:", error);
    throw { status: 500, message: "Internal server error" };
  }
};

const getCartByUserId = async (userId) => {
  try {
    const cart = await Cart.findOne({ userId }).populate(
      "products.productId",
      "name prices image company quantityInStock promotionPrice discount"
    );
    if (!cart) {
      console.log("Không tìm thấy giỏ hàng");
    }
    return cart;
  } catch (error) {
    console.error(error);
    throw error;
  }
};

const removeProductFromCart = async (userId, productId) => {
  return new Promise(async (resolve, reject) => {
    try {
      const cart = await Cart.findOne({ userId }).populate(
        "products.productId",
        "name prices"
      );
      if (!cart) {
        return resolve({
          status: "ERR",
          message: "Cart not found"
        });
      }

      const productExists = cart.products.some(
        (p) => p.productId._id.toString() === productId
      );
      if (!productExists) {
        return resolve({
          status: "ERR",
          message: "Product not found in cart"
        });
      }

      cart.products = cart.products.filter(
        (p) => p.productId._id.toString() !== productId
      );

      cart.totalPrice = cart.products.reduce((total, product) => {
        const productPrice = (product.productId.promotionPrice ?? product.productId.prices) || 0;
        return total + productPrice * product.quantity;
      }, 0);

      await cart.save();
      resolve({
        status: "OK",
        message: "Product removed from cart",
        data: cart
      });
    } catch (e) {
      console.error("Error removing product from cart:", e);
      reject({
        status: "ERR",
        message: "Error removing product from cart",
        error: e.message
      });
    }
  });
};

const deleteCart = async (userId) => {
  try {
    const cart = await Cart.findOneAndDelete({ userId }).populate(
      "products.productId",
      "name prices"
    );
    if (!cart) {
      throw new Error("Không tìm thấy giỏ hàng để xóa");
    }
    return { message: "Giỏ hàng đã được xóa thành công" };
  } catch (error) {
    console.error(error);
    throw error;
  }
};

module.exports = {
  AddProductInCart,
  UpdateProductInCart,
  getCartByUserId,
  removeProductFromCart,
  deleteCart
};