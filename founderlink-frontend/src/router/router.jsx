import { createBrowserRouter } from "react-router-dom";

import Landing from "../pages/common/Landing";
import Login from "../pages/auth/Login";
import Register from "../pages/auth/Register";
import Dashboard from "../pages/common/Dashboard";

import Layout from "../components/Layout";
import ProtectedRoute from "../components/ProtectedRoute";
import RoleProtectedRoute from "../components/RoleProtectedRoute";

import FounderDashboard from "../pages/dashboard/FounderDashboard";
import InvestorDashboard from "../pages/dashboard/InvestorDashboard";
import CofounderDashboard from "../pages/dashboard/CofounderDashboard";


import CreateStartup from "../pages/startup/CreateStartup";
import BrowseStartups from "../pages/startup/BrowseStartups";

import PublicRoute from "../components/PublicRoute";
import MyStartups from "../pages/startup/MyStartups";
import Invest from "../pages/investment/Invest";
import MyInvestments from "../pages/investment/MyInvestments";
import StartupDetails from "../pages/startup/StartupDetails";
import EditStartup from "../pages/startup/EditStartup";
import StartupInvestments from "../pages/investment/StartupInvestments";
import RequestFunding from "../pages/investment/RequestFunding"
import InvestmentRequests from "../pages/investment/InvestmentRequests";
import SelectInvestor from "../pages/investment/SelectInvestor";
import ProfileForm from "../pages/user/ProfileForm"
import ProfileView from "../pages/user/ViewProfile";
import UserProfile from "../pages/user/UserProfile";
import TeamRequests from "../pages/user/TeamRequests";
import Notifications from "../pages/common/Notifications";


const router = createBrowserRouter([
  {
    path: "/",
    element: <Layout />,
    children: [
      { 
        index: true, 
        element: <Landing />
      },
      { 
        path: "login",
        element: (
          <PublicRoute>
            <Login />
          </PublicRoute>
        ), 
      },
      { 
        path: "register", 
        element: (
          <PublicRoute>
            <Register />
          </PublicRoute>
        ),
      },

      // Protected dashboard
      {
        path: "dashboard",
        element: (
          <ProtectedRoute>
            <Dashboard />
          </ProtectedRoute>
        ),
      },

      // Founder Routes
      {
        path: "founder-dashboard",
        element: (
          <RoleProtectedRoute allowedRoles={["FOUNDER"]}>
            <FounderDashboard />
          </RoleProtectedRoute>
        ),
      },
      {
        path: "create-startup",
        element: (
          <RoleProtectedRoute allowedRoles={["FOUNDER"]}>
            <CreateStartup />
          </RoleProtectedRoute>
        ),
      },

      // Investor Routes
      {
        path: "investor-dashboard",
        element: (
          <RoleProtectedRoute allowedRoles={["INVESTOR"]}>
            <InvestorDashboard />
          </RoleProtectedRoute>
        ),
      },
      {
        path: "cofounder-dashboard",
        element: (
          <RoleProtectedRoute allowedRoles={["COFOUNDER"]}>
            <CofounderDashboard />
          </RoleProtectedRoute>
        ),
      },

      {
        path: "browse-startups",
        element: (
          <ProtectedRoute>
            <BrowseStartups />
          </ProtectedRoute>
        ),
      },
      {
        path: "my-startups",
        element: (
          <RoleProtectedRoute allowedRoles={["FOUNDER"]}>
            <MyStartups />
          </RoleProtectedRoute>
        ),
      },
      {
        path: "invest/:startupId",
        element: (
          <RoleProtectedRoute allowedRoles={["INVESTOR"]}>
            <Invest />
          </RoleProtectedRoute>
        ),
      },
      {
        path: "investments",
        element: (
          <RoleProtectedRoute allowedRoles={["INVESTOR"]}>
            <MyInvestments />
          </RoleProtectedRoute>
        ),
      },
      {
        path: "startup/:id",
        element: (
          <ProtectedRoute>
            <StartupDetails />
          </ProtectedRoute>
        ),
      },
      {
        path: "founder/edit/:id",
        element: (
          <RoleProtectedRoute allowedRoles={["FOUNDER"]}>
            <EditStartup />
          </RoleProtectedRoute>
        ),
      },
      {
        path: "founder/startup/:startupId/investments",
        element: (
          <RoleProtectedRoute allowedRoles={["FOUNDER"]}>
            <StartupInvestments />
          </RoleProtectedRoute>
        ),
      },
      {
        path: "founder/startup/:startupId/request",
        element: <SelectInvestor />
      },
      {
        path: "founder/startup/:startupId/request/:email",
        element: <RequestFunding />
      },
      {
        path: "investor/requests",
        element: (
          <RoleProtectedRoute allowedRoles={["INVESTOR"]}>
            <InvestmentRequests />
          </RoleProtectedRoute>
        ),
      },
      {
        path: "profile/edit",
        element: (
          <ProtectedRoute>
            <ProfileForm />
          </ProtectedRoute>
        ),
      },
      {
        path: "profile",
        element: (
          <ProtectedRoute>
            <ProfileView />
          </ProtectedRoute>
        ),
      },
      {
        path: "users/:id",
        element: (
          <ProtectedRoute>
            <UserProfile />
          </ProtectedRoute>
        ),
      },
      {
        path: "team-requests",
        element: (
          <RoleProtectedRoute allowedRoles={["COFOUNDER"]}>
            <TeamRequests />
          </RoleProtectedRoute>
        ),
      },
      {
        path: "notifications",
        element: (
          <ProtectedRoute>
            <Notifications />
          </ProtectedRoute>
        ),
      }
    ],
  },
]);


export default router;