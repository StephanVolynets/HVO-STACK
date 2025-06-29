import { forwardRef } from "react";
import Link, { LinkProps } from "next/link";

// ----------------------------------------------------------------------

const RouterLink = forwardRef<HTMLAnchorElement, LinkProps>(({ ...other }, ref) => <Link ref={ref} {...other} />);

RouterLink.displayName = "RouterLink";

export default RouterLink;
