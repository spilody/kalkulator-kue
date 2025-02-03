// eslint-disable-next-line no-unused-vars
import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import LoginPage from "./pages/LoginPage";
import DashboardPage from "./pages/DashboardPage";
import IngredientManager from "./components/IngredientManager";
import RecipeManager from "./components/RecipeManager";
import SignupPage from "./pages/SignupPage";
import ProtectedRoute from "./components/ProtectedRoute"; // Import ProtectedRoute
import PublicRoute from "./components/PublicRoute"; // Import PublicRoute
import IngredientsTable from "./pages/IngredientsTable"; // Import IngredientsTable
import RecipesTable from "./pages/RecipesTable"; // Import RecipesTable
import RecipeDetail from "./pages/RecipeDetail"; // Import RecipeDetail

function App() {
  return (
    <Router>
      <Routes>
        {/* Public Routes */}
        <Route
          path="/"
          element={
            <PublicRoute>
              <LoginPage />
            </PublicRoute>
          }
        />
        <Route
          path="/signup"
          element={
            <PublicRoute>
              <SignupPage />
            </PublicRoute>
          }
        />

        {/* Protected Routes */}
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <DashboardPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/ingredients"
          element={
            <ProtectedRoute>
              <IngredientManager />
            </ProtectedRoute>
          }
        />
        <Route
          path="/recipes"
          element={
            <ProtectedRoute>
              <RecipeManager />
            </ProtectedRoute>
          }
        />
        <Route
          path="/ingredients-table"
          element={
            <ProtectedRoute>
              <IngredientsTable />
            </ProtectedRoute>
          }
        />
        <Route
          path="/recipes-table"
          element={
            <ProtectedRoute>
              <RecipesTable />
            </ProtectedRoute>
          }
        />
        <Route
          path="/recipe-detail/:id"
          element={
            <ProtectedRoute>
              <RecipeDetail />
            </ProtectedRoute>
          }
        />
      </Routes>
    </Router>
  );
}

export default App;