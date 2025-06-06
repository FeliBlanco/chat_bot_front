import { useEffect, useState } from 'react';
import { Box, Paper, TextField, IconButton, Typography, Stack, Select, MenuItem, Button } from '@mui/material';
import SendIcon from '@mui/icons-material/Send';
import axios from 'axios';

function App() {

    const [messages, setMessages] = useState([
        { text: "¡Hola! ¿En qué puedo ayudarte?", isBot: true },
    ]);
    const [input, setInput] = useState('');
    const [getModel, setModel] = useState('');
    const [getMode, setMode] = useState('');

    useEffect(() => {
        (async () => {

            try {
                const response = await axios.get(`${import.meta.env.VITE_API_URL}modelo`)
                const data = response.data
                setModel(i => data.modelo);
                setMode(i => data.mode);
                console.log(data)
            }
            catch(err) {
            }
        })()

    }, [])

    const handleSend = async () => {
        if(input.trim()) {
            setMessages([...messages, { text: input, isBot: false }]);
            setInput('');
            try {
                const response = await axios.post(`${import.meta.env.VITE_API_URL}`, {
                    prompt: input
                })
                if(typeof response.data == "string") {
                    setMessages(prev => [...prev, { text: response.data, isBot: true }]);
                }
            }
            catch(err) {
                alert("Error")
                console.log(err)
            }
        }
    }

    const changeModel = async () => {
        try {
            const response = await axios.post(`${import.meta.env.VITE_API_URL}modelo`, {
                modelo: getModel,
                mode: getMode
            })
            console.log(response.data)
            alert("Modelo cambiado!")
        }
        catch(err) {
            alert("Error")
            console.log(err)
        }
    }
  return (
        <Box sx={{
            height: '100vh',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            bgcolor: '#f5f5f5',
            gap:'20px'
        }}>
            <Paper elevation={3} sx={{
                width: '20%',
                p:3
            }}>
                <Box sx={{
                    display: 'flex',
                    flexDirection: 'column',
                    overflow: 'hidden'                   
                }}>
                    <Typography variant="h6" sx={{ mb: 2 }}>Configuración</Typography>
                    <Select size="small" value={getMode} onChange={(e) => setMode(e.target.value)} sx={{ mb: 2 }}>
                        <MenuItem value="asistente">Asistente de tienda</MenuItem>
                        <MenuItem value="chat">Chat normal</MenuItem>
                    </Select>
                    <Select size="small" value={getModel} onChange={(e) => setModel(e.target.value)} sx={{ mb: 2 }}>
                        <MenuItem value="gpt-3.5-turbo">gpt-3.5-turbo</MenuItem>
                        <MenuItem value="gpt-4.1">gpt-4.1</MenuItem>
                        <MenuItem value="o3-mini">o3-mini</MenuItem>
                    </Select>
                    <Button onClick={changeModel}>Guardar</Button>
                </Box>
            </Paper>
            <Paper elevation={3} sx={{
                width: '80%',
                maxWidth: 600,
                height: '70vh',
                display: 'flex',
                flexDirection: 'column',
                overflow: 'hidden'
            }}>
                <Box sx={{
                    flex: 1,
                    overflow: 'auto',
                    p: 2,
                    bgcolor: '#fff'
                }}>
                    <Stack spacing={1}>
                        {messages.map((message, index) => (
                            <Box
                                key={index}
                                sx={{
                                display: 'flex',
                                justifyContent: message.isBot ? 'flex-start' : 'flex-end'
                                }}
                            >
                                <Paper
                                    elevation={1}
                                    sx={{
                                        p: 1,
                                        maxWidth: '70%',
                                        bgcolor: message.isBot ? '#f5f5f5' : '#1976d2',
                                        color: message.isBot ? 'black' : 'white'
                                    }}
                                >
                                    <Typography>{message.text}</Typography>
                                </Paper>
                            </Box>
                        ))}
                    </Stack>
                </Box>
                <Box sx={{
                    p: 2,
                    bgcolor: '#f8f8f8',
                    borderTop: '1px solid #ddd',
                    display: 'flex',
                    gap: 1
                }}>
                    <TextField
                        fullWidth
                        variant="outlined"
                        size="small"
                        placeholder="Escribe un mensaje..."
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        onKeyPress={(e) => e.key === 'Enter' && handleSend()}
                    />
                    <IconButton 
                        color="primary"
                        onClick={handleSend}
                        disabled={!input.trim()}
                    >
                        <SendIcon />
                    </IconButton>
                </Box>
            </Paper>
        </Box>
    );
}

export default App;
