import { guardMaintenance } from "@/lib/maintenance";
import ContactForm from "@/components/ContactForm";

export default async function ContactPage() {
  await guardMaintenance();
  return <ContactForm />;
}
