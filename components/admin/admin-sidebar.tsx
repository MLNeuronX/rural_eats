"use client"
import { Box, List, ListItem, ListItemIcon, ListItemText, Divider, Typography } from "@mui/material"
import DashboardIcon from "@mui/icons-material/Dashboard"
import PeopleIcon from "@mui/icons-material/People"
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart"
import BarChartIcon from "@mui/icons-material/BarChart"
import LayersIcon from "@mui/icons-material/Layers"
import { Link } from "react-router-dom"
import { useAuth } from "@/components/auth-provider"

const AdminSidebar = () => {
  const { user } = useAuth()

  // Check if the user is an admin
  const isAdmin = user?.role === "admin"

  return (
    <Box sx={{ width: 240, bgcolor: "background.paper", height: "100vh" }}>
      <Typography variant="h6" sx={{ m: 2 }}>
        Admin Panel
      </Typography>
      <Divider />
      <List>
        <ListItem button component={Link} to="/admin/dashboard">
          <ListItemIcon>
            <DashboardIcon />
          </ListItemIcon>
          <ListItemText primary="Dashboard" />
        </ListItem>
        {isAdmin && (
          <>
            <ListItem button component={Link} to="/admin/users">
              <ListItemIcon>
                <PeopleIcon />
              </ListItemIcon>
              <ListItemText primary="Users" />
            </ListItem>
            <ListItem button component={Link} to="/admin/products">
              <ListItemIcon>
                <ShoppingCartIcon />
              </ListItemIcon>
              <ListItemText primary="Products" />
            </ListItem>
            <ListItem button component={Link} to="/admin/analytics">
              <ListItemIcon>
                <BarChartIcon />
              </ListItemIcon>
              <ListItemText primary="Analytics" />
            </ListItem>
            <ListItem button component={Link} to="/admin/integrations">
              <ListItemIcon>
                <LayersIcon />
              </ListItemIcon>
              <ListItemText primary="Integrations" />
            </ListItem>
          </>
        )}
      </List>
      <Divider />
    </Box>
  )
}

export default AdminSidebar
