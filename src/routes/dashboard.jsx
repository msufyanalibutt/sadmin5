
import {
  dashboardComponent,
  AdminComponent,
  AdminUserComponent,
  UserComponent,
  UserViewComponent,
  productComponent,
  productInfoComponent,
  CategoryListComponent,
  CategoryInfoComponent,
  MakeListComponent,
  MakeInfoComponent,
  ServiceListComponent,
  ServiceInfoComponent,
  DriveTrainComponent,
  DriveTrainInfoComponent,
  BodyTypeComponent,
  BodyTypeInfoComponent,
  FuelTypeComponent,
  FuelTypeInfoComponent,
  TransmissionComponent,
  TransmissionInfoComponent,
  SettingsComponent,
  ReviewComponent,
  OrderComponent,
  OrderDetailViewComponent,
  ContactUsComponent,
  BListComponent,
  ReportedUserListComponent,
  ReportedProductListComponent,
  TransactionsComponent,
  FeatureListComponent,
  FeatureInfoComponent,
  mBannerComponent,
  bFormInfoComponent,
  LanguageComponent,
  LanguageInfoComponent,
  ReportComponent,
  ReportInfoComponent,
  MetaListComponent,
  MetaInfoComponent,
  StaticPagesListComponent,
  StaticPagesInfoComponent,
  CurrencyListComponent,
  CurrencyInfoComponent,
  DashboardIcon,
  Settings,
  UserIcon,
  Admin,
  ProductIcon,
  CategoryIcon,
  ServiceIcon,
  FuelIcon,
  TransmissionIcon,
  DriveTrain,
  BodyIcon,
  MakeIcon,
  FeedbackIcon,
  BlockIcon,
  ReportIcon,
  ReportIconUser,
  ReasonIcon,
  CurrencyIcon,
  CarIcon,
  SearchIcon,
  RateReviewIcon,
  ReceiptIcon,
  FeaturedVideoIcon,
  ViewCarouselIcon,
  TranslateIcon,
  PagesIcon,
  LocalOfferIcon,
  ArrowUpwardIcon,
  SendEmailComponent,
  FilterViewComponent,
  FilterListComponent,
  ForceUpdateListComponent,
  ForceUpdateComponent
} from "./ImportTitles.js";

const { REACT_APP_ADMIN_PATH } = process.env;


