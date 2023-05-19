import { styled } from "@mui/material/styles";
import {
  Table,
  TableBody,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Box,
  TableCell,
  Button,
} from "@mui/material";
import { Padding } from "@mui/icons-material";

const StyledTableContainer = styled(TableContainer)({
  margin: "2rem auto",
  width: "80%",
});

const StyledTableHeader = styled(TableHead)({
  backgroundColor: "#000000",
});

const StyledTableCell = styled(TableCell)({
  color: "#FFFFFF",
});

const TableCommon = ({ columns, data }) => {
  return (
    <StyledTableContainer component={Paper}>
      <Box sx={{ overflowX: "auto", minWidth: "100%", paddingTop: "20px" }}>
        {/* <Button
          variant="contained"
          color="primary"
          sx={{ marginBottom: "15px", marginLeft: "15px" }}
        >
          Agregar Cliente
        </Button> */}
        <Table>
          <StyledTableHeader>
            <TableRow>
              {columns.map((column) => (
                <StyledTableCell key={column}>{column.name}</StyledTableCell>
              ))}
            </TableRow>
          </StyledTableHeader>
          <TableBody>
            {Array.isArray(data) &&
              data.map((row) => (
                <TableRow key={row.id}>
                  {columns.map((column) => (
                    <TableCell key={column.value}>
                      {column.render
                        ? column.render(row[column.value])
                        : row[column.value]}
                    </TableCell>
                  ))}
                </TableRow>
              ))}
          </TableBody>
        </Table>
      </Box>
    </StyledTableContainer>
  );
};

export default TableCommon;
