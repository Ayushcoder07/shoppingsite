document.addEventListener('DOMContentLoaded', () => {
    const listProductHTML = document.querySelector('.listProduct');
    const listCartHTML = document.querySelector('.listCart');
    const iconCart = document.querySelector('.icon-cart');
    const iconCartSpan = document.querySelector('.icon-cart span');
    const body = document.querySelector('body');
    const closeCart = document.querySelector('.close');
    let products = [];
    let cart = [];
  
    iconCart.addEventListener('click', () => {
      body.classList.toggle('showCart');
    });
  
    closeCart.addEventListener('click', () => {
      body.classList.toggle('showCart');
    });
  
    const addDataToHTML = () => {
      // Remove default data from HTML
      listProductHTML.innerHTML = '';
  
      // Add new data
      if (products.length > 0) {
        products.forEach(product => {
          let newProduct = document.createElement('div');
          newProduct.dataset.id = product.id;
          newProduct.classList.add('item');
          newProduct.innerHTML =
            `<img src="${product.image}" alt="">
            <h2>${product.name}</h2>
            <div class="price">$${product.price}</div>
            <button class="addCart">Add To Cart</button>`;
          listProductHTML.appendChild(newProduct);
        });
      }
    };
    
    
  
    listProductHTML.addEventListener('click', (event) => {
      let positionClick = event.target;
      if (positionClick.classList.contains('addCart')) {
        let id_product = positionClick.parentElement.dataset.id;
        addToCart(id_product);
      }
    });
  
    const addToCart = (product_id) => {
      let positionThisProductInCart = cart.findIndex((value) => value.product_id == product_id);
      
      if (cart.length <= 0) {
        cart = [{
          product_id: product_id,
          quantity: 1
        }];
      } else if (positionThisProductInCart < 0) {
        cart.push({
          product_id: product_id,
          quantity: 1
        });
      } else {
        cart[positionThisProductInCart].quantity = cart[positionThisProductInCart].quantity + 1;
      }
  
      addCartToHTML();
      addCartToMemory();
    };
  
    const addCartToMemory = () => {
      localStorage.setItem('cart', JSON.stringify(cart));
    };
    const updateTotalPrice = () => {
        let totalPrice = 0;

        if (cart.length > 0) {
            cart.forEach(item => {
                let positionProduct = products.findIndex(value => value.id == item.product_id);
                let info = products[positionProduct];
                totalPrice += info.price * item.quantity;
            });
        }

        // Update the total price display in the HTML
        document.getElementById('totalPrice').innerText = `$${totalPrice.toFixed(2)}`;
    };

    // const addCartToHTML = () => {
    //   listCartHTML.innerHTML = '';
    //   let totalQuantity = 0;
  
    //   if (cart.length > 0) {
    //     cart.forEach(item => {
    //       totalQuantity = totalQuantity + item.quantity;
    //       let newItem = document.createElement('div');
    //       newItem.classList.add('item');
    //       newItem.dataset.id = item.product_id;
  
    //       let positionProduct = products.findIndex((value) => value.id == item.product_id);
    //       let info = products[positionProduct];
    //       listCartHTML.appendChild(newItem);
    //       newItem.innerHTML = `
    //         <div class="image">
    //           <img src="${info.image}">
    //         </div>
    //         <div class="name">
    //           ${info.name}
    //         </div>
    //         <div class="totalPrice">$${info.price * item.quantity}</div>
    //         <div class="quantity">
    //           <span class="minus"><</span>
    //           <span>${item.quantity}</span>
    //           <span class="plus">></span>
    //         </div>
    //       `;
    //     });
    //   }
    //   iconCartSpan.innerText = totalQuantity;
    // };
    const addCartToHTML = () => {
        listCartHTML.innerHTML = '';
        let totalQuantity = 0;

        if (cart.length > 0) {
            cart.forEach(item => {
                totalQuantity += item.quantity;
                let newItem = document.createElement('div');
                newItem.classList.add('item');
                newItem.dataset.id = item.product_id;

                let positionProduct = products.findIndex(value => value.id == item.product_id);
                let info = products[positionProduct];
                listCartHTML.appendChild(newItem);
                newItem.innerHTML = `
                    <div class="image">
                        <img src="${info.image}">
                    </div>
                    <div class="name">
                        ${info.name}
                    </div>
                    <div class="totalPrice">$${info.price * item.quantity}</div>
                    <div class="quantity">
                        <span class="minus"><</span>
                        <span>${item.quantity}</span>
                        <span class="plus">></span>
                    </div>
                `;
            });
        }

        // Update the total price display
        updateTotalPrice();

        iconCartSpan.innerText = totalQuantity;
    };
    window.checkout = () => {
        // Add your logic here for the buy option, e.g., redirecting to a payment page
        // For demonstration purposes, just display an alert
        alert(`Thank you for shopping! Total amount: ${document.getElementById('totalPrice').innerText}`);
    };
  
    listCartHTML.addEventListener('click', (event) => {
      let positionClick = event.target;
      if (positionClick.classList.contains('minus') || positionClick.classList.contains('plus')) {
        let product_id = positionClick.parentElement.parentElement.dataset.id;
        let type = 'minus';
        if (positionClick.classList.contains('plus')) {
          type = 'plus';
        }
        changeQuantityCart(product_id, type);
      }
    });
  
    const changeQuantityCart = (product_id, type) => {
      let positionItemInCart = cart.findIndex((value) => value.product_id == product_id);
      
      if (positionItemInCart >= 0) {
        let info = cart[positionItemInCart];
  
        switch (type) {
          case 'plus':
            cart[positionItemInCart].quantity = cart[positionItemInCart].quantity + 1;
            break;
        
          default:
            let changeQuantity = cart[positionItemInCart].quantity - 1;
            if (changeQuantity > 0) {
              cart[positionItemInCart].quantity = changeQuantity;
            } else {
              cart.splice(positionItemInCart, 1);
            }
            break;
        }
      }
      addCartToHTML();
      addCartToMemory();
    };
  
    // Function to fetch product data from JSON file
    function fetchProducts() {
      fetch('products.json')
        .then(response => response.json())
        .then(data => {
          products = data;
          addDataToHTML();
        });
    }
  
    fetchProducts();
  });
  
  function startSpeechRecognition() {
    // Check if the browser supports speech recognition
    if ('webkitSpeechRecognition' in window) {
      const recognition = new webkitSpeechRecognition();
  
      // Configure speech recognition options
      recognition.continuous = false;
      recognition.interimResults = false;
      recognition.lang = 'en-US';
  
      // Start speech recognition
      recognition.start();
  
      // Event fired when speech recognition results are available
      recognition.onresult = function(event) {
        const transcript = event.results[0][0].transcript;
        document.getElementById('searchbar').value = transcript;
  
        // Perform search or other actions with the transcript
        search_pd();
      };
  
      // Event fired when speech recognition is ended
      recognition.onend = function() {
        console.log('Speech recognition ended');
      };
  
      // Event fired when speech recognition encounters an error
      recognition.onerror = function(event) {
        console.error('Speech recognition error', event.error);
      };
    } else {
      console.log('Speech recognition is not supported in this browser.');
    }
  }
  
  // Function to display products based on search results
  function displaySearchResults(results) {
    const listProductHTML = document.querySelector('.listProduct');
    listProductHTML.innerHTML = ''; // Clear previous results
  
    results.forEach(result => {
      let newProduct = document.createElement('div');
      newProduct.dataset.id = result.id;
      newProduct.classList.add('item');
      newProduct.innerHTML =
        `<img src="${result.image}" alt="">
        <h2>${result.name}</h2>
        <div class="price">$${result.price}</div>
        <button class="addCart">Add To Cart</button>`;
      listProductHTML.appendChild(newProduct);
    });
  }
  
  // Function to filter products based on search
  function searchProducts(products, searchTerm) {
    return products.filter(product => 
      product.name.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }
  
  // Function to handle search input changes
  function attachSearchListener(products) {
    const searchBar = document.getElementById('searchbar');
    const listProductHTML = document.querySelector('.listProduct');
  
    searchBar.addEventListener('keyup', () => {
      const searchTerm = searchBar.value.trim();
      const filteredProducts = searchProducts(products, searchTerm);
      displaySearchResults(filteredProducts);
    });
  
    listProductHTML.addEventListener('click', (event) => {
      let positionClick = event.target;
      if (positionClick.classList.contains('addCart')) {
        let id_product = positionClick.parentElement.dataset.id;
        addToCart(id_product);
      }
    });
  }
  
  // Fetch product data and set up search functionality
  function fetchProductsAndSetUpSearch() {
    fetch('products.json')
      .then(response => response.json())
      .then(products => {
        attachSearchListener(products);
      });
  }
  
  fetchProductsAndSetUpSearch();
  
