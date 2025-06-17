import * as React from "react";
import { Body, Container, Html, Text } from "@react-email/components";

interface WrapperProps {
  children: React.ReactNode;
  footerText?: string;
}

export const EmailWrapper: React.FC<WrapperProps> = ({
  children,
  footerText = "Thanks",
}) => {
  return (
    <Html>
      <Body
        style={{ backgroundColor: "#f9f9f9", fontFamily: "Arial, sans-serif" }}
      >
        <Container
          style={{
            margin: "0 auto",
            padding: "20px",
            backgroundColor: "#ffffff",
            borderRadius: "8px",
            width: "600px",
            border: "1px solid #dddddd",
          }}
        >
          {children}
          <Text style={{ fontSize: "16px", marginTop: "20px", color: "#333" }}>
            {footerText}
          </Text>
        </Container>
      </Body>
    </Html>
  );
};
