import { fetchFeaturedProjects, fetchProjects, fetchProjectById, createProject } from './slices/projectSlice';
import { loginUser, registerUser, logout, clearError } from './slices/authSlice';

// This file can serve as a central export hub for all actions if needed,
// though direct imports from slices are usually preferred in Redux Toolkit.

export {
  fetchFeaturedProjects,
  fetchProjects,
  fetchProjectById,
  createProject,
  loginUser,
  registerUser,
  logout,
  clearError
};
