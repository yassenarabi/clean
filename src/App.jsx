import './App.css';

// Bootstrap
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.bundle.min.js";

// ── Layouts ──
import MainLayOut from './Mainlayout/MainLayOut.jsx';
import UserLayout from './Users/layouts/UserLayout.jsx';

// ── Pages - Company ──
import DashBoard        from './pages/DashBoard.jsx';
import Reports          from './pages/Reports.jsx';
import CleanRouts       from './pages/CleanRouts.jsx';
import Scheduld         from './pages/Scheduld.jsx';
import Performance      from './pages/Performance.jsx';
import Team             from './pages/Team.jsx';
import Setting          from './pages/Setting.jsx';
import LogOut           from './pages/LogOut.jsx';
import ComapnyProfile   from './pages/ComapnyProfile.jsx';
import ReportDetails    from './pages/ReportDetails.jsx';
import MapView          from './pages/MapView.jsx';
import AddMember        from './pages/AddMember.jsx';

// ── Pages - Auth ──
import SignIn        from './Users/Pages/authcation/SignIn.jsx';
import Login         from './Users/Pages/authcation/Login.jsx';

// ── Pages - User ──
import UserHome      from './Users/Pages/UserHome.jsx';
import UserDashboard from './Users/Pages/UserDashboard.jsx';
import SubmitReport  from './Users/Pages/SubmitReport.jsx';
import TrackReport   from './Users/Pages/TrackReport.jsx';
import UserReportDetails from './Users/Pages/UserReportDetails.jsx';
import Leaderboard from './Users/Pages/Leaderboard.jsx';
import UserProfile from './Users/Pages/UserProfile.jsx';
import Notifications from './Users/Pages/Notifications.jsx';
import HowItWorks from './Users/Pages/HowItWorks.jsx';
import UserMyReports from './Users/Pages/UserMyReports.jsx';
// import UserMyReports from './Users/Pages/UserMyReports.jsx';
// import Leaderboard   from './Users/Pages/Leaderboard.jsx';

// ── Context ──
import { TeamProvider } from './context/TeamContext.jsx';

// ── Router ──
import { createBrowserRouter, RouterProvider, Navigate } from "react-router-dom";

const route = createBrowserRouter([

  // ════ بدون Layout (Auth) ════
  { path: "/login",    element: <Login />  },
  { path: "/register", element: <SignIn /> },

  // ════ Company Layout (مع Sidebar) ════
  {
    path: "/company",
    element: (
      <TeamProvider>
        <MainLayOut />
      </TeamProvider>
    ),
    children: [
      { index: true,            element: <DashBoard />      },
      { path: "reports",        element: <Reports />        },
      { path: "reports/:id",    element: <ReportDetails />  },
      { path: "cleanRouts",     element: <CleanRouts />     },
      { path: "scheduld",       element: <Scheduld />       },
      { path: "performance",    element: <Performance />    },
      { path: "team",           element: <Team />           },
      { path: "team/add",       element: <AddMember />      },
      { path: "Setting",        element: <Setting />        },
      { path: "ComapnyProfile", element: <ComapnyProfile /> },
      { path: "logout",         element: <LogOut />         },
      { path: "map",            element: <MapView />        },
    ]
  },

  // ════ User Layout (مع Navbar + Footer) ════
  {
    path: "/user",
    element: <UserLayout />,
    children: [
      { index: true,             element: <UserHome />      },
      { path: "dashboard",       element: <UserDashboard /> },
      { path: "report",          element: <SubmitReport />  },
      { path: "track-report",    element: <TrackReport />   },
      { path: "reports/:id", element: <UserReportDetails /> },
      { path: "leaderboard", element: <Leaderboard /> },
      { path: "profile", element: <UserProfile /> },
      { path: "notifications", element: <Notifications /> },
      { path: "how-it-works", element: <HowItWorks /> },
      { path: "my-reports", element: <UserMyReports /> },
      // { path: "my-reports",   element: <UserMyReports /> },
      // { path: "leaderboard",  element: <Leaderboard />   },
    ]
  },

  // ════ Admin Layout ════
  // {
  //   path: "/admin",
  //   element: <AdminLayout />,
  //   children: []
  // },

  // ════ Redirect ════
  { path: "/",  element: <Navigate to="/login" replace /> },
  { path: "*",  element: <Navigate to="/login" replace /> },

]);

function App() {
  return <RouterProvider router={route} />;
}

export default App;