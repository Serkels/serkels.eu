import {
  Body,
  Container,
  Head,
  Heading,
  Html,
  Img,
  Link,
  Preview,
  Text,
} from "@react-email/components";

//

export const TocTocMagicLinkEmail = ({
  base_url = "https://toc-toc.org",
  url = "https://toc-toc.org",
}) => (
  <Html>
    <Head />
    <Preview>Log in with this magic link</Preview>
    <Body style={main}>
      <Container style={container}>
        <Heading style={h1}>Login</Heading>
        <Link
          href={`${url}`}
          target="_blank"
          rel="noopener noreferrer"
          style={{
            ...link,
            display: "block",
            marginBottom: "16px",
          }}
        >
          Veuillez cliquer ce lien pour vous connecter.
          {/* Click here to log in with this magic link */}
        </Link>
        {/*<Text style={{ ...text, marginBottom: "14px" }}>
          Or, copy and paste this temporary login code:
        </Text>
        <code style={code}>{loginCode}</code>
        <Text
          style={{
            ...text,
            color: "#ababab",
            marginTop: "14px",
            marginBottom: "16px",
          }}
        >
          If you didn&apos;t try to login, you can safely ignore this email.
        </Text>
         <Text
          style={{
            ...text,
            color: "#ababab",
            marginTop: "12px",
            marginBottom: "38px",
          }}
        >
          Hint: You can set a permanent password in Settings & members → My
          account.
        </Text> */}
        <Img
          src={`${base_url}/opengraph-image.png`}
          width="32"
          height="32"
          alt="TocToc's Logo"
        />
        <Text style={footer}>
          <Link
            href="https://toc-toc.org/"
            target="_blank"
            style={{ ...link, color: "#898989" }}
          >
            toc-toc.org
          </Link>
          ,
          <br />
          Réseau d'échanges étudiant.
        </Text>
      </Container>
    </Body>
  </Html>
);

export default TocTocMagicLinkEmail;

const main = {
  backgroundColor: "#ffffff",
};

const container = {
  paddingLeft: "12px",
  paddingRight: "12px",
  margin: "0 auto",
};

const h1 = {
  color: "#333",
  fontFamily:
    "-apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen', 'Ubuntu', 'Cantarell', 'Fira Sans', 'Droid Sans', 'Helvetica Neue', sans-serif",
  fontSize: "24px",
  fontWeight: "bold",
  margin: "40px 0",
  padding: "0",
};

const link = {
  color: "#2754C5",
  fontFamily:
    "-apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen', 'Ubuntu', 'Cantarell', 'Fira Sans', 'Droid Sans', 'Helvetica Neue', sans-serif",
  fontSize: "14px",
  textDecoration: "underline",
};

const footer = {
  color: "#898989",
  fontFamily:
    "-apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen', 'Ubuntu', 'Cantarell', 'Fira Sans', 'Droid Sans', 'Helvetica Neue', sans-serif",
  fontSize: "12px",
  lineHeight: "22px",
  marginTop: "12px",
  marginBottom: "24px",
};
