// AssistantsSettings.tsx
import { useState, useCallback } from "react";
import { Card, Stack, Table, TableBody, TableContainer, Typography, Tabs, Tab, alpha, Button } from "@mui/material";
import { useTable, TableHeadCustom, TableNoData, TableEmptyRows, TablePaginationCustom } from "src/components/table";
import Scrollbar from "src/components/scrollbar";
import Label from "src/components/label";
import Iconify from "@/components/iconify";
import AssistantTableRow from "./assistant-table-row";
import AddAssistantModal from "./add-assistant-modal";
import { useBoolean } from "@/hooks/use-boolean";
import { useGetAssistants } from "@/use-queries/user";
import { AssistantDTO } from "hvo-shared";

const TABLE_HEAD = [
  { id: "name", label: "Assistant", width: 240 },
  { id: "email", label: "E-Mail", width: 240 },
  { id: "permissions", label: "Permissions", width: 160 },
  { id: "actions", width: 88 },
];

const STATUS_OPTIONS = [{ value: "all", label: "All" }];

// In a real app, this would come from an API
const MOCK_ASSISTANTS = [
  {
    id: "1",
    firstName: "John",
    lastName: "Doe",
    email: "john.doe@example.com",
    permissions: "Full",
    photoUrl: "",
  },
  {
    id: "2",
    firstName: "Jane",
    lastName: "Smith",
    email: "jane.smith@example.com",
    permissions: "Full",
    photoUrl: "",
  },
];

export default function AssistantsSettings() {
  const isModalOpen = useBoolean();

  const table = useTable({ defaultDense: true });
  const [filters, setFilters] = useState({
    status: "all",
  });

  const handleFilterStatus = useCallback(
    (event: React.SyntheticEvent, newValue: string) => {
      setFilters((prevState) => ({
        ...prevState,
        status: newValue,
      }));
      table.onResetPage();
    },
    [table]
  );

  const denseHeight = table.dense ? 52 : 72;
  const currentPageData = MOCK_ASSISTANTS.slice(
    table.page * table.rowsPerPage,
    table.page * table.rowsPerPage + table.rowsPerPage
  );

  return (
    <Stack spacing={3}>
      <Stack direction="row" justifyContent="space-between">
        <Typography variant="h2" fontSize={28}>
          Assistants
        </Typography>

        <Button
          variant="contained"
          color="secondary"
          startIcon={<Iconify icon="mdi:plus" />}
          onClick={isModalOpen.onTrue}
        >
          Add Assistant
        </Button>
      </Stack>

      <Card>
        <Tabs
          value={filters.status}
          onChange={handleFilterStatus}
          sx={{
            px: 2.5,
            boxShadow: (theme) => `inset 0 -2px 0 0 ${alpha(theme.palette.grey[500], 0.08)}`,
          }}
        >
          {STATUS_OPTIONS.map((tab) => (
            <Tab
              key={tab.value}
              value={tab.value}
              label={tab.label}
              iconPosition="end"
              icon={
                <Label variant={(tab.value === filters.status && "filled") || "soft"} color="default">
                  {MOCK_ASSISTANTS.length}
                </Label>
              }
            />
          ))}
        </Tabs>

        <TableContainer sx={{ position: "relative", overflow: "unset" }}>
          <Scrollbar>
            <Table size={table.dense ? "small" : "medium"} sx={{ minWidth: 800 }}>
              <TableHeadCustom
                order={table.order}
                orderBy={table.orderBy}
                headLabel={TABLE_HEAD}
                rowCount={MOCK_ASSISTANTS.length}
                onSort={table.onSort}
                sx={{
                  "& .MuiTableCell-head": {
                    bgcolor: "transparent",
                  },
                }}
              />

              <TableBody>
                {currentPageData.map((row) => (
                  <AssistantTableRow key={row.id} row={row as unknown as AssistantDTO} dense={true} />
                ))}

                <TableEmptyRows height={denseHeight} emptyRows={0} />

                <TableNoData notFound={MOCK_ASSISTANTS.length === 0} />
              </TableBody>
            </Table>
          </Scrollbar>
        </TableContainer>

        <TablePaginationCustom
          count={MOCK_ASSISTANTS.length}
          page={table.page}
          rowsPerPage={table.rowsPerPage}
          onPageChange={table.onChangePage}
          onRowsPerPageChange={table.onChangeRowsPerPage}
          // dense={table.dense}
          // onChangeDense={table.onChangeDense}
        />
      </Card>

      <Stack alignItems="center" spacing={2} sx={{ mt: 5 }}>
        <Iconify
          icon="solar:lock-password-bold-duotone"
          width={180}
          sx={{
            color: "primary.main",
            opacity: 0.15,
          }}
        />
        <Typography
          variant="h3"
          sx={{
            color: "text.secondary",
            fontWeight: "normal",
            opacity: 0.3,
          }}
        >
          Permissions are coming soon
        </Typography>
      </Stack>
      {/* <AddAssistantModal open={isModalOpen.value} onClose={isModalOpen.onFalse} /> */}
    </Stack>
  );
}
