
interface PageLayoutProps {
  children: React.ReactNode;
}

// Really doesn't need to do anything
const PageLayout: React.FC<PageLayoutProps> = ({ children }) => {
  return children;
}

export default PageLayout;
