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
  People,
} from "@mui/icons-material";
import { UserModal } from "../components/UserModal";
import { UserDetailsModal } from "../components/UserDetailsModal";
import { DeleteConfirmModal } from "../components/DeleteConfirmModal";
import "../styles/UserDashboardPage.css";
import { EditUserModal } from "../components/EditUserModal";
import authService from "../services/authService";
import userService from "../services/userService";

export function UserDashboardPage() {
  const [users, setUsers] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [anchorEl, setAnchorEl] = useState(null);
  const [selectedUser, setSelectedUser] = useState(null);
  const [openModal, setOpenModal] = useState(null);
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // Datos de ejemplo
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        setLoading(true);
        const response = await userService.getAllUsers();
        setUsers(response.data);
        setError(null);
      } catch (error) {
        setError("Error al cargar los usuarios. Por favor, intente más tarde.");
        console.error("Error al cargar los usuarios:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchUsers();
  }, []);

  const filteredUsers = users.filter(
    (user) => {
      if (!user || !user.username || !user.email) return false;
      return (
        user.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.email.toLowerCase().includes(searchTerm.toLowerCase())
      )
    }
  );

  const handleMenuClick = (user, event) => {
    setAnchorEl(event.currentTarget);
    setSelectedUser(user);
  };

  const handleCloseMenu = () => {
    setAnchorEl(null);
  };

  const handleLogout = async () => {
    try {
      await authService.logout();
      navigate("/");
    } catch (error) {
      console.error("Error al cerrar sesion: ", error);
      // forzamos navegacion si hay error
      navigate("/");
    }
  };

  const handleCreateUser = async (userData) => {
    try {
      const response = await userService.createUser(userData);

      // asegurarnos de que response.data tenga la estructura correcta
      const newUser = {
        id: response.data.id,
        username: response.data.username,
        email: response.data.email,
        role: userData.role, // o response.data.role si viene del backend
        status: userData.active ? "active" : "inactive",
        permission: "Viewer", // valor por defecto o el que venga del backend
        profile_picture_link: userData.profile_picture_link,
      };

      // actualizar el estado de usuarios
      setUsers((prevUsers) => [...prevUsers, newUser]);

      return newUser;
    } catch (error) {
      console.error("Error al crear usuario:", error);
      throw error;
    }
  };

  return (
    <Box className="dashboard-page">
      {/* Header */}
      <Box className="dashboard-header">
        <Box sx={{ display: "flex", gap: 2 }}>
          {/* Icono de usuarios más grande */}
          <People
            sx={{
              fontSize: "40px", // Tamaño aumentado
              color: "primary.main",
              backgroundColor: "rgba(25, 118, 210, 0.1)",
              borderRadius: "50%",
              padding: "8px", // Padding aumentado para compensar el tamaño
              alignSelf: "center", // Alineación vertical
            }}
          />

          {/* Títulos en columna */}
          <Box>
            <Typography variant="h4" fontWeight="bold" sx={{ lineHeight: 1.2 }}>
              Sistema de Usuarios
            </Typography>
            <Typography
              variant="subtitle1"
              color="text.secondary"
              sx={{ lineHeight: 1.2 }}
            >
              Gestión completa de usuarios
            </Typography>
          </Box>
        </Box>

        {/* Sección derecha con avatar y botón */}
        <Box className="user-actions">
          <Avatar
            sx={{
              bgcolor: "primary.main",
              width: 44,
              height: 44,
              fontSize: "1.25rem",
            }}
          >
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
        onCreateSuccess={handleCreateUser}
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
