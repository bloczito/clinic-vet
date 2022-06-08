import {AppBar, Button, Grid, Toolbar, useTheme} from '@mui/material';
import React, {useContext, useEffect, useState} from 'react';
import {Link as RouterLink} from 'react-router-dom';
import './Navbar.css';
import Typography from "@mui/material/Typography";
import axios from "axios";
import {useNavigate} from "react-router";
import {UserContext} from "../../context/UserContext";

export default function Navbar() {
    const theme = useTheme();
    const {logOut, token} = useContext(UserContext)
    const navigate = useNavigate();
    const {isDoctor} = useContext(UserContext)

    const handleLogoutClick = (event: any) => {
        event.preventDefault();
        axios.post('/logout/').then(() => {
            logOut()
        });
    }

    const handleNavigate = (link: string) => {
        navigate(link);
    }

    const handleUserAccount = () => {
        navigate('/dashboard/user-setup');
    }

    return (
        <>
            <AppBar
                sx={{zIndex: theme.zIndex.drawer + 1, marginBottom: 3}}
                elevation={0}
                position="sticky"
            >
                <Toolbar>
                    <Grid container justifyContent="space-between">
                        <Typography>
                            <RouterLink className="nav__container-logo" to="/"> Clinic Vet </RouterLink>
                        </Typography>

                        {token ? (
                                <Grid>
                                    <Button
                                        onClick={isDoctor ? () => handleNavigate("/dashboard/doc-timetable") : () => handleNavigate("/dashboard/animals")}
                                        variant="outlined"
                                        color="inherit"
                                        sx={{marginRight: 5}}>
                                        Panel użytkownika
                                    </Button>
                                    <Button
                                        onClick={handleUserAccount}
                                        variant="outlined"
                                        color="inherit"
                                        sx={{marginRight: 5}}>
                                        Konto użytkownika
                                    </Button>
                                    <Button
                                        onClick={handleLogoutClick}
                                        variant="outlined"
                                        color="inherit">
                                        Wyloguj
                                    </Button>
                                </Grid>
                        ) : (
                            <Grid>
                                <Button variant="outlined" component={RouterLink} to={"/signIn"} color="inherit"
                                        sx={{marginRight: 5}}>
                                    Zaloguj
                                </Button>
                                <Button variant="outlined" component={RouterLink} to="/signUp" color="inherit">
                                    Załóż konto
                                </Button>
                            </Grid>
                        )}
                    </Grid>
                </Toolbar>
            </AppBar>
        </>
    )
}

