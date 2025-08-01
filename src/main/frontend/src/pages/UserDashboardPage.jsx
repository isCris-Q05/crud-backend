import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Snackbar } from "@mui/material";
import Alert from "@mui/material/Alert";

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
  Pagination,
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
import UserAvatar from "../components/UserAvatar";

export function UserDashboardPage() {
  const [users, setUsers] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [anchorEl, setAnchorEl] = useState(null);
  const [selectedUser, setSelectedUser] = useState(null);
  const [openModal, setOpenModal] = useState(null);
  const [notification, setNotification] = useState({
    open: false,
    message: "",
    severity: "success",
  });
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // Paginator
  const [page, setPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  const [totalUsers, setTotalUsers] = useState(0);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        setLoading(true);
        const response = await userService.getAllUsers();
        const total = response.data.length;

        // Asegurarnos de que la pagina actual sea valida
        // esta operacion lo que da es el total de usuarios
        const totalPages = Math.ceil(total / rowsPerPage);
        // si la pagina actual es mayor que el total de paginas
        // se le asigna el total de paginas
        const currentPage =
          page > totalPages && totalPages > 0 ? totalPages : page;
        
        // si la pagina actual es diferente a la pagina actual
        // se le asigna la pagina actual
        if (currentPage !== page) {
          setPage(currentPage);
        }

        // paginatedUsers es basicamente el array de usuarios
        // este es igual al array de usuarios, slice es una funcion que
        // recibe un inicio y un final
        const paginatedUsers = response.data.slice(
          (currentPage - 1) * rowsPerPage,
          currentPage * rowsPerPage
        );

        // setUsers es una funcion que se encarga de actualizar el estado
        setUsers(paginatedUsers);
        // setTotalUsers es una funcion que se encarga de actualizar el estado
        setTotalUsers(total);
        setError(null);
      } catch (error) {
        setError("Error al cargar los usuarios. Por favor, intente más tarde.");
        console.error("Error al cargar los usuarios:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, [page, rowsPerPage]);

  // esto es basicamente un filtro

  const filteredUsers = users.filter((user) => {
    if (!user || !user.username || !user.email) return false;
    return (
      user.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase())
    );
  });

  const paginatedFilteredUsers = filteredUsers.slice(
    (page - 1) * rowsPerPage,
    page * rowsPerPage
  );

  // esto es para manejar el menu
  // setAnchorEl es una funcion que se encarga de actualizar el estado

  const handleMenuClick = (user, event) => {
    setAnchorEl(event.currentTarget);
    setSelectedUser(user);
  };

  const handleShowDetails = async (user) => {
    try {
      const userDetails = await userService.getUserById(user.id);
      setSelectedUser(userDetails);
      setOpenModal("details");
    } catch (error) {
      setNotification({
        open: true,
        message: "Error al obtener los detalles del usuario",
        severity: "error",
      });
    }
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
      await userService.createUser(userData);
      // Recargar la lista de usuarios paginada despues de crear uno nuevo
      const response = await userService.getAllUsers();
      const paginatedUsers = response.data.slice(
        (page - 1) * rowsPerPage,
        page * rowsPerPage
      );
      setUsers(paginatedUsers);
      setTotalUsers(response.data.length);
      setNotification({
        open: true,
        message: "Usuario creado correctamente",
        severity: "success",
      });
    } catch (error) {
      console.error("Error al crear usuario:", error);
      setNotification({
        open: true,
        message: "Error al crear usuario",
        severity: "error",
      });
      throw error;
    }
  };

  return (
    <Box className="dashboard-page">
      {/* Header */}
      <Box className="dashboard-header">
        <Box sx={{ display: "flex", gap: 2 }}>
          {/* Icono de usuarios mas grande */}
          <People
            sx={{
              fontSize: "40px", // Tamaño aumentado
              color: "primary.main",
              backgroundColor: "rgba(25, 118, 210, 0.1)",
              borderRadius: "50%",
              padding: "8px", // padding aumentado para compensar el tamaño
              alignSelf: "center", // alineacion vertical
            }}
          />

          {/* titulos en columna */}
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

        {/* seccion derecha con avatar y boton */}
        <Box className="user-actions">
          <UserAvatar />
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

      {/* seccion de informacion y controles */}
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
              <TableCell>ESTADO</TableCell>
              <TableCell>CREADO EN</TableCell>
              <TableCell>ACTUALIZADO EN</TableCell>
              <TableCell>CREADO POR</TableCell>
              <TableCell>ACTUALIZADO POR</TableCell>
              <TableCell>ACCIONES</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredUsers.map((user) => (
              <TableRow key={user.id}>
                <TableCell>
                  <Box className="user-cell">
                    <Avatar
                      sx={{ width: 40, height: 40 }}
                      src={
                        user.profilePictureLink
                          ? user.profilePictureLink
                          : undefined
                      }
                    >
                      {!user.profilePictureLink && user.username.charAt(0)}
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
                <TableCell>
                  <Chip
                    label={user.isActive ? "Activo" : "Inactivo"}
                    color={user.isActive ? "success" : "error"}
                    size="small"
                    sx={{ fontWeight: 500 }}
                  />
                </TableCell>
                <TableCell>
                  {user.createdAt
                    ? new Date(user.createdAt).toLocaleString()
                    : ""}
                </TableCell>
                <TableCell>
                  {user.updatedAt
                    ? new Date(user.updatedAt).toLocaleString()
                    : ""}
                </TableCell>
                <TableCell>{user.createdBy || "-"}</TableCell>
                <TableCell>{user.updatedBy || "-"}</TableCell>
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

      <Box sx={{ display: "flex", justifyContent: "center", mt: 2 }}>
        <Pagination
          count={Math.ceil(totalUsers / rowsPerPage)}
          page={page}
          onChange={(event, value) => setPage(value)}
          rowsPerPage={rowsPerPage}
          rowsPerPageOptions={[10, 20, 30]}
          sx={{ mt: 2 }}
        />
      </Box>

      {/* Menú contextual */}
      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleCloseMenu}
      >
        <MenuItem
          onClick={async () => {
            handleCloseMenu();
            // Usar el usuario seleccionado del menu
            await handleShowDetails(selectedUser);
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
        onSave={async () => {
          try {
            // Recargar la lista de usuarios paginada después de editar
            const response = await userService.getAllUsers();
            const paginatedUsers = response.data.slice(
              (page - 1) * rowsPerPage,
              page * rowsPerPage
            );
            setUsers(paginatedUsers);
            setTotalUsers(response.data.length);
            setNotification({
              open: true,
              message: "Usuario editado exitosamente!",
              severity: "success",
            });
            setOpenModal(null);
          } catch (error) {
            setNotification({
              open: true,
              message: "Error al actualizar usuario",
              severity: "error",
            });
          }
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
        onConfirm={async () => {
          try {
            await userService.deleteUser(selectedUser.id);

            // Recargar la lista de usuarios paginada después de eliminar
            const response = await userService.getAllUsers();
            const total = response.data.length;

            // Verificar si necesitamos cambiar de página
            const totalPages = Math.ceil(total / rowsPerPage);
            const currentPage =
              page > totalPages && totalPages > 0 ? totalPages : page;

            if (currentPage !== page) {
              setPage(currentPage);
            }

            const paginatedUsers = response.data.slice(
              (currentPage - 1) * rowsPerPage,
              currentPage * rowsPerPage
            );

            setUsers(paginatedUsers);
            setTotalUsers(total);
            setNotification({
              open: true,
              message: "Usuario eliminado exitosamente!",
              severity: "success",
            });
            setOpenModal(null);
          } catch (error) {
            setNotification({
              open: true,
              message: "Error al eliminar usuario",
              severity: "error",
            });
          }
        }}
        userName={selectedUser?.username || ""}
      />

      {/* Snackbar para notificaciones */}
      <Snackbar
        open={notification.open}
        autoHideDuration={3000}
        onClose={() => setNotification({ ...notification, open: false })}
        anchorOrigin={{ vertical: "bottom", horizontal: "left" }}
      >
        <Alert
          onClose={() => setNotification({ ...notification, open: false })}
          severity={notification.severity}
          sx={{ width: "100%" }}
        >
          {notification.message}
        </Alert>
      </Snackbar>
    </Box>
  );
}
