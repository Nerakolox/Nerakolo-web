export default function SectionLabel({ children, english }) {
  return <p className="section-label"><span>{children}</span><span>{english}</span></p>
}
