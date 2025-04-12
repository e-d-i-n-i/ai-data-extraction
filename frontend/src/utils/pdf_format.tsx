import type React from "react";
import { Document, Page, Text, View, StyleSheet } from "@react-pdf/renderer";
import ReactMarkdown from "react-markdown";

// Create styles
const styles = StyleSheet.create({
  page: {
    flexDirection: "column",
    backgroundColor: "#ffffff",
    padding: 30,
  },
  header: {
    marginBottom: 20,
    borderBottomWidth: 1,
    borderBottomColor: "#000000",
    paddingBottom: 10,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 10,
  },
  content: {
    fontSize: 12,
    lineHeight: 1.5,
  },
  section: {
    margin: 10,
    padding: 10,
  },
  text: {
    marginBottom: 10,
  },
});

// Custom renderer for Markdown components
const renderers = {
  h1: ({ children }) => (
    <Text style={{ fontSize: 20, fontWeight: "bold", marginBottom: 10 }}>
      {children}
    </Text>
  ),
  h2: ({ children }) => (
    <Text style={{ fontSize: 18, fontWeight: "bold", marginBottom: 8 }}>
      {children}
    </Text>
  ),
  p: ({ children }) => <Text style={styles.text}>{children}</Text>,
  ul: ({ children }) => <View style={{ marginLeft: 20 }}>{children}</View>,
  li: ({ children }) => <Text style={{ marginBottom: 5 }}>• {children}</Text>,
  strong: ({ children }) => (
    <Text style={{ fontWeight: "bold" }}>{children}</Text>
  ),
};

interface PDFDocumentProps {
  markdown: string;
}

const PDFDocument: React.FC<PDFDocumentProps> = ({ markdown }) => (
  <Document>
    <Page size="A4" style={styles.page}>
      <View style={styles.header}>
        <Text style={styles.title}>Reasoning Document</Text>
      </View>
      <View style={styles.content}>
        <ReactMarkdown components={renderers}>{markdown}</ReactMarkdown>
      </View>
    </Page>
  </Document>
);

export default PDFDocument;
