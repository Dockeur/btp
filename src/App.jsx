import "./App.css";
import About from "./Pages/Public/About";
import Contact from "./Pages/Public/Contact";
import Home from "./Pages/Public/Home";
import Terrain from "./Pages/Public/Land";
import Login from "./Pages/Public/authentification/Login";
import Services from "@/components/Services";
import TerrainDetail from "@/components/TerrainDetail";
import React from "react";
import Aide from "./Pages/Public/Aide";
import Pagination from "./Pages/Public/Pagination";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import Immeuble from "./Pages/Public/Building";
import Duplex from "./Pages/Public/Duplex";
import Villa from "./Pages/Public/Villa";
import EspaceCommerciale from "@/components/commerciaux/EspaceCommerciale";
import Proposer from "./Pages/Public/Proposer";
import Index from "./Pages/Public/Propose/Index";
import ForgotPassword from "./Pages/Public/authentification/ForgotPassword";
import Register from "./Pages/Public/authentification/Register";
import ValidateUser from "./Pages/Public/authentification/ValidateUser";
import { ProtectedRoute } from "./auth/ProtectedRoute";
import Layout from "@/components/Layout";
import { routes } from "./routes";
import Profile from "./Pages/Public/Profile";
import Land from "./Pages/Public/Propose/LandPorpose";
import BuildingPorpose from "./Pages/Public/Propose/BuildingPorpose";
import AppartmentPorpose from "./Pages/Public/Propose/AppartmentPorpose";
import DuplexePorpose from "./Pages/Public/Propose/DuplexePorpose";
import PublicProjectDetails from "./Pages/Public/PublicProjectDetails";
import AdminLayout from "@/components/admin/layout/AdminLayout";
import Dashboard from "./Pages/admin/Dashboard";
import AdminProfile from "./Pages/admin/Profile";
import Employee from "./Pages/admin/employee/Employee";
import ShowEmployee from "./Pages/admin/employee/ShowEmployee";
import EditEmployee from "./Pages/admin/customer/EditEmployee";
import Customer from "./Pages/admin/customer/Customer";
import ShowCustomer from "./Pages/admin/customer/ShowCustomer";
import EditCustomer from "./Pages/admin/employee/EditCustomer";
import Role from "./Pages/admin/role/Role";
import Accommodation from "./Pages/admin/accommodation/Accommodation";
import Property from "./Pages/admin/property/Property";
import ShowProperty from "./Pages/admin/property/ShowProperty";
import EditProperty from "./Pages/admin/property/EditProperty";
import AddProperty from "./Pages/admin/property/AddProperty";
import AdminLand from './Pages/admin/land/Lands';
import ShowLand from "./Pages/admin/land/ShowLand";
import Product from "./Pages/admin/product/Product";
import Order from "./Pages/admin/order/Order";
import LandDetail from "./Pages/Public/PropetyDetail";
import LandDetails from "./Pages/Public/DetailLand";
import AdminAppointmentsTable from "./components/admin/ui/appoiement/Appoiement";
import BuildingDetailsPage from "./Pages/Public/building/BuildingDetailsPage";
import './i18n/config';
import AuthCallback from "./components/public/AuthCallback";
import AdminSaleRequestsPage from "./Pages/admin/Adminsalerequestspage/Adminsalerequestspage";
import AdminContractsPage from "./Pages/admin/Admincontractspage/Admincontractspage";
import Commande from "./Pages/Public/Commande";
import AdminOrderCustomers from "./Pages/admin/Adminordercustomers";


