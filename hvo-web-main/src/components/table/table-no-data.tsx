import TableRow from "@mui/material/TableRow";
import TableCell from "@mui/material/TableCell";
import { Theme, SxProps } from "@mui/material/styles";

import EmptyContent from "../empty-content";

// ----------------------------------------------------------------------

type Props = {
  notFound: boolean;
  title?: string;
  description?: string;
  sx?: SxProps<Theme>;
};

export default function TableNoData({ notFound, title = "No Data", description, sx }: Props) {
  return (
    <TableRow>
      {notFound ? (
        <TableCell colSpan={12}>
          <EmptyContent
            filled
            title={title}
            description={description}
            sx={{
              py: 10,
              ...sx,
            }}
          />
        </TableCell>
      ) : (
        <TableCell colSpan={12} sx={{ p: 0 }} />
      )}
    </TableRow>
  );
}
