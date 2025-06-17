import { Box, Button, SvgIcon, Typography } from "@mui/material";
import { StaticImport } from "next/dist/shared/lib/get-img-props";
import Image from "next/image";
import SvgColor from "./svg-color";

interface IPlaceholderComponentProps {
  // icon: string | StaticImport;
  src: string;
  title?: string;
  description?: string;
  buttonText?: string;
  onClick?: () => void;
}

const PlaceholderComponent = ({ src, title, description, buttonText, onClick }: IPlaceholderComponentProps) => {
  return (
    <Box display="flex" justifyContent="center" flexDirection="column" my={12}>
      <Box display="flex" flexDirection="column" justifyContent="center" alignItems="center">
        {/* {icon && <Image src={icon} alt="favorites" width={40} height={40} />} */}
        {src && <SvgColor src={src} sx={{ width: 60, height: 60 }} color="primary.main" />}

        <Typography mt={3} variant="h4">
          {title}
        </Typography>

        <Typography mb={2} variant="body2">
          {description}
        </Typography>
      </Box>
    </Box>
  );
};

export default PlaceholderComponent;