function App() {
    return (
        <BrowserRouter>
            <Routes>
                <Route path="/" element={<Layout><Home /></Layout>} />
                <Route path={routes.home.path} element={<Layout><Home /></Layout>} />
                <Route path={routes.about.path} element={
                    <ProtectedRoute><Layout><About /></Layout></ProtectedRoute>
                } />
                <Route path={routes.profile.path} element={
                    <ProtectedRoute><Layout><Profile /></Layout></ProtectedRoute>
                } />

                <Route path="/services" element={<Services />} />
                <Route path="/produits" element={<Proposer />} />
                <Route path="/auth/callback" element={<AuthCallback />} />
                <Route path={routes.land.path} element={<Layout><Terrain /></Layout>} />
                <Route path="/land/:id" element={<Layout><LandDetail /></Layout>} />
                <Route path="/projects/:id" element={<Layout><PublicProjectDetails /></Layout>} />
                <Route path="/lands/:id" element={<Layout><LandDetails /></Layout>} />
                <Route path={routes.login.path} element={<Layout><Login /></Layout>} />
                <Route path={routes.register.path} element={<Layout><Register /></Layout>} />
                <Route path={routes.contact.path} element={<Layout><Contact /></Layout>} />
                <Route path={routes.porpose.path} element={<Layout><Index /></Layout>} />
                <Route path={routes.landPorpose.path} element={<Layout><Land /></Layout>} />
                <Route path={routes.buildingPorpose.path} element={<Layout><BuildingPorpose /></Layout>} />
                <Route path={routes.apartmentPorpose.path} element={<Layout><AppartmentPorpose /></Layout>} />
                <Route path={routes.duplexPorpose.path} element={<Layout><DuplexePorpose /></Layout>} />
                <Route path="/immeubles/:id" element={<Layout><BuildingDetailsPage /></Layout>} />
                <Route path="/terrainDetail" element={<TerrainDetail />} />
                <Route path={routes.villa.path} element={<Layout><Villa /></Layout>} />
                <Route path={routes.duplex.path} element={<Layout><Duplex /></Layout>} />
                <Route path={routes.building.path} element={<Layout><Immeuble /></Layout>} />
                <Route path="/espaceCommerciale" element={<EspaceCommerciale />} />
                <Route path="/forgotPassword" element={<ForgotPassword />} />

                <Route path="/commande" element={
                    <ProtectedRoute>
                        <Layout><Commande /></Layout>
                    </ProtectedRoute>
                } />

                <Route path={routes.validateUser.path} element={
                    <ProtectedRoute verified={false}>
                        <ValidateUser />
                    </ProtectedRoute>
                } />
                <Route path="/pagination" element={<Pagination />} />

                <Route path={routes.admin.path} element={
                    <ProtectedRoute><AdminLayout><Dashboard /></AdminLayout></ProtectedRoute>
                } />
                <Route path="/Admin/LandCustomerSale" element={
                    <ProtectedRoute><AdminLayout><AdminSaleRequestsPage /></AdminLayout></ProtectedRoute>
                } />
                <Route path="/admin/Contracts" element={
                    <ProtectedRoute><AdminLayout><AdminContractsPage /></AdminLayout></ProtectedRoute>
                } />
                <Route path={routes.admin.profile.path} element={
                    <ProtectedRoute><AdminLayout><AdminProfile /></AdminLayout></ProtectedRoute>
                } />
                <Route path={routes.admin.employees.path} element={
                    <ProtectedRoute><AdminLayout><Employee /></AdminLayout></ProtectedRoute>
                } />
                <Route path="admin/appointment" element={
                    <ProtectedRoute><AdminLayout><AdminAppointmentsTable /></AdminLayout></ProtectedRoute>
                } />
                <Route path={routes.admin.customers.path} element={
                    <ProtectedRoute><AdminLayout><Customer /></AdminLayout></ProtectedRoute>
                } />
                <Route path={routes.admin.employees.path + "/:id"} element={
                    <ProtectedRoute><AdminLayout><ShowEmployee /></AdminLayout></ProtectedRoute>
                } />
                <Route path={routes.admin.customers.path + "/:id"} element={
                    <ProtectedRoute><AdminLayout><ShowCustomer /></AdminLayout></ProtectedRoute>
                } />
                <Route path={routes.admin.employees.path + "/:id/edit"} element={
                    <ProtectedRoute><AdminLayout><EditEmployee /></AdminLayout></ProtectedRoute>
                } />
                <Route path={routes.admin.customers.path + "/:id/edit"} element={
                    <ProtectedRoute><AdminLayout><EditCustomer /></AdminLayout></ProtectedRoute>
                } />
                <Route path={routes.admin.roles.path} element={
                    <ProtectedRoute><AdminLayout><Role /></AdminLayout></ProtectedRoute>
                } />
                <Route path={routes.admin.accommodations.path} element={
                    <ProtectedRoute><AdminLayout><Accommodation /></AdminLayout></ProtectedRoute>
                } />
                <Route path={routes.admin.properties.path} element={
                    <ProtectedRoute><AdminLayout><Property /></AdminLayout></ProtectedRoute>
                } />
                <Route path={routes.admin.properties.path + "/:id"} element={
                    <ProtectedRoute><AdminLayout><ShowProperty /></AdminLayout></ProtectedRoute>
                } />
                <Route path={routes.admin.properties.path + "/:id/edit"} element={
                    <ProtectedRoute><AdminLayout><EditProperty /></AdminLayout></ProtectedRoute>
                } />
                <Route path={routes.admin.properties.create} element={
                    <ProtectedRoute><AdminLayout><AddProperty /></AdminLayout></ProtectedRoute>
                } />
                <Route path={routes.admin.lands.path} element={
                    <ProtectedRoute><AdminLayout><AdminLand /></AdminLayout></ProtectedRoute>
                } />
                <Route path={routes.admin.lands.path + "/:id"} element={
                    <ProtectedRoute><AdminLayout><ShowLand /></AdminLayout></ProtectedRoute>
                } />
                <Route path={routes.admin.products.path} element={
                    <ProtectedRoute><AdminLayout><Product /></AdminLayout></ProtectedRoute>
                } />
                <Route path={routes.admin.orders.path} element={
                    <ProtectedRoute><AdminLayout><Order /></AdminLayout></ProtectedRoute>
                } />
                <Route path="/admin/order-customers" element={
                    <ProtectedRoute><AdminLayout><AdminOrderCustomers /></AdminLayout></ProtectedRoute>
                } />
            </Routes>
        </BrowserRouter>
    );
}

export default App;