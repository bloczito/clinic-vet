import React, {useCallback, useEffect, useMemo, useState} from "react";
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import {Dialog, DialogContent, DialogTitle, Grid, TextField} from "@mui/material";


interface CardInfo{
    visit_date: string,
    petName: string,
    isDoctor: boolean,
    note: string,
}

const VisitsCard: (props: CardInfo) => JSX.Element = (props: CardInfo) => {

    const [seeNoteDialogOpen, setSeeNoteDialogOpen] = useState<boolean>(false);
    const [addDialogNoteOpen, setAddNoteDialogOpen] = useState<boolean>(false);

    return (
        <Box sx={{ minWidth: 275 }}>
          <Card variant="outlined">
                <CardContent>
                    <Grid container
                          direction="row"
                          justifyContent="center"
                          alignItems="center"
                    >
                      <Grid item xs={10}>
                          <Typography sx={{ fontSize: 14 }} color="text.secondary" gutterBottom>
                              {props.visit_date}
                          </Typography>
                          <Typography variant="h5" component="div">
                              <b>{props.petName}</b>
                          </Typography>
                          <Typography sx={{ mb: 1.5 }} color="text.secondary">

                          </Typography>
                          <Typography variant="body2">
                              <b>Room No: </b>23
                          </Typography>
                      </Grid>
                      <Grid item xs={2}>
                        <CardActions>
                            {props.note.length > 0 ?
                                <Button size="small" onClick={() => setSeeNoteDialogOpen(true)}>Zobacz notatkę</Button>
                                :
                                <Button size="small" onClick={() => setAddNoteDialogOpen(true)}>Dodaj notatkę</Button>
                            }
                        </CardActions>
                      </Grid>
                  </Grid>
                </CardContent>
              <Dialog open={seeNoteDialogOpen} onClose={() => setSeeNoteDialogOpen(false)}>
                                    <DialogTitle>Notatka pozostawiona przez lekarza po spotkaniu</DialogTitle>
                                        <DialogContent>
                                            {props.note}
                                        </DialogContent>
                </Dialog>
              <Dialog open={addDialogNoteOpen} onClose={() => setAddNoteDialogOpen(false)}>
                                    <DialogTitle>Notatka pozostawiona przez lekarza po spotkaniu</DialogTitle>
                                        <DialogContent>
                                            <TextField fullWidth label="Notatka" />
                                            <Button size="small" onClick={() => setAddNoteDialogOpen(false)}>Anuluj</Button>
                                            <Button size="small" >Dodaj</Button>
                                        </DialogContent>
                </Dialog>
          </Card>
    </Box>
    )
}

export default VisitsCard;
