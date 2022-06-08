import React, {useState} from 'react';
import './MyAnimalsList.css';
import {UserPet} from "../../../types/animals.types";
import {animalsApi} from "../../../api/animals.api";
import Typography from "@mui/material/Typography";
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Avatar from '@mui/material/Avatar';
import CardHeader from '@mui/material/CardHeader';
import IconButton from '@mui/material/IconButton';
import DeleteIcon from '@mui/icons-material/Delete';
import PetsIcon from '@mui/icons-material/Pets';
import LinearProgress from '@mui/material/LinearProgress';
import Box from '@mui/material/Box';
import {
    Button,
    Dialog,
    DialogActions,
    DialogContent, DialogContentText,
    DialogTitle,
} from "@mui/material";

interface props {
    userAnimals: UserPet[];
    getAnimalsList: Function;
}

const MyAnimalsList: React.FC<props> = ({userAnimals, getAnimalsList}) => {
    const [open, setOpen] = React.useState(false);
    const [deleteAnimalId, setDeleteAnimalId] = React.useState(-1);
    const [serverError, setServerError] = useState("");
    const [isLoading, setIsLoading] = useState(false);

    const handleClickOpen = (id: number) => {
        setOpen(true);
        setServerError("")
        setDeleteAnimalId(id);
    };

    const handleClose = () => {
        setOpen(false);
        setDeleteAnimalId(-1);
        setServerError("")
    };

    const handleDelete = () => {
        setIsLoading(true);
        animalsApi.deletePet(deleteAnimalId).then(
            () => {
                getAnimalsList();
                setOpen(false);
                setDeleteAnimalId(-1);
                setServerError("")
                setIsLoading(false);
            }, () => {
                setIsLoading(false);
                setServerError("Wystąpił błąd, odśwież stronę i spróbuj jeszcze raz.")
            })
    };

    const trimDate = (date: string): string => {
        return date.split('T')[0];
    }

    return (
        <div className="user-animals">
            {
                userAnimals.length === 0 &&
                <div className="user-animals__no-animals">
                    <Typography paragraph gutterBottom component="div">
                        Dodaj nowego zwierzaka!
                    </Typography>
                </div>
            }

            {
                userAnimals.map(({id, name, species, additionalSpecies, race, weight, height, dateOfBirth}) => (
                    <Card key={id} className="animals-list">
                        <CardHeader
                            avatar={
                                <Avatar sx={{bgcolor: '#2666ab'}} aria-label="avatar">
                                    <PetsIcon/>
                                </Avatar>
                            }
                            action={
                                <IconButton aria-label="settings" onClick={() => handleClickOpen(id)}>
                                    <DeleteIcon/>
                                </IconButton>
                            }
                            title={
                                <Typography variant="h5">
                                    {name}
                                </Typography>
                            }
                        />
                        <CardContent style={{marginTop: 0, paddingTop: 0}}>
                            <Typography color="text.secondary">
                                {species} {additionalSpecies} {race}
                            </Typography>
                            <Typography color="text.secondary">
                                {weight} kg - {height} cm
                            </Typography>
                            <Typography color="text.secondary">
                                {trimDate(dateOfBirth)}
                            </Typography>
                        </CardContent>
                    </Card>
                ))
            }

            <Dialog open={open} onClose={handleClose}>
                {isLoading && <Box sx={{width: '100%'}}>
                    <LinearProgress/>
                </Box>}

                <DialogTitle id="alert-dialog-title">
                    {"Czy chcesz usunąć swoje zwierzę?"}
                </DialogTitle>
                <DialogContent>
                    <DialogContentText id="alert-dialog-description">
                        Usuniętego zwierzęcia nie będzie się dało przywrócić!
                    </DialogContentText>

                    <Typography color="red" gutterBottom component="p">
                        {serverError}
                    </Typography>
                </DialogContent>

                <DialogActions>
                    <Button onClick={handleClose} autoFocus>Anuluj</Button>
                    <Button onClick={handleDelete} variant="contained" color="warning">
                        Usuń
                    </Button>
                </DialogActions>
            </Dialog>
        </div>
    )
}

export default MyAnimalsList;

