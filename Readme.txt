 
///////////////////////////////////
// Catalog  ///////////////////////
///////////////////////////////////

 // Создание категории 
 mutation CreateCategory {
    createCategory(input: {
      name: "Frutes",
      products:
      {
      name: "${createProductInput.name}",
      description: "${createProductInput.description}",
      price: 23.34,
      category_id: 37,
      image: "urlsdfkojo odsi",
      created_at: "2023-10-04T19:50:01.957Z",
      updated_at: "2023-10-04T19:50:01.957Z",
      available_quantity: 2,
      }
  },) {
    category_id
    category_name
    products {
      name
      description
      price
      image
      created_at
      updated_at
      available_quantity
    }
  }
}

// Удаление категории
mutation DeleteCategory {
  deleteCategory(DeleteCategoryInput: { category_id: 40}) {
    category_name
    category_id
  }
}

query GetCategory {
  getCategory(id: 2) {
    category_id
    category_name
    products {
      price
      name
    }
  }
}




///////////////////////////////////
// Product  ///////////////////////
///////////////////////////////////

// создание продукта
 mutation CreateProduct {
            createProduct(CreateProductInput: {
              name: "${createProductInput.name}",
              description: "${createProductInput.description}",
              price: 23.34,
              category_id: 37,
              image: "urlsdfkojo odsi",
              created_at: "2023-10-04T19:50:01.957Z",
              updated_at: "2023-10-04T19:50:01.957Z",
              available_quantity: 2,
            },) {
              id
              name
              description
              price
              category {
                category_name
                category_id
              }
              image
              created_at
              updated_at
              available_quantity
            }
}

// Получение всех продуктов 
query GetProducts {
  getProducts {
    id
    name
    description
    price
    category {
      category_name
      category_id
    }
    image
    created_at
    updated_at
    available_quantity
  }
}

// Получение продукта по имени
query GetProduct {
  getProduct( name: "ksвыаrgвпыыыd test ssssss") {
    id
    name
    description
    price
    category {
      category_name
      category_id
    }
    image
    created_at
    updated_at
    available_quantity
  }
}

// Обновление продукта
 mutation UpdateProduct {
    updateProduct(updateProductInput: {
      id: 42,
      name: "${createProductInput.name}",
      description: "${createProductInput.description}",
      price: 23.34,
      category_id: 37,
      image: "urlsdfkojo odsi",
      created_at: "2023-10-04T19:50:01.957Z",
      updated_at: "2023-10-04T19:50:01.957Z",
      available_quantity: 7,
    },) {
      id
      name
      description
      price
      category {
        category_name
        category_id
      }
      image
      created_at
      updated_at
      available_quantity
    }
}

// Удаление продукта
mutation DeleteProduct {
  deleteProduct(DeleteProductInput: { id: 42}) {
    id
    name
    description
    price
    category {
      category_name
      category_id
    }
    image
    created_at
    updated_at
    available_quantity
  }
}


///////////////////////////////////
// Account  ///////////////////////
///////////////////////////////////
mutation Register{
  register(createUserInput: 
    {
      email: "mir2002@gmail.com", 
      displayName: "Mihail",
      password: "Trmiha2002" },) {
    email
    displayName,
    passwordHash
  }
}

mutation Login{
  login(loginUserInput: 
    {
      email: "mihatr2002@gmail.com", 
      password: "Trmiha2002" },) {
    user {
      email
      displayName
       passwordHash
    }
    access_token
  }
}

query GetUsers {
  user {
    user_id
    displayName
    passwordHash 
  }
}


/// CartItem

mutation createCartItem {
  createCartItem(createCartItemInput: {
    cart_id: 5,
    product_id: 1,
    quantity: 3,
  }) {
    cartItem_id
    subtotal
    cartItem_quantity
    cartProduct {
      id
      name
      price
      description
      image
      created_at
      updated_at
      available_quantity 
    }
  }
}


"@apollo/federation": "^0.38.1",
    "@apollo/gateway": "^2.2.3",
    "@apollo/server": "^4.9.5",
    "@apollo/subgraph": "^2.2.3",
    "@nestjs/apollo": "^12.0.9",