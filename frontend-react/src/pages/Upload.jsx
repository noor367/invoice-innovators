import React, { useState } from 'react';
import {
  Container,
  Typography,
  FormControl,
  Select,
  Button,
  MenuItem,
  TextField,
  Box,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  FormLabel,
  Stack,
  IconButton,
  LinearProgress
} from '@mui/material';
import NavBar from "./Header";
import { renderXML, validateXML } from "../utils/render";
import ErrorModal from "../utils/Error";
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { useNavigate } from "react-router-dom";
import {xmlFromCSV} from "../utils/helpers";

const UploadPage = () => {
  const [outputType, setOutputType] = useState('pdf');
  const [lang, setLang] = useState('english');
  const [invoiceLink, setInvoiceLink] = useState('');
  const [openModal, setOpenModal] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false); // New state for loading indication
  const navigate = useNavigate();

  const handleFile = (event) => {
    setOutputType(event.target.value);
  };

  const handleLang = (event) => {
    setLang(event.target.value);
  };

  const handleCloseModal = () => {
    setOpenModal(false);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setLoading(true); // Set loading state to true when submitting
    try {
      let xmlFile = event.target.elements['upload-file'].files[0];

      // Check if the file is a CSV
      if (xmlFile.type === 'text/csv' || xmlFile.name.endsWith('.csv')) {
        const response = await xmlFromCSV(xmlFile);
        xmlFile = response;
      } else if (xmlFile.type !== 'xml' && !xmlFile.name.endsWith('.xml')) {
        setError('File Upload Must be XML or CSV');
        return;
      }

      const valid = await validateXML(xmlFile);
      if (!valid.successful) {
        setError('XML file is invalid');
      } else {
        const response = await renderXML(xmlFile, outputType, lang);
        if (response.invoiceLink) {
          setInvoiceLink(response.invoiceLink);
          setOpenModal(true);
        }
      }

    } catch (error) {
      console.error('Error rendering file:', error);
    } finally {
      setLoading(false); // Set loading state back to false after submission
    }
  };

  const handleCopyLink = () => {
    navigator.clipboard.writeText(invoiceLink);
    // You can provide feedback to the user here, e.g., using a snackbar
  };

  const closeError = () => {
    setError('');
  };

  const handleBack = () => {
    navigate('/dashboard');
  };

  return (
    <Container maxWidth="none" disableGutters>
      <NavBar />
      <Container maxWidth="sm">
        <Stack pt={2} direction="row" alignItems="center" justifyContent="space-between">
          <IconButton
            color="primary"
            startIcon={<ArrowBackIcon />}
            onClick={handleBack}
          >
            <ArrowBackIcon />
          </IconButton>
          <Box textAlign="center" flexGrow={1}>
            <Typography variant="h3" gutterBottom>Upload Invoice</Typography>
          </Box>
        </Stack>
        {error && <ErrorModal message={error} onClose={closeError} />}
        <form onSubmit={handleSubmit}>
          <FormControl fullWidth margin="normal">
            <Typography variant="h5" gutterBottom>Upload File (.xml OR .csv) *</Typography>
            <TextField required type="file" name="upload-file" />
          </FormControl>
          <FormControl fullWidth margin="normal">
            <Typography variant="h6">How Would You Like Your Invoice Rendered? *</Typography>
            <FormLabel>Output File</FormLabel>
            <Select
              required
              value={outputType}
              onChange={handleFile}
            >
              <MenuItem value={'html'}>html</MenuItem>
              <MenuItem value={'pdf'}>pdf</MenuItem>
              <MenuItem value={'json'}>json</MenuItem>
              <MenuItem value={'png'}>png</MenuItem>
            </Select>
          </FormControl>
          <FormControl fullWidth margin="normal">
            <Typography variant="h6">How Would You Like Your Invoice Translated? *</Typography>
            <FormLabel>Output Language</FormLabel>
            <Select
              required
              labelId="render-lan-label"
              id="render-lan"
              defaultValue="english"
              value={lang}
              onChange={handleLang}
            >
              <MenuItem value="arabic">Arabic</MenuItem>
              <MenuItem value="chinese">Chinese</MenuItem>
              <MenuItem value="english">English</MenuItem>
              <MenuItem value="french">French</MenuItem>
              <MenuItem value="german">German</MenuItem>
              <MenuItem value="hindi">Hindi</MenuItem>
              <MenuItem value="italian">Italian</MenuItem>
              <MenuItem value="japanese">Japanese</MenuItem>
              <MenuItem value="spanish">Spanish</MenuItem>
              <MenuItem value="vietnamese">Vietnamese</MenuItem>
            </Select>
          </FormControl>
          <Stack mt={5} mb={5}>
            <Button
              type="submit"
              variant="contained"
              color="primary"
              fullWidth
              sx={{ height: '60px', fontSize: '20px', position: 'relative' }}
            >
              {loading && <LinearProgress sx={{ position: 'absolute', top: 0, left: 0, width: '100%' }} />}
              {loading ? 'Rendering...' : 'Render Invoice'}
            </Button>
          </Stack>
        </form>
      </Container>
      <Dialog open={openModal} onClose={handleCloseModal}>
        <DialogTitle>Invoice Link</DialogTitle>
        <DialogContent>
          <TextField
            fullWidth
            variant="outlined"
            value={invoiceLink}
            InputProps={{
              readOnly: true,
            }}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCopyLink} color="primary">Copy Link</Button>
          <Button onClick={handleCloseModal} color="primary">Close</Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default UploadPage;