var dashRoutes = [
  {
    path: `${REACT_APP_ADMIN_PATH }/dashboard`,
    name: "Dashboard",
    icon: DashboardIcon,
    component: dashboardComponent
  },
  {
    path: `${REACT_APP_ADMIN_PATH }/adminUsers`,
    name: "Manage Admin",
    component: AdminComponent,
    icon: Admin
  },
  {
    path: `${REACT_APP_ADMIN_PATH }/users`,
    name: "Manage Users",
    component: UserComponent,
    icon: UserIcon
  },
  {
    path: `${REACT_APP_ADMIN_PATH }/adminUsers-manageAdd`,
    name: "Add Admin",
    nosideBar: true,
    component: AdminUserComponent,
  },
  {
    path: `${REACT_APP_ADMIN_PATH }/adminUsers-editAdmin/:id`,
    nosideBar: true,
    name: "Edit Admin",
    component: AdminUserComponent,
  },
  {
    name: "Add User",
    nosideBar: true,
    path: `${REACT_APP_ADMIN_PATH }/users-addUser`,
    component: UserViewComponent,
  },
  {
    path: `${REACT_APP_ADMIN_PATH }/users-editUser/:id`,
    nosideBar: true,
    name: "Edit User",
    component: UserViewComponent,
  },
  {
    path: `${REACT_APP_ADMIN_PATH }/Products`,
    name: "Manage Products",
    component: productComponent,
    icon: ProductIcon
  },
  {
    name: "Add Product",
    nosideBar: true,
    path: `${REACT_APP_ADMIN_PATH }/Products-addProduct`,
    component: productInfoComponent
  },
  {
    path: `${REACT_APP_ADMIN_PATH }/Products-editProduct/:id`,
    nosideBar: true,
    name: "Edit Product",
    component: productInfoComponent
  },
  {
    path: `${REACT_APP_ADMIN_PATH }/categories`,
    name: "Manage Categories",
    component: CategoryListComponent,
    icon: CategoryIcon
  },
  {
    name: "Add Category",
    nosideBar: true,
    path: `${REACT_APP_ADMIN_PATH }/categories-addCategory`,
    component: CategoryInfoComponent
  },
  {
    path: `${REACT_APP_ADMIN_PATH }/categories-editCategory/:id`,
    nosideBar: true,
    name: "Edit Category",
    component: CategoryInfoComponent
  },
  {
    path: `${REACT_APP_ADMIN_PATH }/fields`,
    name: "Manage Fields",
    component: FilterListComponent,
    icon: SearchIcon
  },
  {
    name: "Add Fields",
    nosideBar: true,
    path: `${REACT_APP_ADMIN_PATH }/fields-addField`,
    component: FilterViewComponent
  },
  {
    path: `${REACT_APP_ADMIN_PATH }/fields-editField/:id`,
    nosideBar: true,
    name: "Edit Fields",
    component: FilterViewComponent
  },
  // {
  //   collapse: true,
  //   path: `${REACT_APP_ADMIN_PATH }`,
  //   name: "Manage Emails",
  //   state: "openComponentsEmail",
  //   icon: FeedbackIcon,
  //   views: [
  //     {
  //       path: `${REACT_APP_ADMIN_PATH }/sendEmail`,
  //       name: "send Email",
  //       component: SendEmailComponent,
  //       mini: "SM"
  //     },
  //   ]
  // },
  {
    path: `${REACT_APP_ADMIN_PATH }/siteSettings`,
    name: "Manage Site Settings",
    component: SettingsComponent,
    icon: Settings
  },
  {
    path: `${REACT_APP_ADMIN_PATH }/reviews`,
    name: "Manage Reviews",
    component: ReviewComponent,
    icon: RateReviewIcon
  },
  {
    path: `${REACT_APP_ADMIN_PATH }/orders`,
    name: "Orders",
    component: OrderComponent,
    icon: RateReviewIcon
  },
  {
    path: `${REACT_APP_ADMIN_PATH }/order-view/:id`,
    nosideBar: true,
    name: "Order View",
    component: OrderDetailViewComponent
  },
  {
    path: `${REACT_APP_ADMIN_PATH }/contactus`,
    name: "Manage FeedBack",
    component: ContactUsComponent,
    icon: FeedbackIcon
  },
  {
    path: `${REACT_APP_ADMIN_PATH }/blockedUsers`,
    name: "Manage Blocked Users",
    component: BListComponent,
    icon: BlockIcon
  },
  {
    path: `${REACT_APP_ADMIN_PATH }/reportedUsers`,
    name: "Reported Users List",
    component: ReportedUserListComponent,
    icon: ReportIconUser
  },
  {
    path: `${REACT_APP_ADMIN_PATH }/reportedProducts`,
    name: "Reported Products List",
    component: ReportedProductListComponent,
    icon: ReportIcon
  },
  {
    path: `${REACT_APP_ADMIN_PATH }/TransactionList`,
    name: "Manage Transactions",
    component: TransactionsComponent,
    icon: ReceiptIcon
  },
  {
    path: `${REACT_APP_ADMIN_PATH }/featureList`,
    name: "Manage Feature List",
    component: FeatureListComponent,
    icon: FeaturedVideoIcon
  },

  {
    path: `${REACT_APP_ADMIN_PATH }/manageBanner`,
    name: "Manage Banner",
    component: mBannerComponent,
    icon: ViewCarouselIcon
  },

  {
    name: "Edit Banner",
    path: `${REACT_APP_ADMIN_PATH }/manageBanner-editBanner/:id`,
    nosideBar: true,
    component: bFormInfoComponent,
    icon: ReportIcon,

  },
  {
    path: `${REACT_APP_ADMIN_PATH }/manageBanner-addBanner`,
    name: "Add Banner",
    component: bFormInfoComponent,
    icon: ReportIcon,
    nosideBar: true
  },

  {
    path: `${REACT_APP_ADMIN_PATH }/ManageLanguage`,
    name: "Manage Language",
    component: LanguageComponent,
    icon: TranslateIcon
  },
  {
    path: `${REACT_APP_ADMIN_PATH }/ManageLanguage-languages/:id`,
    name: "Edit Languages",
    component: LanguageInfoComponent,
    nosideBar: true
  },
  {
    path: `${REACT_APP_ADMIN_PATH }/ManageLanguage-addLanguage`,
    name: "Add Languages",
    component: LanguageInfoComponent,
    nosideBar: true
  },
  {
    path: `${REACT_APP_ADMIN_PATH }/staticPages`,
    name: "Manage Static Pages",
    component: StaticPagesListComponent,
    icon: PagesIcon
  },
  {
    path: `${REACT_APP_ADMIN_PATH }/staticPages-addStaticPages`,
    name: "Add Static Pages",
    component: StaticPagesInfoComponent,
    nosideBar: true
  },
  {
    path: `${REACT_APP_ADMIN_PATH }/staticPages-editStaticPages/:id`,
    name: "Edit Static Pages",
    component: StaticPagesInfoComponent,
    nosideBar: true
  },
  {
    name: "Add Feature",
    nosideBar: true,
    path: `${REACT_APP_ADMIN_PATH }/featureList-addFeature`,
    component: FeatureInfoComponent

  },
  {
    path: `${REACT_APP_ADMIN_PATH }/featureList-editFeature/:id`,
    nosideBar: true,
    name: "Edit Feature",
    component: FeatureInfoComponent
  },
  {
    path: `${REACT_APP_ADMIN_PATH }/reportReasons-addReportReason`,
    nosideBar: true,
    name: "Add Report Reason",
    component: ReportInfoComponent
  },
  {
    path: `${REACT_APP_ADMIN_PATH }/reportReasons-editReportReason/:id`,
    nosideBar: true,
    name: "Edit Report Reason",
    component: ReportInfoComponent
  },
  {
    path: `${REACT_APP_ADMIN_PATH }/reportReasons`,
    name: "Manage Report-Reasons",
    component: ReportComponent,
    icon: ReasonIcon
  },
  {
    path: `${REACT_APP_ADMIN_PATH }/MetasList`,
    name: "Manage Metas",
    component: MetaListComponent,
    icon: LocalOfferIcon
  },

  {
    path: `${REACT_APP_ADMIN_PATH }/MetasList-editMetas/:id`,
    nosideBar: true,
    name: "Edit Metas",
    component: MetaInfoComponent

  },

  {
    name: "Add Metas",
    nosideBar: true,
    path: `${REACT_APP_ADMIN_PATH }/MetasList-addMetas`,
    component: MetaInfoComponent
  },


  {
    path: `${REACT_APP_ADMIN_PATH }/currencies`,
    name: "Manage Currency",
    component: CurrencyListComponent,
    icon: CurrencyIcon
  },
  {
    name: "Add Currency",
    nosideBar: true,
    path: `${REACT_APP_ADMIN_PATH }/currencies-addCurrency`,
    component: CurrencyInfoComponent
  },
  {
    path: `${REACT_APP_ADMIN_PATH }/currencies-editCurrency/:id`,
    nosideBar: true,
    name: "Edit Currency",
    component: CurrencyInfoComponent
  },  
  {
    path: `${REACT_APP_ADMIN_PATH }/mobile-app-version`,    
    name: "Manage Mobile App Version",
    component: ForceUpdateListComponent,
    icon: ArrowUpwardIcon
  },
  {    
    path: `${REACT_APP_ADMIN_PATH }/add-app-version`,    
    nosideBar: true,
    name: "Manage Mobile App Version",
    component: ForceUpdateComponent    
  },
  {    
    path: `${REACT_APP_ADMIN_PATH }/edit-app-version/:id`,  
    nosideBar: true,  
    name: "Manage Mobile App Version",
    component: ForceUpdateComponent    
  },
];
export default dashRoutes;
