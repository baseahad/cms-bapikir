import {
  Body,
  Column,
  Container,
  Head,
  Heading,
  Hr,
  Html,
  Preview,
  Row,
  Section,
  Text,
} from "@react-email/components";

type InvoiceItem = {
  name: string;
  price: number;
};

type InvoiceEmailProps = {
  customerName?: string;
  orderId?: string;
  plan?: string;
  items?: InvoiceItem[];
  total?: number;
  paidAt?: string;
};

export function InvoiceEmail({
  customerName = "Developer",
  orderId = "KK-000000-XXXXXXXX",
  plan = "Pro",
  items = [{ name: "Pro", price: 299000 }],
  total = 299000,
  paidAt = new Date().toLocaleDateString("id-ID", {
    day: "numeric",
    month: "long",
    year: "numeric",
  }),
}: InvoiceEmailProps) {
  return (
    <Html lang="id">
      <Head />
      <Preview>Invoice CMS Bapikir #{orderId}</Preview>
      <Body style={styles.body}>
        <Container style={styles.container}>
          <Heading style={styles.heading}>CMS Bapikir</Heading>
          <Text style={styles.subheading}>Invoice Pembayaran</Text>

          <Section style={styles.metaSection}>
            <Row>
              <Column>
                <Text style={styles.metaLabel}>Nomor Invoice</Text>
                <Text style={styles.metaValue}>{orderId}</Text>
              </Column>
              <Column>
                <Text style={styles.metaLabel}>Tanggal Bayar</Text>
                <Text style={styles.metaValue}>{paidAt}</Text>
              </Column>
            </Row>
            <Row>
              <Column>
                <Text style={styles.metaLabel}>Pelanggan</Text>
                <Text style={styles.metaValue}>{customerName}</Text>
              </Column>
              <Column>
                <Text style={styles.metaLabel}>Paket</Text>
                <Text style={styles.metaValue}>{plan}</Text>
              </Column>
            </Row>
          </Section>

          <Hr style={styles.hr} />

          <Section>
            <Row style={styles.tableHeader}>
              <Column>
                <Text style={styles.tableHeaderText}>Item</Text>
              </Column>
              <Column>
                <Text style={{ ...styles.tableHeaderText, textAlign: "right" }}>
                  Harga
                </Text>
              </Column>
            </Row>
            {items.map((item, i) => (
              <Row key={i} style={styles.tableRow}>
                <Column>
                  <Text style={styles.tableCell}>{item.name}</Text>
                </Column>
                <Column>
                  <Text style={{ ...styles.tableCell, textAlign: "right" }}>
                    {formatRupiah(item.price)}
                  </Text>
                </Column>
              </Row>
            ))}
          </Section>

          <Hr style={styles.hr} />

          <Section>
            <Row>
              <Column>
                <Text style={styles.totalLabel}>Total</Text>
              </Column>
              <Column>
                <Text style={styles.totalValue}>{formatRupiah(total)}</Text>
              </Column>
            </Row>
          </Section>

          <Hr style={styles.hr} />

          <Text style={styles.footer}>
            Terima kasih sudah pakai CMS Bapikir! Kalau ada pertanyaan soal
            invoice ini, hubungi kami di Discord.
          </Text>
        </Container>
      </Body>
    </Html>
  );
}

function formatRupiah(amount: number): string {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    minimumFractionDigits: 0,
  }).format(amount);
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
    marginBottom: "4px",
  },
  subheading: {
    fontSize: "14px",
    color: "#6b7280",
    marginTop: "0",
    marginBottom: "24px",
  },
  metaSection: {
    marginBottom: "16px",
  },
  metaLabel: {
    fontSize: "12px",
    color: "#6b7280",
    marginBottom: "2px",
    textTransform: "uppercase" as const,
    letterSpacing: "0.05em",
  },
  metaValue: {
    fontSize: "14px",
    color: "#111827",
    fontWeight: "500",
    marginTop: "0",
  },
  hr: {
    borderColor: "#e5e7eb",
    margin: "16px 0",
  },
  tableHeader: {
    borderBottom: "1px solid #e5e7eb",
    paddingBottom: "8px",
  },
  tableHeaderText: {
    fontSize: "12px",
    fontWeight: "600",
    color: "#6b7280",
    textTransform: "uppercase" as const,
    letterSpacing: "0.05em",
  },
  tableRow: {
    paddingTop: "8px",
    paddingBottom: "8px",
  },
  tableCell: {
    fontSize: "14px",
    color: "#374151",
  },
  totalLabel: {
    fontSize: "15px",
    fontWeight: "700",
    color: "#111827",
  },
  totalValue: {
    fontSize: "15px",
    fontWeight: "700",
    color: "#111827",
    textAlign: "right" as const,
  },
  footer: {
    fontSize: "13px",
    color: "#6b7280",
    marginTop: "8px",
  },
};

export default InvoiceEmail;
