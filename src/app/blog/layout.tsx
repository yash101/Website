interface BlogLayoutProps {
  children: React.ReactNode;
}

// Really doesn't need to do anything
const BlogLayout: React.FC<BlogLayoutProps> = ({ children }) => {
  return children;
}

export default BlogLayout;
