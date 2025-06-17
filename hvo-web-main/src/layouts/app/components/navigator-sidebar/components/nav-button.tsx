import { useActiveLink, useRouter } from "@/routes/hooks";
import { Button } from "@mui/material";
import { m } from "framer-motion";
import { NavItem } from "../config-navigation";

interface NavButtonProps {
  item: NavItem;
  isExpanded?: boolean;
  onClick?: () => void;
}

export default function NavButton({
  item,
  isExpanded = true,
  onClick,
}: NavButtonProps) {
  const active = useActiveLink(item.path, false);
  const router = useRouter();

  const handleClick = () => {
    if (onClick) {
      onClick();
      return;
    }

    if (item.path) {
      router.push(item.path);
    }
  };

  return (
    <Button
      size="large"
      key={item.title}
      startIcon={item.icon}
      sx={{
        justifyContent: "flex-start",
        // justifyContent: isExpanded   ? "flex-start" : "center",
        // pl: isExpanded ? 2.5 : 1,
        // pl: 2.5,
        px: 2.5,
        minWidth: 0,
        width: "100%",
        overflow: "hidden",
        "&:hover": {
          backgroundColor: "rgba(38, 38, 38, 0.05)",
        },
        ...(active && {
          backgroundColor: "rgba(38, 38, 38, 0.10)",
          cursor: "default",
          pointerEvents: "none",
        }),
        "& .MuiButton-startIcon": {
          marginRight: isExpanded ? 1 : 0,
        },
      }}
      onClick={handleClick}
    >
      {isExpanded && (
        <m.div
          initial={{ opacity: 0, width: 0 }}
          animate={{ opacity: 1, width: "auto" }}
          exit={{ opacity: 0, width: 0 }}
          transition={{ duration: 0.15, delay: 0.1 }}
          style={{
            whiteSpace: "nowrap",
            overflow: "hidden",
            textOverflow: "ellipsis",
          }}
        >
          {item.title}
        </m.div>
      )}
    </Button>
  );
}
