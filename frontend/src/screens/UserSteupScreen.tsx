import React, {useCallback, useContext, useEffect, useMemo, useState} from "react";
import VisitsCard from "./doctors-screens/Timetable/VisitsCard";
import {Dialog, DialogContent, DialogTitle, Typography, DialogActions} from "@mui/material";
import {Grid} from "@mui/material"
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import Link from "@mui/material/Link";
import Box from "@mui/material/Box";
import {animalsApi} from "../api/animals.api";
import {useNavigate} from "react-router";
import {UserContext} from "../context/UserContext";
import { userApi } from "../api/UserApi";
import { useSnackbar } from "notistack";


 const UserSetupScreen: React.FC = () => {

    const navigate = useNavigate();
    const [currentPassword, setCurrentPassword] = useState("");
    const [newPassword, setNewPassword] = useState("");
    const [formValid, setFormValid] = useState(false);
    const [deleteDialog, setDeleteDialogOpen] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [serverError, setServerError] = useState("");
    const {logOut} = useContext(UserContext);

    const {enqueueSnackbar} = useSnackbar();

    const handleAgree = () => {
        setDeleteDialogOpen(false)
        setIsLoading(true);
        animalsApi.deleteUser().then(
            () => {
                setIsLoading(false);
                logOut();
                navigate("/")
            }, () => {
                setIsLoading(false);
                setServerError("Wystąpił błąd, odśwież stronę i spróbuj jeszcze raz.")
            })
     }


    useEffect(() => {
        if(currentPassword !== "" && newPassword !== ""){
            setFormValid(true);
        }else {
            setFormValid(false);
        }
    }, [currentPassword, newPassword])


     const handleChangePassword = () => {
            userApi.changePassword(currentPassword, newPassword)
                .then(
                    () => {
                        enqueueSnackbar("Zmieniono hasło! Zaloguj się ponownie", { variant: "success", autoHideDuration: 5000} )
                        setCurrentPassword("")
                        setNewPassword("")
                        logOut();
                        navigate("/signIn");
                    },
                    () => enqueueSnackbar("Wystąpił błąd, sprawdź czy aktualne hasło jest prawidłowe",{variant: "error", autoHideDuration: 4000})
                )
     }


    return (
        <div style={{width: "68%", marginLeft: "25%", padding: "5%"}}>
            <Grid container style={{ marginBottom: "2%"}}>
                <Grid item xs={8}>
                    <Typography variant="h4">
                        Konto użytkownika
                    </Typography>
                </Grid>
                <Box component="form" sx={{mt: 1}}>
                    <TextField
                        margin="normal"
                        required
                        fullWidth
                        id="email"
                        label="Current Password"
                        type="password"
                        name="password"
                        value={currentPassword}
                        onChange={(e: any) => setCurrentPassword(e.target.value)}
                        autoFocus
                    />
                    <TextField
                        margin="normal"
                        required
                        fullWidth
                        name="password"
                        label="New Password"
                        type="password"
                        id="password"
                        value={newPassword}
                        onChange={(e: any) => setNewPassword(e.target.value)}
                        autoComplete="current-password"
                    />
                    <Button
                        type="button"
                        fullWidth
                        disabled={!formValid}
                        variant="contained"
                        sx={{mt: 3, mb: 2}}
                        onClick={handleChangePassword}
                    >
                        Change password
                    </Button>
                </Box>
           </Grid>
            <Grid container>
            <Grid item xs={2}>
                    <Typography variant="h5">
                        Usuń konto
                    </Typography>
                <Button
                        type="submit"
                        fullWidth
                        variant="contained"
                        color={"error"}
                        sx={{mt: 3, mb: 2}}
                        onClick={() => setDeleteDialogOpen(true)}
                    >
                        Usuń
                    </Button>
                </Grid>
                <Dialog open={deleteDialog} onClose={() => setDeleteDialogOpen(false)}>
                       <DialogTitle>Czy na pewno chcesz usunąć konto użytkownika? </DialogTitle>
                           <DialogContent>
                                 Twoje dane i historia wizyt zostanie utracona. Ta operacje nie może zostać odwrócona.
                            </DialogContent>
                    <DialogActions>
                          <Button onClick={() => setDeleteDialogOpen(false)}>Anuluj</Button>
                          <Button onClick={handleAgree} color={"error"} autoFocus>
                            Usuń
                          </Button>
                    </DialogActions>
                </Dialog>
         </Grid>
        </div>
    )
}

export default UserSetupScreen;
