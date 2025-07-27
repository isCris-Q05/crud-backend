import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  Box,
  Typography,
  TextField,
  Button,
  Avatar,
  Badge,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  IconButton,
  Menu,
  MenuItem,
  Chip,
} from "@mui/material";
import {
  Search,
  FilterList,
  Add,
  MoreVert,
  Logout,
  Visibility,
  Edit,
  Delete,
  People
} from "@mui/icons-material";
import { UserModal } from "../components/UserModal";
import { UserDetailsModal } from "../components/UserDetailsModal";
import { DeleteConfirmModal } from "../components/DeleteConfirmModal";
import "../styles/UserDashboardPage.css";
import { EditUserModal } from "../components/EditUserModal";

export function UserDashboardPage() {
  const [users, setUsers] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [anchorEl, setAnchorEl] = useState(null);
  const [selectedUser, setSelectedUser] = useState(null);
  const [openModal, setOpenModal] = useState(null);
  const navigate = useNavigate();

  // Datos de ejemplo
  useEffect(() => {
    const mockUsers = [
      {
        id: 1,
        username: "admin",
        email: "admin@example.com",
        role: "Administrator",
        status: "active",
        permission: "Owner",
      },
      {
        id: 2,
        username: "john_doe",
        email: "john.doe@example.com",
        role: "Team member",
        status: "active",
        permission: "Editor",
      },
      {
        id: 3,
        username: "jane_smith",
        email: "jane.smith@example.com",
        role: "Contributor",
        status: "inactive",
        permission: "Viewer",
      },
    ];
    setUsers(mockUsers);
  }, []);

  const filteredUsers = users.filter(
    (user) =>
      user.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleMenuClick = (user, event) => {
    setAnchorEl(event.currentTarget);
    setSelectedUser(user);
  };

  const handleCloseMenu = () => {
    setAnchorEl(null);
  };

  const handleLogout = () => {
    navigate("/");
  };

  return (
    <Box className="dashboard-page">
      {/* Header */}
      <Box className="dashboard-header">
        <Box sx={{ display: 'flex', gap: 2 }}>
          {/* Icono de usuarios más grande */}
          <People sx={{ 
            fontSize: '40px',  // Tamaño aumentado
            color: 'primary.main',
            backgroundColor: 'rgba(25, 118, 210, 0.1)',
            borderRadius: '50%',
            padding: '8px',    // Padding aumentado para compensar el tamaño
            alignSelf: 'center' // Alineación vertical
          }} />
          
          {/* Títulos en columna */}
          <Box>
            <Typography variant="h4" fontWeight="bold" sx={{ lineHeight: 1.2 }}>
              Sistema de Usuarios
            </Typography>
            <Typography variant="subtitle1" color="text.secondary" sx={{ lineHeight: 1.2 }}>
              Gestión completa de usuarios
            </Typography>
          </Box>
        </Box>

        {/* Sección derecha con avatar y botón */}
        <Box className="user-actions">
          <Avatar sx={{ 
            bgcolor: "primary.main", 
            width: 44, 
            height: 44,
            fontSize: '1.25rem'
          }}>
            {users[0]?.username?.charAt(0) || "A"}
          </Avatar>
          <Button
            onClick={handleLogout}
            startIcon={<Logout />}
            variant="outlined"
            size="medium"
            sx={{ ml: 2 }}
          >
            Salir
          </Button>
        </Box>
      </Box>

      {/* Espacio en blanco */}

      {/* Sección de información y controles */}
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          mb: 3,
          mt: 2,
        }}
      >
        <Typography variant="h6" sx={{ fontWeight: 500 }}>
          Usuarios registrados:{" "}
          <Chip label={filteredUsers.length} color="primary" size="small" />
        </Typography>

        <Box sx={{ display: "flex", gap: 2 }}>
          <TextField
            placeholder="Buscar usuarios..."
            size="small"
            InputProps={{
              startAdornment: <Search sx={{ color: "action.active" }} />,
              sx: { borderRadius: 2 },
            }}
            onChange={(e) => setSearchTerm(e.target.value)}
            sx={{ width: 250 }}
          />
          <Button
            variant="contained"
            startIcon={<FilterList />}
            sx={{ minWidth: 140 }}
          >
            Filtrar
          </Button>
          <Button
            variant="contained"
            startIcon={<Add />}
            sx={{ minWidth: 160 }}
            onClick={() => setOpenModal("create")}
          >
            Crear Usuario
          </Button>
        </Box>
      </Box>

      {/* Tabla */}
      <TableContainer component={Paper} className="users-table" sx={{ mt: 2 }}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>USUARIO</TableCell>
              <TableCell>EMAIL</TableCell>
              <TableCell>ROL</TableCell>
              <TableCell>ESTADO</TableCell>
              <TableCell>PERMISOS</TableCell>
              <TableCell>ACCIONES</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredUsers.map((user) => (
              <TableRow key={user.id}>
                <TableCell>
                  <Box className="user-cell">
                    <Avatar sx={{ width: 40, height: 40 }}>
                      {user.username.charAt(0)}
                    </Avatar>
                    <Box>
                      <Typography fontWeight="medium">
                        {user.username}
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        ID: {user.id}
                      </Typography>
                    </Box>
                  </Box>
                </TableCell>
                <TableCell>{user.email}</TableCell>
                <TableCell>{user.role}</TableCell>
                <TableCell>
                  <Chip
                    label={user.status === "active" ? "Activo" : "Inactivo"}
                    color={user.status === "active" ? "success" : "error"}
                    size="small"
                    sx={{ fontWeight: 500 }}
                  />
                </TableCell>
                <TableCell>{user.permission}</TableCell>
                <TableCell>
                  <IconButton onClick={(e) => handleMenuClick(user, e)}>
                    <MoreVert />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Menú contextual */}
      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleCloseMenu}
      >
        <MenuItem
          onClick={() => {
            setOpenModal("details");
            handleCloseMenu();
          }}
        >
          <Visibility fontSize="small" sx={{ mr: 1 }} /> Ver detalles
        </MenuItem>
        <MenuItem
          onClick={() => {
            setOpenModal("edit");
            handleCloseMenu();
          }}
        >
          <Edit fontSize="small" sx={{ mr: 1 }} /> Editar
        </MenuItem>
        <MenuItem
          onClick={() => {
            setOpenModal("delete");
            handleCloseMenu();
          }}
        >
          <Delete fontSize="small" sx={{ mr: 1 }} color="error" /> Eliminar
        </MenuItem>
      </Menu>

      {/* Modales */}
      <UserModal
        open={openModal === "create"}
        onClose={() => setOpenModal(null)}
        mode={openModal}
        userData={selectedUser}
      />

      <EditUserModal
        open={openModal === "edit"}
        user={selectedUser}
        onClose={() => setOpenModal(null)}
        onSave={(data) => {
          setUsers((prev) =>
            prev.map((u) => (u.id === selectedUser.id ? { ...u, ...data } : u))
          );
          setOpenModal(null);
        }}
        />

      <UserDetailsModal
        open={openModal === "details"}
        onClose={() => setOpenModal(null)}
        user={selectedUser}
      />

      <DeleteConfirmModal
        isOpen={openModal === "delete"}
        onClose={() => setOpenModal(null)}
        onConfirm={() => {
          setUsers(users.filter((u) => u.id !== selectedUser?.id));
          setOpenModal(null);
        }}
        userName={selectedUser?.username || ""}
      />
    </Box>
  );
}
