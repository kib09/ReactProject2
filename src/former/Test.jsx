import {
  createContext,
  lazy,
  Suspense,
  useContext,
  useEffect,
  useState,
} from "react";
import {
  createBrowserRouter,
  Form,
  Link,
  Navigate,
  NavLink,
  Outlet,
  redirect,
  RouterProvider,
  useActionData,
  useLoaderData,
  useLocation,
  useNavigate,
  useParams,
  useRouteError,
  useSearchParams,
} from "react-router-dom";
import styled from "styled-components";
//import auth from './해당경로'
// 인증 컨텍스트 사용을 위한 커스텀 훅
function useAuth() {
  return useContext(AuthContext);
}
const AuthContext = createContext(null);
function useCart() {
  return useContext(CartContext);
}
const CartContext = createContext(null);

function CartProvider({ children }) {
  const { user } = useAuth();
  const [cart, setCart] = useState([]);
  const [total, setTotal] = useState(0);

  useEffect(() => {
    if (user) {
      const userCart = localStorage.getItem(`cart_${user.email}`);
      if (userCart) {
        const plusCart = JSON.parse(userCart);
        setCart(plusCart);
        calculateTotal(plusCart);
      }
    } else {
      setCart([]);
      setTotal(0);
    }
  }, [user]);

  // 장바구니 총액 계산 함수
  const calculateTotal = (cartItems) => {
    // 배열의 요소를 하나로 줄이는 작업을 진행하는 함수
    const newTotal = cartItems.reduce(
      (sum, item) => sum + item.price * item.quantity,
      0
    );
    setTotal(newTotal);
  };

  // 장바구니 저장 함수
  const saveCart = (newCart) => {
    const cartKey = user ? `cart_${user.email}` : "cart_guest";
    localStorage.setItem(cartKey, JSON.stringify(newCart));
    calculateTotal(newCart);
  };

  // 상품 추가 함수

  const addToCart = (product) => {
    const existingItem = cart.find((item) => item.id === product.id);
    let newCart;
    if (existingItem) {
      // 이미 있는 상품이라면 수량 증가
      // 3항연산자를 통해 수량증가냐 혹은 item(cart에 들어갈 상품) 자체를 집어넣느냐
      newCart = cart.map((item) =>
        item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item
      );
    } else {
      newCart = [...cart, { ...product, quantity: 1 }];
    }
    setCart(newCart);
    saveCart(newCart);
  };

  // 상품 제거 함수

  // 장바구니 비우기

  // 수량변경
  const updateQuantity = (productId, quantity) => {
    if (quantity <= 0) return removeFromCart(productId);

    const newCart = cart.map((item) =>
      item.id === productId ? { ...item, quantity } : item
    );

    setCart(newCart);
    saveCart(newCart);
  };

  const removeFromCart = (productId) => {
    const newCart = cart.filter((item) => item.id !== productId);
    setCart(newCart);
    saveCart(newCart);
  };

  const clearCart = () => {
    setCart([]);
    setTotal(0);
    const cartKey = user ? `cart_${user.email}` : "cart_guest";
    localStorage.removeItem(cartKey);
  };

  return (
    <CartContext.Provider
      value={{
        cart,
        total,
        addToCart,
        updateQuantity,
        removeFromCart,
        clearCart,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

//로그인 기능
// 전역에서 로그인 상태 관리.
//  -> 로컬스토리지와 동기화 되어 새로고침을 해도 로그인 상태는 유지.
function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  // 컴포넌트 마운트 시 로컬스토리지에서 사용자 정보 불러오기
  useEffect(() => {
    try {
      const storedUser = localStorage.getItem("user");
      console.log("Stored user:", storedUser);
      if (storedUser) {
        const parsedUser = JSON.parse(storedUser);
        console.log("Parsed user:", parsedUser);
        setUser(parsedUser);
      }
    } catch (error) {
      console.error("Error loading user from localStorage:", error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const login = (userData) => {
    // 로그인 기능은 서버에 사용자가 입력한 or 보낸 정보들을 기반으로
    // 서버 내에서 인증 절차를 거쳐 적합한 유저인지 아닌지를 구분
    // 적합하면 로그인 허용 아니면 불허.
    console.log("Login called with:", userData);
    localStorage.setItem("user", JSON.stringify(userData));
    setUser("user", JSON.stringify(userData));
  };
  // 로그아웃은 현 상황에서는 back단이 없는 관계로
  // 저장된 로컬스토리지의 정보를 지우는 식으로만 구현.
  const logout = () => {
    localStorage.removeItem("user");
    setUser(null);
  };
  const val = { user, login, logout, isLoading };
  console.log("AuthContext stats : ", val);

  return (
    <AuthContext.Provider value={{ user, login, logout, isLoading }}>
      {children}
    </AuthContext.Provider>
  );
}

// 라우터 코드 만들기전에
// 조원 전체가 공유할수있도록 주소에 대한 규칙을 미리 선정하고
// 그대로 처리할수 있도록 진행하는것을 권장.
// 주소명 미리 정해놓고 필요하면 1명이 필요한 주소 추가하고 관리.

// 전역으로 로그인 상태를 redux, zustand, recoil로 관리해도
// 로그인 상태를 기억하고 있으려면 local storage나 jwt 토큰 인증이면
// session storage에 저장하고 있어야 하는게 맞나요?
//  -> 쿠키를 활용하는 방법도있습니다.

// 퀴즈
// 1. 상품의 상세정보를 확인할수 있는 컴포넌트 ProductDetail을 만들어주세요
//  -> 주소 : /products/id값(products/:id)
//  -> detail 페이지에서는 title. description, price의 정보를 확인.
//  -> useLoaderData, useParams훅을 통해 구현.
const Container = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 20px;
`;

const Heading = styled.h1`
  color: #2c3e50;
  font-size: 2.5rem;
  margin-bottom: 30px;
  text-align: center;
`;

const StyledNav = styled.nav`
  background: #3498db;
  padding: 20px;
  display: flex;
  gap: 20px;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);

  a {
    color: white;
    text-decoration: none;
    padding: 10px;
    border-radius: 4px;
    transition: all 0.3s;

    &:hover {
      background: #2980b9;
    }

    &.active {
      background: #2c3e50;
    }
  }

  button {
    background: none;
    border: none;
    color: white;
    cursor: pointer;
    padding: 10px;
  }
`;

const MainContent = styled.main`
  min-height: 70vh;
  padding: 30px 0;
`;

const Footer = styled.footer`
  background: #34495e;
  color: white;
  padding: 20px;
  text-align: center;
  margin-top: 50px;
`;

const ProductGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
  gap: 30px;
  padding: 20px;
`;

const ProductCard = styled.div`
  background: white;
  border-radius: 10px;
  padding: 20px;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
  transition: transform 0.3s;

  &:hover {
    transform: translateY(-5px);
  }

  h3 {
    color: #2c3e50;
    margin-bottom: 10px;
  }

  p {
    color: #3498db;
    font-weight: bold;
  }
  img {
    max-width: 100%;
    height: auto;
    border-radius: 8px;
    margin-bottom: 20px;
  }
`;

const ProductDetailContainer = styled.div`
  background: white;
  padding: 30px;
  border-radius: 10px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  max-width: 800px;
  margin: 0 auto;
`;

const PriceTag = styled.div`
  font-size: 1.5rem;
  color: #27ae60;
  font-weight: bold;
  margin: 20px 0;
`;
// 4. 폼 스타일
// 폼에다가 스타일컴포넌트 적용시에는
// 기존 React-router의 Form 컴포넌트 기능을 쓸수 없다는 문제점이 발생.
//  커스텀으로 폼을 스타일링할때는 Form 컴포넌트 자체를 파라미터로 받아온후
//  스타일링을 해야 정상적인 동작이 수행되도록 처리할수 있음.
const StyledForm = styled(Form)`
  max-width: 500px;
  margin: 0 auto;
  display: flex;
  flex-direction: column;
  gap: 15px;

  input,
  textarea {
    padding: 12px;
    border: 1px solid #bdc3c7;
    border-radius: 4px;
    font-size: 1rem;

    &:focus {
      outline: none;
      border-color: #3498db;
      box-shadow: 0 0 0 3px rgba(52, 152, 219, 0.1);
    }
  }

  button {
    background: #3498db;
    color: white;
    padding: 15px;
    border: none;
    border-radius: 4px;
    cursor: pointer;
    transition: background 0.3s;

    &:hover {
      background: #2980b9;
    }
  }
`;

// const SuccessMessage = styled.div`
//   background: #2ecc71;
//   color: white;
//   padding: 15px;
//   border-radius: 4px;
//   margin-top: 20px;
// `

// 5. 에러 페이지 스타일
const ErrorContainer = styled.div`
  text-align: center;
  padding: 50px 20px;
  background: #e74c3c;
  color: white;
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  justify-content: center;

  h1 {
    font-size: 3rem;
    margin-bottom: 20px;
  }
`;

const NotFoundContainer = styled(ErrorContainer)`
  background: #34495e;
`;
// 힌트 : 한번에 구현하려 하지말고 우선 productDetail로의 접근 방법만 정의해두세요.
const router = createBrowserRouter([
  {
    path: "/",
    element: <Layout />,
    errorElement: <ErrorPage />,
    children: [
      {
        index: true, // 기본경로에 랜더링될 컴포넌트 설정.
        element: <Home />,
      },
      {
        // contact 만든것 처럼
        // 로그인 페이지를 구현해주세요.
        // 기능은 로그인페이지에서 사용자 id, pw 입력했을때
        // action의 params에 해당 내용 담기게만.
        path: "login",
        element: <Login />,
        action: async ({ request }) => {
          const formData = await request.formData();
          const email = formData.get("email");
          const password = formData.get("password");

          // 인증절차 확인 코드
          if (email === "gunchim@ssak.com" && password === "9724") {
            localStorage.setItem(
              "user",
              JSON.stringify({ email, name: "gunchim" })
            );
          }
          // 정석적인 인증절차 코드
          // 1. 사용자가 id와 비밀번호를 입력
          // 2. 사용자가 입력한 id와 비밀번호를 우선 유효성 검사를 진행
          //    -> form에서 입력 제대로 했는가를 check
          // 3. 검사결과 문제가 없으면 사용자가 입력한 정보를 서버단으로 전송
          // 4. 처리는 서버단에서 db의 저장된 사용자 정보와 일치하는지를 확인.
          //    (인증 토큰 발급으로 처리.)
          // 5. 일치하면 t / 틀리면 f를 리턴
          // 6. 쿠키 저장 및 세션 연결.

          const redirectTo =
            new URL(request.url).searchParams.get("redirectTo") || "/";
          return redirect(redirectTo);
        },
      },
      {
        path: "products",
        element: <Products />,
        loader: async () => {
          const res = await fetch("https://dummyjson.com/products");
          return res.json();
        },
      },
      {
        path: "products/:id",
        element: <ProductDetail />,
        loader: async ({ params }) => {
          console.log(params);
          const res = await fetch(
            `https://dummyjson.com/products/${params.id}`
          );
          return res.json();
        },
      },
      {
        path: "contact",
        element: <Contact />,
        action: async ({ request }) => {
          const formData = await request.formData();
          const formValues = Object.fromEntries(formData);
          sessionStorage.setItem("FormData1", JSON.stringify(formValues));
          return redirect("/");
        },
      },
      {
        path: "dashboard",
        element: (
          <RequireAuth>
            <DashBoard />
          </RequireAuth>
        ),
      },
      {
        path: "cart",
        element: <Cart />,
      },
      {
        path: "checkout",
        element: (
          <RequireAuth>
            <Checkout />
          </RequireAuth>
        ),
        action: async ({ request }) => {
          const formData = await request.formData();
          //실질적으로는 여기서 결제 서버 API 호출이 처리.

          //주문은 됐다 가정하고 장바구니 초기화
          localStorage.removeItem(
            `cart_${JSON.parse(localStorage.getItem("user")).email}`
          );
          return redirect("/order-success");
        },
      },
      {
        path: "order-success",
        element: <OrderSuccess />,
      },
      //   {
      //     path: 'about',
      //     element: (
      //       <Suspense fallback={<div>Loading...</div>}>
      //         <LazyAbout />
      //       </Suspense>
      //     )
      //   },
      {
        path: "*",
        element: <NotFound />,
      },
    ],
  },
]);

// 이 컴포넌트는 로그인한 유저들만 볼수 있도록
// 기본 설정들을 정하는 컴포넌트.
function RequireAuth({ children }) {
  const { user } = useAuth();
  const location = useLocation();

  if (!user) {
    // 로그인 페이지로 리다이렉트하면서 원래 가려던 위치 저장
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return children;
}

function DashBoard() {
  return <h1>dashboard</h1>;
}

function Home() {
  return <h1>일단 잘 오셨소잉</h1>;
}

function Login() {
  const actionData = useActionData();
  const location = useLocation();
  // 만약 사용자가 이미 로그인을 했다면
  // 폼을 보여줄 이유는 없음.
  // 전역으로 로그인 상태를 기억하는 무언가가 필요.
  const { user } = useAuth(); // contextAPI에 등록되어있는 전역 상태값
  //  -> redux, zustand, recoil등으로 관리해도됨.
  const navigate = useNavigate();

  // 페이지에 들어가자마자 실행하는 메서드를 만들고싶어서 useEffect를 썼음
  //  -> 로그인 검증이 필요하니깐!
  useEffect(() => {
    if (user) {
      alert(
        "이미 로그인 하셨습니다. 다른계정으로 접속하려면 로그아웃후 진행하세요"
      );
      const from = location.state?.from?.pathname || "/";
      navigate(from, { replace: true });
    }
  }, [user, navigate, location]);

  // 이전 페이지 정보 저장.
  const from = location.state?.from?.pathname || "/";

  return (
    <div className="login-form">
      <h1>login</h1>
      <Form method="post" action={`/login?redirectTo=${from}`}>
        <input name="email" type="email" placeholder="email" />
        <input name="password" type="password" placeholder="pw" />
        <button type="submit">로그인하기</button>
      </Form>
      {actionData?.success && (
        <div className="success-message">Message sent successfully!</div>
      )}
    </div>
  );
}

function Contact() {
  const actionData = useActionData();

  return (
    <Container>
      <Heading>Contact Us</Heading>
      <StyledForm method="post">
        <input name="name" placeholder="Name" required />
        <input name="email" type="email" placeholder="Email" required />
        <textarea name="message" placeholder="Message" rows="5" />
        <button type="submit">Send</button>
      </StyledForm>
      {actionData?.success && (
        <div className="success-message">Message sent successfully!</div>
      )}
    </Container>
  );
}

function ProductDetail() {
  const product = useLoaderData();
  const { id } = useParams();
  const { addToCart } = useCart();
  const navigate = useNavigate();
  // 카트에 물건을 담기위해서는 기본적으로 해당 정보 자체를 넘길수 있어야함.
  // 카트에 물건이 추가되도록 처리하는 addToCart 함수를 동작.
  // useParams

  const handleAddToCart = () => {
    addToCart(product);
    alert(`{product.title} 상품을 카트에 담았습니다.`);
  };

  return (
    <Container>
      <ProductDetailContainer>
        <input type="hidden" name="" value=""></input>
        <Heading>
          {product.title} (ID : {id})
        </Heading>
        <img src={product.thumbnail} alt={product.title} />
        <p>{product.description}</p>
        <PriceTag>${product.price}</PriceTag>

        <div className="product-actions">
          <button onClick={handleAddToCart}>카트에 담기</button>
          <button onClick={() => navigate("/cart")}>장바구니 보기</button>
        </div>
      </ProductDetailContainer>
    </Container>
  );
}

function Products() {
  const { products } = useLoaderData();

  return (
    <Container>
      <Heading>Products</Heading>
      <ProductGrid>
        {products.map((product) => (
          <Link key={product.id} to={`/products/${product.id}`}>
            <ProductCard>
              <img src={product.images} />
              <h3>{product.title}</h3>
              <p>${product.price}</p>
            </ProductCard>
          </Link>
        ))}
      </ProductGrid>
    </Container>
  );
}

function ErrorPage() {
  const error = useRouteError();

  return (
    <ErrorContainer>
      <h1>에러 싫다 ㅠㅠ</h1>
      <p>
        {error.status} - {error.statusText || error.message}
      </p>
    </ErrorContainer>
  );
}

// const LazyAbout = lazy(() => import('./About'))

// 12. 404 페이지
function NotFound() {
  return (
    <NotFoundContainer>
      <h2>404 - Page Not Found</h2>
      <p>The page you're looking for doesn't exist.</p>
    </NotFoundContainer>
  );
}

// 스타일 컴포넌트를 이용해서 이 컴포넌트의 디자인을 해볼것!
function Cart() {
  const { cart, total, updateQuantity, removeFromCart } = useCart();
  const navigate = useNavigate();
  const { user } = useAuth();

  return (
    <div className="cart-page">
      <h2>Your Shopping Cart</h2>

      {cart.length === 0 ? (
        <div className="empty-cart">
          <p>Your cart is empty.</p>
          <button onClick={() => navigate("/products")}>
            Continue Shopping
          </button>
        </div>
      ) : (
        <>
          <div className="cart-items">
            {cart.map((item) => (
              <div key={item.id} className="cart-item">
                <img
                  src={item.thumbnail}
                  alt={item.title}
                  className="item-image"
                />
                <div className="item-details">
                  <h3>{item.title}</h3>
                  <p>${item.price}</p>

                  <div className="quantity-controls">
                    <button
                      onClick={() => updateQuantity(item.id, item.quantity - 1)}
                    >
                      -
                    </button>
                    <span>{item.quantity}</span>
                    <button
                      onClick={() => updateQuantity(item.id, item.quantity + 1)}
                    >
                      +
                    </button>
                  </div>

                  <p className="item-total">
                    Subtotal: ${(item.price * item.quantity).toFixed(2)}
                  </p>

                  <button
                    className="remove-button"
                    onClick={() => removeFromCart(item.id)}
                  >
                    Remove
                  </button>
                </div>
              </div>
            ))}
          </div>

          <div className="cart-summary">
            <h3>Order Summary</h3>
            <p>
              Total Items: {cart.reduce((sum, item) => sum + item.quantity, 0)}
            </p>
            <p className="cart-total">Total: ${total.toFixed(2)}</p>

            {user ? (
              <button
                className="checkout-button"
                onClick={() => navigate("/checkout")}
              >
                Proceed to Checkout
              </button>
            ) : (
              <button
                className="login-to-checkout"
                onClick={() =>
                  navigate("/login", {
                    state: { from: { pathname: "/checkout" } },
                  })
                }
              >
                Login to Checkout
              </button>
            )}
          </div>
        </>
      )}
    </div>
  );
}
// 결제하기
function Checkout() {
  const { cart, total, clearCart } = useCart();

  if (cart.length === 0) {
    return <Navigate to="/cart" />;
  }

  return (
    <div className="checkout-page">
      <h2>Checkout</h2>

      <div className="checkout-summary">
        <h3>주문내역</h3>
        <p>items: {cart.length}</p>
        <p>Total : ${total.toFixed(2)}</p>
      </div>
      <Form method="post" className="checkout-form">
        <h3>Shipping Information</h3>
        <input name="name" placeholder="Full Name" required />
        <input name="address" placeholder="Address" required />
        <input name="city" placeholder="City" required />
        <input name="zip" placeholder="ZIP Code" required />

        <h3>Payment Information</h3>
        <input name="cardNumber" placeholder="Card Number" required />
        <div className="card-details">
          <input name="expiry" placeholder="MM/YY" required />
          <input name="cvv" placeholder="CVV" required />
        </div>

        <button type="submit">Complete Order</button>
      </Form>
    </div>
  );
}

function OrderSuccess() {
  return (
    <div className="order-success">
      <h2>주문이 완료됐습니다.</h2>
      <p>구매 감사감사</p>
      <Link to="/products">쇼핑 계속하기</Link>
    </div>
  );
}

function Layout() {
  const navigate = useNavigate();
  const location = useLocation();
  const [searchParams] = useSearchParams();
  const { user, logout } = useAuth();
  const { cart } = useCart();
  const cartItemCount = cart.reduce((sum, item) => sum + item.quantity, 0);

  console.log("현재 유저 상태 : ", user);

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  return (
    <Container>
      <div className="app">
        {/* 3. 네비게이션 바 */}
        <StyledNav>
          <NavLink
            to="/"
            className={({ isActive }) => (isActive ? "active" : "")}
            end
          >
            Home
          </NavLink>

          <NavLink
            to="/products"
            style={({ isActive }) => ({
              color: isActive ? "red" : "blue",
            })}
          >
            Products
          </NavLink>

          <Link to="/contact">Contact</Link>

          <div>
            User state: {user ? `Logged in as ${user.name}` : "Not logged in"}
          </div>
          {user ? (
            <>
              <Link to="/dashboard">DashBoard</Link>
              <button onClick={handleLogout}>Logout({user.name})</button>
            </>
          ) : (
            <Link to="/login">Login</Link>
          )}

          <button onClick={() => navigate("/about")}>
            About (Programmatic)
          </button>

          {/* 4. 검색 기능 */}
          <input
            placeholder="Search..."
            onChange={(e) => navigate(`?query=${e.target.value}`)}
            value={searchParams.get("query") || ""}
          />

          <Link to="/cart" className="cart-icon">
            Cart
            {cartItemCount > 0 && (
              <span className="cart-badge">{cartItemCount}</span>
            )}
          </Link>
        </StyledNav>

        <MainContent>
          {/*   5. 하위 라우트 표시 위치 */}
          <Outlet />
        </MainContent>

        {/* 6. 현재 위치 표시 */}
        <Footer>Current path: {location.pathname}</Footer>
      </div>
    </Container>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <CartProvider>
        <RouterProvider router={router} />
      </CartProvider>
    </AuthProvider>
  );
}
