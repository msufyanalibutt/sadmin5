import Pages from "../layouts/Pages.jsx";
import Dashboard from "../layouts/Dashboard.jsx";
import Homepage from "../views/UserPages/index";
import appleLogin from "../views/UserPages/Dashboard/appleLogin";
import MobileViewResponse from "../views/UserPages/Dashboard/MobileViewResponse"; 
// import NotFound from "../views/UserPages/Dashboard/NotFound";
// import ChatWindow from "../views/UserPages/Chat/ChatWindow.jsx"
const { REACT_APP_ADMIN_PATH } = process.env;


var indexRoutes = [
  //Admin pages
  { path: `${REACT_APP_ADMIN_PATH }/login`, name: "Pages", component: Pages, AccessType: 'Admin'},
  // { path: "/pages", name: "Landing_Page", component: Pages, AccessType: 'Admin'},
  { path: `${REACT_APP_ADMIN_PATH }`, name: "Home", component: Dashboard, AccessType: 'Admin' },
  { path: "/reset-password", name: "Password_Reset", component: Pages, AccessType: 'Admin' },
  //User pages
  { path: "/", name: "AppDashboard", component: Homepage, AccessType: 'User', exact: true},
  { path: "/web/appleLogin/:id",  name:"Apple Login component", component: appleLogin, AccessType:"User"},
  {
    path: "/api/payment/success",  name:"mobile response component", component: MobileViewResponse, AccessType:"User"
  },
  { path: "/products/:id", name: "ProductDetails", component: Pages, AccessType: 'User' },
  { path: "/EditProfile/:id", name: "EditProfile", component: Pages, AccessType: 'User' },
  { path: "/OrderView/:id", name: "OrderView", component: Pages, AccessType: 'User' },
  { path: "/SellerDetails/:userId", name: "SellerDetails", component: Pages, AccessType: 'User' },
  { path: "/chat/conversation", name: "chat", component: Pages, AccessType: 'User' },
  { path: "/api/payment",  name:"payment", component: Pages, AccessType: 'User' },
   // { path: "/SafetyTips/tips", name: "fb", component: Pages,  AccessType: 'User' },
  { path: "/Info/contact", name: "fb", component: Pages,  AccessType: 'User' },
  { path: "/pages/:url", name: "AppDashboard", component: Pages, AccessType: 'User',exact: true},
  // { name: "omni chat window", component: ChatWindow },
  // { path: "/:notfound", name:"Page not found", component: NotFound,  AccessType: 'User'},

];

export default indexRoutes;
