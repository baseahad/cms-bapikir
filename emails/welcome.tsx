import {
  Body,
  Button,
  Container,
  Head,
  Heading,
  Html,
  Preview,
  Section,
  Text,
} from "@react-email/components";

type WelcomeEmailProps = {
  name?: string;
  dashboardUrl?: string;
};

export function WelcomeEmail({
  name = "Developer",
  dashboardUrl = "https://kilatkoding.com/dashboard",
}: WelcomeEmailProps) {
  return (
    <Html lang="id">
      <Head />
      <Preview>Selamat datang di CMS Bapikir 🚀</Preview>
      <Body style={styles.body}>
        <Container style={styles.container}>
          <Heading style={styles.heading}>CMS Bapikir</Heading>

          <Section>
            <Text style={styles.text}>Hei {name},</Text>
            <Text style={styles.text}>
              Selamat datang di CMS Bapikir! Akun kamu udah siap.
            </Text>
            <Text style={styles.text}>
              Sekarang kamu bisa mulai pakai boilerplate-nya dan langsung fokus
              bikin produk — bukan setup yang itu-itu aja.
            </Text>
          </Section>

          <Section style={styles.buttonSection}>
            <Button href={dashboardUrl} style={styles.button}>
              Buka Dashboard
            </Button>
          </Section>

          <Section>
            <Text style={styles.footer}>
              Kalau ada pertanyaan, langsung tanya di Discord community kita ya.
            </Text>
            <Text style={styles.footer}>— Avathur Rahman</Text>
          </Section>
        </Container>
      </Body>
    </Html>
  );
}

const styles = {
  body: {
    backgroundColor: "#f9fafb",
    fontFamily: "Inter, -apple-system, sans-serif",
  },
  container: {
    maxWidth: "560px",
    margin: "0 auto",
    padding: "40px 24px",
    backgroundColor: "#ffffff",
    borderRadius: "8px",
  },
  heading: {
    fontSize: "24px",
    fontWeight: "700",
    color: "#111827",
    marginBottom: "24px",
  },
  text: {
    fontSize: "15px",
    lineHeight: "24px",
    color: "#374151",
    marginBottom: "12px",
  },
  buttonSection: {
    marginTop: "24px",
    marginBottom: "24px",
  },
  button: {
    backgroundColor: "#2563eb",
    color: "#ffffff",
    borderRadius: "6px",
    padding: "12px 24px",
    fontSize: "14px",
    fontWeight: "600",
    textDecoration: "none",
    display: "inline-block",
  },
  footer: {
    fontSize: "13px",
    color: "#6b7280",
    marginBottom: "4px",
  },
};

export default WelcomeEmail;
