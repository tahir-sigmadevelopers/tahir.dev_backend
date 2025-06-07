import express from "express"
import { addNewProject, updateProject, getAllProjects, deleteProject, getProjectDetail } from "../controller/project.js"
import { isAdmin, isAuthenticated } from "../auth/isAuthenticated.js"

const router = express.Router()


router.get("/projects", getAllProjects)


router.post("/project/new", isAuthenticated, isAdmin, addNewProject)

router.get("/project/:id", isAuthenticated, isAdmin, getProjectDetail)

router.put("/project/update/:id", isAuthenticated, isAdmin, updateProject)

router.delete("/project/delete/:id", isAuthenticated, isAdmin, deleteProject)



export default router