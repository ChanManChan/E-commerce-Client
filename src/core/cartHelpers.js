export const addItem = (item, next) => {
  let cart = [];
  if (typeof window !== undefined) {
    if (localStorage.getItem('cart'))
      cart = JSON.parse(localStorage.getItem('cart'));
    cart.push({ ...item, count: 1 });

    /**Remove duplicates
     * build an array from new set and turn it back into array using Array.from
     * so that later we can re-map it
     * now Set will only allow unique values in it
     * so pass the id's of each object/product
     * If the loop tries to add the same value again, it'll get ignored
     * ...with the array of id's we got on when first map() was used
     * run map() on it again and return the actual product from the cart
     *  */

    cart = Array.from(new Set(cart.map((p) => p._id))).map((id) => {
      return cart.find((p) => p._id === id);
    });
    localStorage.setItem('cart', JSON.stringify(cart));
    next();
  }
};

export const itemTotal = () => {
  if (typeof window !== undefined)
    if (localStorage.getItem('cart'))
      return JSON.parse(localStorage.getItem('cart')).length;
    else return 0;
};

export const getCart = () => {
  if (typeof window !== undefined)
    if (localStorage.getItem('cart'))
      return JSON.parse(localStorage.getItem('cart'));
    else return [];
};

export const updateItem = (productId, count) => {
  let cart = [];
  if (typeof window !== undefined) {
    if (localStorage.getItem('cart'))
      cart = JSON.parse(localStorage.getItem('cart'));
    cart.map((product, index) => {
      if (product._id === productId) cart[index].count = count;
    });
    localStorage.setItem('cart', JSON.stringify(cart));
  }
};

export const removeItem = (productId) => {
  let cart = [];
  if (typeof window !== undefined) {
    if (localStorage.getItem('cart'))
      cart = JSON.parse(localStorage.getItem('cart'));
    cart.map((product, i) => {
      if (product._id === productId) cart.splice(i, 1);
    });
    localStorage.setItem('cart', JSON.stringify(cart));
  }
  return cart;
};

export const emptyCart = (next) => {
  if (typeof window !== undefined) {
    if (localStorage.getItem('cart')) localStorage.removeItem('cart');
    next();
  }
};
