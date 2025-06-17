import { updateTaskStaff } from "@/apis/task";
import Iconify from "@/components/iconify";
import { select } from "@/theme/overrides/components/select";
import { useGetStaffByTaskId } from "@/use-queries/staff";
import {
  Avatar,
  Box,
  Checkbox,
  Chip,
  IconButton,
  ListItemText,
  MenuItem,
  Select,
  Stack,
  Typography,
} from "@mui/material";
import { SelectStaffDTO, UpdateTaskStaffDTO } from "hvo-shared";
import { isEmpty } from "lodash";
import { useEffect, useState } from "react";

type Props = {
  taskId: number;
  mode: "single" | "multiple";
  expanded: boolean;
  disabled?: boolean;
  onChange: (value: number[]) => void; // Use the handler from parent
};

export default function StaffSelect({
  taskId,
  mode,
  expanded,
  disabled,
  onChange,
}: Props) {
  const { staff } = useGetStaffByTaskId(taskId);

  const [selectedStaff, setSelectedStaff] = useState<number[]>([]);

  useEffect(() => {
    if (staff) {
      const initialSelectedStaff = staff
        .filter((member: SelectStaffDTO) => member.isSelected)
        .map((member: SelectStaffDTO) => member.id);

      setSelectedStaff(initialSelectedStaff);
    }
  }, [staff]);

  const handleChange = (event: any) => {
    const { value } = event.target;
    let _selectedStaff: number[] = [];

    if (mode === "multiple") {
      _selectedStaff = value;
    } else {
      if (selectedStaff.length > 0 && selectedStaff[0] === value) {
        _selectedStaff = [];
      } else {
        _selectedStaff = [value];
      }
    }

    // Update locally
    setSelectedStaff(_selectedStaff);

    // Notify parent of the change
    onChange(_selectedStaff);
  };

  // const handleChange = async (event: any) => {
  //   const { value } = event.target;

  //   let _selectedStaff: number[] = [];

  //   if (mode === "multiple") {
  //     _selectedStaff = value;
  //   } else {
  //     if (selectedStaff.length > 0 && selectedStaff[0] === value) {
  //       _selectedStaff = [];
  //     } else {
  //       _selectedStaff = [value];
  //     }
  //   }

  //   // Update locally
  //   setSelectedStaff(_selectedStaff);

  //   // Update on the server
  //   const updateTaskStaffDTO: UpdateTaskStaffDTO = {
  //     taskId,
  //     staffIds: _selectedStaff,
  //   };
  //   await updateTaskStaff(updateTaskStaffDTO);
  // };

  const renderValue = (selected: any) => {
    if (selected !== null && selected.length > 0) {
      const staffMember = staff?.find(
        (s: SelectStaffDTO) => s.id === selected[0]
      );

      if (staffMember) {
        return (
          <Stack direction="row" alignItems="center" spacing={0.25}>
            <Avatar
              src={staffMember.photo_url || ""}
              alt={staffMember.full_name}
              style={{ marginRight: 4, width: 20, height: 20 }}
            />
            {expanded && (
              <Typography variant="body1">
                {staffMember.full_name.length > 10
                  ? `${staffMember.full_name.substring(0, 10)}...`
                  : staffMember.full_name}
              </Typography>
            )}

            {selected.length > 1 && (
              <Chip
                label="2+"
                size="small"
                sx={{
                  borderRadius: "100px",
                  backgroundColor: "#F4F4F4",
                  color: "#1A1A1A",
                  fontWeight: 700,
                  "&:hover": {
                    backgroundColor: "#F4F4F4",
                  },
                }}
              />
            )}
          </Stack>
        );
      }
    }

    return null;
  };

  if (!staff || staff?.length === 0) {
    return null;
  }

  return (
    <Select
      multiple={mode === "multiple"}
      value={selectedStaff}
      onChange={handleChange}
      disabled={disabled}
      sx={{
        minWidth: expanded ? 165 : "70px",
        height: 32,
        border: "1px solid #E6E6E6",
        borderRadius: "100px",
      }}
      placeholder="Select Staff"
      renderValue={renderValue}
      MenuProps={{
        anchorOrigin: {
          vertical: "bottom",
          horizontal: "right",
        },
        transformOrigin: {
          vertical: "top",
          horizontal: "right",
        },
      }}
    >
      {staff?.map((member: any) => (
        <MenuItem
          key={member.id}
          value={member.id}
          // sx={{ border: "1px solid #E6E6E6", backgroundColor: "transparent" }}
          sx={{
            border: "1px solid #E6E6E6",
            // backgroundColor: selectedStaff.includes(member.id) ? "#222222!important" : "trasnparent",
            // color: selectedStaff.includes(member.id) ? "white" : "inherit",
          }}
        >
          <Avatar
            src={member.photo_url}
            alt={member.full_name}
            style={{ marginRight: 4, width: 20, height: 20 }}
          />
          <ListItemText
            primary={member.full_name}
            sx={{ fontWeight: 600, fontSize: 16 }}
          />
          {selectedStaff?.includes(member.id) && (
            <Iconify icon="mdi:close" sx={{ ml: 0.5 }} />
          )}
        </MenuItem>
      ))}
    </Select>
  );
}
