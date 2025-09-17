import React, { useEffect, useState } from "react";
import {
  Avatar, Box, Button, Card, CardActions, CardContent, CardHeader, Chip,
  CircularProgress, Dialog, DialogActions, DialogContent, DialogTitle, Divider, Grid,
  IconButton, Snackbar, Alert, TextField, Tooltip, Typography, useTheme, Paper,
} from "@mui/material";
import { deepPurple } from "@mui/material/colors";
import { Edit, Save, Key, Delete, RefreshCcw, Mail } from "lucide-react";
import { useNavigate } from "react-router-dom";

interface UserProfile {
  firstName: string;
  lastName: string;
  email: string;
  rememberMe?: boolean;
  createdAt?: string;
  lastLogin?: string;
}

const initials = (firstName?: string, lastName?: string) =>
  `${(firstName?.[0] || "").toUpperCase()}${(lastName?.[0] || "").toUpperCase()}`;

const fmt = (d?: string) => (d ? new Date(d).toLocaleString() : "—");

const API_BASE = process.env.REACT_APP_API_BASE || "http://localhost:5000/api";
const AUTH_TOKEN_KEY = "authToken";

const Profile: React.FC = () => {
  const theme = useTheme();
  const navigate = useNavigate();

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [editing, setEditing] = useState(false);

  const [user, setUser] = useState<UserProfile | null>(null);
  const [draft, setDraft] = useState<UserProfile | null>(null);

  // token in state so it can react to changes
  const [token, setToken] = useState<string | null>(() => localStorage.getItem(AUTH_TOKEN_KEY));

  // Redirect if missing token
  useEffect(() => {
    if (!token) navigate("/auth");
  }, [token, navigate]);

  const fetchMe = async () => {
    if (!token) return;
    try {
      setLoading(true);
      setError(null);
      const res = await fetch(`${API_BASE}/auth/me`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.status === 404) {
        throw new Error("Profile endpoint not found. Did you add /api/auth/me on the server?");
      }
      const data = await res.json();
      if (!res.ok) throw new Error(data?.message || "Failed to load profile");

      const u: UserProfile = data.user || data;
      setUser(u);
      setDraft(u);
    } catch (err: any) {
      setError(err.message || "Could not fetch profile");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMe();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [token]);

  const onChange = (field: keyof UserProfile) =>
    (e: React.ChangeEvent<HTMLInputElement>) =>
      setDraft((prev) => (prev ? { ...prev, [field]: e.target.value } : prev));

  const handleSave = async () => {
    if (!token || !draft) return;
    try {
      setSaving(true);
      setError(null);
      const res = await fetch(`${API_BASE}/users/me`, {
        method: "PUT",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify({
          firstName: draft.firstName,
          lastName: draft.lastName,
          email: draft.email, // allow if BE permits
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data?.message || "Failed to update profile");
      setUser(draft);
      setSuccess("Profile updated");
      setEditing(false);
    } catch (err: any) {
      setError(err.message || "Update failed");
    } finally {
      setSaving(false);
    }
  };

  // Change Password
  const [pwOpen, setPwOpen] = useState(false);
  const [pwForm, setPwForm] = useState({ currentPassword: "", newPassword: "" });

  const submitPassword = async () => {
    if (!token) return;
    try {
      const res = await fetch(`${API_BASE}/auth/change-password`, {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify(pwForm),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data?.message || "Password change failed");
      setSuccess("Password updated");
      setPwOpen(false);
      setPwForm({ currentPassword: "", newPassword: "" });
    } catch (err: any) {
      setError(err.message || "Password update failed");
    }
  };

  // Delete Account
  const [delOpen, setDelOpen] = useState(false);
  const confirmDelete = async () => {
    if (!token) return;
    try {
      const res = await fetch(`${API_BASE}/users/me`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data?.message || "Delete failed");
      }
      localStorage.removeItem(AUTH_TOKEN_KEY);
      setToken(null);
      navigate("/");
    } catch (err: any) {
      setError(err.message || "Account deletion failed");
    }
  };

  const gradientBg = `linear-gradient(135deg, ${theme.palette.mode === "dark" ? "#1f2937" : "#e3f2fd"} 0%, ${theme.palette.mode === "dark" ? "#111827" : "#f3e8ff"} 100%)`;

  return (
    <Box sx={{ minHeight: "100vh", bgcolor: theme.palette.background.default }}>
      {/* Header / Cover */}
      <Box sx={{ px: { xs: 2, sm: 4 }, py: { xs: 3, sm: 6 }, background: gradientBg, borderBottom: `1px solid ${theme.palette.divider}` }}>
        <Box display="flex" alignItems="center" gap={2}>
          <Avatar sx={{ bgcolor: deepPurple[500], width: 64, height: 64 }}>
            {initials(user?.firstName, user?.lastName) || "?"}
          </Avatar>
          <Box>
            <Typography variant="h5" fontWeight={700}>
              {user ? `${user.firstName} ${user.lastName}` : "Your Profile"}
            </Typography>
            <Box display="flex" alignItems="center" gap={1}>
              <Mail size={16} />
              <Typography variant="body2" color="text.secondary">
                {user?.email || "—"}
              </Typography>
              {user?.rememberMe !== undefined && (
                <Chip size="small" label={user.rememberMe ? "Remembered" : "Session"} />
              )}
            </Box>
          </Box>
          <Box sx={{ flexGrow: 1 }} />
        </Box>
      </Box>

      {/* Body */}
      <Box sx={{ px: { xs: 2, sm: 4 }, py: { xs: 3, sm: 4 } }}>
        <Grid container spacing={3}>
          {/* Left: Details */}
          <Grid item xs={12} md={7}>
            <Card variant="outlined" sx={{ borderRadius: 3 }}>
              <CardHeader
                title={
                  <Box display="flex" alignItems="center" gap={1}>
                    <Typography variant="h6">Personal Details</Typography>
                    <Chip size="small" label={editing ? "Editing" : "Read-only"} />
                  </Box>
                }
                action={
                  editing ? (
                    <Box>
                      <Tooltip title="Save">
                        <span>
                          <IconButton onClick={handleSave} disabled={saving}>
                            {saving ? <CircularProgress size={20} /> : <Save />}
                          </IconButton>
                        </span>
                      </Tooltip>
                      <Tooltip title="Cancel">
                        <IconButton onClick={() => { setEditing(false); setDraft(user); }}>
                          <RefreshCcw />
                        </IconButton>
                      </Tooltip>
                    </Box>
                  ) : (
                    <Tooltip title="Edit">
                      <IconButton onClick={() => setEditing(true)}>
                        <Edit />
                      </IconButton>
                    </Tooltip>
                  )
                }
              />
              <Divider />
              <CardContent>
                {loading ? (
                  <Box display="flex" justifyContent="center" py={6}>
                    <CircularProgress />
                  </Box>
                ) : (
                  <Grid container spacing={2}>
                    <Grid item xs={12} sm={6}>
                      <TextField
                        label="First Name"
                        fullWidth
                        value={draft?.firstName || ""}
                        onChange={onChange("firstName")}
                        disabled={!editing}
                      />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <TextField
                        label="Last Name"
                        fullWidth
                        value={draft?.lastName || ""}
                        onChange={onChange("lastName")}
                        disabled={!editing}
                      />
                    </Grid>
                    <Grid item xs={12}>
                      <TextField
                        label="Email"
                        type="email"
                        fullWidth
                        value={draft?.email || ""}
                        onChange={onChange("email")}
                        disabled={!editing}
                        helperText={!editing ? "Contact support to change email if disabled." : ""}
                      />
                    </Grid>
                  </Grid>
                )}
              </CardContent>
              {!loading && (
                <CardActions sx={{ justifyContent: "flex-end", px: 3, pb: 3 }}>
                  <Button variant="outlined" startIcon={<Key />} onClick={() => setPwOpen(true)}>
                    Change Password
                  </Button>
                </CardActions>
              )}
            </Card>
          </Grid>

          {/* Right: Meta / Security */}
          <Grid item xs={12} md={5}>
            <Paper variant="outlined" sx={{ p: 3, borderRadius: 3 }}>
              <Typography variant="subtitle1" fontWeight={700} gutterBottom>
                Account Status
              </Typography>
              <Box display="grid" gridTemplateColumns={{ xs: "1fr", sm: "160px 1fr" }} rowGap={1.5} columnGap={2}>
                <Typography color="text.secondary">Member since</Typography>
                <Typography>{fmt(user?.createdAt)}</Typography>
                <Typography color="text.secondary">Last login</Typography>
                <Typography>{fmt(user?.lastLogin)}</Typography>
                <Typography color="text.secondary">Auth mode</Typography>
                <Typography>{user?.rememberMe ? "Persistent" : "Session"}</Typography>
              </Box>
              <Divider sx={{ my: 2 }} />
              <Box display="flex" gap={1}>
                <Button fullWidth variant="outlined" onClick={fetchMe}>Refresh</Button>
                <Button fullWidth color="error" variant="contained" startIcon={<Delete />} onClick={() => setDelOpen(true)}>
                  Delete Account
                </Button>
              </Box>
            </Paper>
          </Grid>
        </Grid>
      </Box>

      {/* Change Password */}
      <Dialog open={pwOpen} onClose={() => setPwOpen(false)} maxWidth="xs" fullWidth>
        <DialogTitle>Change Password</DialogTitle>
        <DialogContent>
          <TextField
            label="Current Password"
            type="password"
            fullWidth
            margin="normal"
            value={pwForm.currentPassword}
            onChange={(e) => setPwForm({ ...pwForm, currentPassword: e.target.value })}
          />
          <TextField
            label="New Password"
            type="password"
            fullWidth
            margin="normal"
            value={pwForm.newPassword}
            onChange={(e) => setPwForm({ ...pwForm, newPassword: e.target.value })}
            helperText="Use at least 8 characters with a mix of letters and numbers."
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setPwOpen(false)}>Cancel</Button>
          <Button variant="contained" onClick={submitPassword}>Update</Button>
        </DialogActions>
      </Dialog>

      {/* Delete Account */}
      <Dialog open={delOpen} onClose={() => setDelOpen(false)} maxWidth="xs" fullWidth>
        <DialogTitle>Delete Account</DialogTitle>
        <DialogContent>
          <Typography>This action is irreversible. Your account and related data will be permanently removed.</Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDelOpen(false)}>Cancel</Button>
          <Button color="error" variant="contained" onClick={confirmDelete}>Delete</Button>
        </DialogActions>
      </Dialog>

      {/* Notifications */}
      <Snackbar open={!!error} autoHideDuration={6000} onClose={() => setError(null)}>
        <Alert severity="error" onClose={() => setError(null)}>{error}</Alert>
      </Snackbar>
      <Snackbar open={!!success} autoHideDuration={4000} onClose={() => setSuccess(null)}>
        <Alert severity="success" onClose={() => setSuccess(null)}>{success}</Alert>
      </Snackbar>
    </Box>
  );
};

export default Profile;
