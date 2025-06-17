// AssistantsSettings.tsx
import { useState, useCallback } from "react";
import {
  Card,
  Stack,
  Table,
  TableBody,
  TableContainer,
  Typography,
  Tabs,
  Tab,
  alpha,
  Button,
  Box,
  Divider,
} from "@mui/material";
import {
  useTable,
  TableHeadCustom,
  TableNoData,
  TableEmptyRows,
  TablePaginationCustom,
  TableLoading,
} from "src/components/table";
import Scrollbar from "src/components/scrollbar";
import Label from "src/components/label";
import Iconify from "@/components/iconify";
import AssistantTableRow from "./assistant-table-row";
import AddAssistantModal from "./add-assistant-modal";
import { useBoolean } from "@/hooks/use-boolean";
import { useGetAssistants } from "@/use-queries/user";
import SvgColor from "@/components/svg-color";
import Image from "@/components/image";
import { CustomChip } from "@/components/custom-chip";
import RowItem from "./row-item";

const TABLE_HEAD = [
  { id: "name", label: "Assistant", width: 240 },
  { id: "email", label: "E-Mail", width: 240 },
  { id: "permissions", label: "Permissions", width: 160 },
  { id: "actions", width: 88 },
];

const STATUS_OPTIONS = [{ value: "all", label: "All" }];

export default function AssistantsSettings() {
  const isModalOpen = useBoolean();
  const { assistants, isLoading, refetch } = useGetAssistants();

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
  const currentPageData =
    assistants?.slice(
      table.page * table.rowsPerPage,
      table.page * table.rowsPerPage + table.rowsPerPage
    ) || [];

  return (
    <Stack p={2}>
      {/* Header */}
      <Stack
        height={48}
        direction="row"
        justifyContent="space-between"
        pl={1.5}
        display="flex"
      >
        <Stack direction="row" alignItems="center">
          <Stack width={245} direction="row" alignItems="center" spacing={0.5}>
            <Typography fontSize={16} fontWeight={600}>
              Assistants
            </Typography>
            <CustomChip wrapperSx={{ px: 1, py: "3px" }}>
              {assistants?.length || 0}
            </CustomChip>
          </Stack>
          <Box width={245}>
            <Typography fontSize={16} fontWeight={600}>
              E-mail
            </Typography>
          </Box>
          <Box width={245}>
            <Typography fontSize={16} fontWeight={600}>
              Permissions
            </Typography>
          </Box>
        </Stack>
        <Stack direction="row">
          <Box width={245} display="flex" justifyContent="flex-end">
            <Button
              variant="outlined"
              startIcon={<Iconify icon="mdi:plus" />}
              onClick={isModalOpen.onTrue}
              sx={{ height: 40 }}
            >
              Add Assistant
            </Button>
          </Box>
        </Stack>
      </Stack>
      {/* Assistants List */}
      <Stack divider={<Divider />}>
        {assistants?.map((assistant) => (
          <RowItem
            key={assistant.id}
            item={assistant}
            onDeleteSuccess={refetch}
          />
        ))}
      </Stack>
      <Divider />

      <AddAssistantModal
        open={isModalOpen.value}
        onClose={() => {
          isModalOpen.onFalse();
        }}
        onCreateSuccess={refetch}
      />
    </Stack>
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
            boxShadow: (theme) =>
              `inset 0 -2px 0 0 ${alpha(theme.palette.grey[500], 0.08)}`,
          }}
        >
          {STATUS_OPTIONS.map((tab) => (
            <Tab
              key={tab.value}
              value={tab.value}
              label={tab.label}
              iconPosition="end"
              icon={
                <Label
                  variant={(tab.value === filters.status && "filled") || "soft"}
                  color="default"
                >
                  {assistants?.length || 0}
                </Label>
              }
            />
          ))}
        </Tabs>

        <TableContainer sx={{ position: "relative", overflow: "unset" }}>
          <Scrollbar>
            <Table
              size={table.dense ? "small" : "medium"}
              sx={{ minWidth: 800 }}
            >
              <TableHeadCustom
                order={table.order}
                orderBy={table.orderBy}
                headLabel={TABLE_HEAD}
                rowCount={assistants?.length || 0}
                onSort={table.onSort}
                sx={{
                  "& .MuiTableCell-head": {
                    bgcolor: "transparent",
                  },
                }}
              />

              <TableBody>
                {isLoading ? (
                  <Box sx={{ width: "100%", height: 180 }}>
                    <TableLoading />
                  </Box>
                ) : (
                  <>
                    {currentPageData.map((row) => (
                      <AssistantTableRow
                        key={row.id}
                        row={row}
                        dense={table.dense}
                        onDeleteSuccess={refetch}
                      />
                    ))}

                    <TableEmptyRows height={denseHeight} emptyRows={0} />

                    <TableNoData notFound={!isLoading && !assistants?.length} />
                  </>
                )}
              </TableBody>
            </Table>
          </Scrollbar>
        </TableContainer>

        <TablePaginationCustom
          count={assistants?.length || 0}
          page={table.page}
          rowsPerPage={table.rowsPerPage}
          onPageChange={table.onChangePage}
          onRowsPerPageChange={table.onChangeRowsPerPage}
        />
      </Card>

      <Stack alignItems="center" spacing={2} sx={{ mt: 5 }}>
        {/* <Iconify
          icon="solar:lock-password-bold-duotone"
          width={180}
          sx={{
            color: "primary.main",
            opacity: 0.15,
          }}
        /> */}
        <Image
          src="/assets/illustrations/illustration-maintenance.png"
          width={335 / 1.5}
          height={270 / 1.5}
        />
        <Typography
          variant="h4"
          sx={{
            color: "text.secondary",
            fontWeight: "normal",
            opacity: 0.3,
          }}
        >
          Permissions are coming soon
        </Typography>
      </Stack>

      <AddAssistantModal
        open={isModalOpen.value}
        onClose={() => {
          isModalOpen.onFalse();
        }}
        onCreateSuccess={refetch}
      />
    </Stack>
  );
}
